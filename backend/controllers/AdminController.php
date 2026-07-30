<?php
// backend/controllers/AdminController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class AdminController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Get Admin Platform Dashboard Summary
    public function dashboard() {
        AuthMiddleware::requireRole(['Admin']);

        $totalUsers = $this->db->query("SELECT COUNT(*) as count FROM users WHERE role = 'Citizen'")->fetch()['count'];
        $totalOfficers = $this->db->query("SELECT COUNT(*) as count FROM users WHERE role = 'Officer'")->fetch()['count'];
        $totalDepts = $this->db->query("SELECT COUNT(*) as count FROM departments")->fetch()['count'];
        $totalComplaints = $this->db->query("SELECT COUNT(*) as count FROM complaints")->fetch()['count'];
        $resolvedComplaints = $this->db->query("SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'")->fetch()['count'];
        $pendingComplaints = $this->db->query("SELECT COUNT(*) as count FROM complaints WHERE status IN ('Submitted', 'Assigned', 'In Progress')")->fetch()['count'];
        $rejectedComplaints = $this->db->query("SELECT COUNT(*) as count FROM complaints WHERE status = 'Rejected'")->fetch()['count'];

        $resolutionRate = $totalComplaints > 0 ? round(($resolvedComplaints / $totalComplaints) * 100, 1) : 100;

        // Recent users
        $recentUsers = $this->db->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5")->fetchAll();

        // Department workload
        $deptWorkload = $this->db->query("
            SELECT d.name, d.code, COUNT(c.id) as total_complaints,
                   SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END) as resolved_count
            FROM departments d
            LEFT JOIN complaints c ON d.id = c.department_id
            GROUP BY d.id
        ")->fetchAll();

        // Live Activity Feed (Audit Logs)
        $liveActivity = $this->db->query("
            SELECT l.*, u.name as user_name, u.role as user_role, c.complaint_number, c.title as complaint_title
            FROM complaint_logs l
            LEFT JOIN users u ON l.action_by_user_id = u.id
            LEFT JOIN complaints c ON l.complaint_id = c.id
            ORDER BY l.created_at DESC
            LIMIT 10
        ")->fetchAll();

        // Feedback Summary
        $avgRatingStmt = $this->db->query("SELECT AVG(rating) as avg_rating, COUNT(rating) as total_reviews FROM complaints WHERE rating IS NOT NULL");
        $avgRatingRow = $avgRatingStmt->fetch();
        $recentFeedback = $this->db->query("
            SELECT c.id, c.complaint_number, c.rating, c.feedback_notes, u.name as citizen_name
            FROM complaints c
            JOIN users u ON c.citizen_id = u.id
            WHERE c.rating IS NOT NULL
            ORDER BY c.updated_at DESC
            LIMIT 5
        ")->fetchAll();

        // System Settings / Health
        $settings = $this->db->query("SELECT setting_key, setting_value FROM system_settings")->fetchAll();
        $settingsMap = [];
        foreach ($settings as $s) {
            $settingsMap[$s['setting_key']] = $s['setting_value'];
        }

        Response::success([
            'counts' => [
                'citizens' => (int)$totalUsers,
                'officers' => (int)$totalOfficers,
                'departments' => (int)$totalDepts,
                'total_complaints' => (int)$totalComplaints,
                'resolved_complaints' => (int)$resolvedComplaints,
                'pending_complaints' => (int)$pendingComplaints,
                'rejected_complaints' => (int)$rejectedComplaints,
                'resolution_rate' => $resolutionRate
            ],
            'recent_users' => $recentUsers,
            'department_workload' => $deptWorkload,
            'live_activity_feed' => $liveActivity,
            'feedback_summary' => [
                'avg_rating' => $avgRatingRow && $avgRatingRow['avg_rating'] !== null ? round($avgRatingRow['avg_rating'], 1) : 4.8,
                'total_reviews' => $avgRatingRow ? (int)$avgRatingRow['total_reviews'] : 0,
                'recent_reviews' => $recentFeedback
            ],
            'system_health' => $settingsMap
        ]);
    }

    // Users Management - List All Users
    public function getUsers() {
        AuthMiddleware::requireRole(['Admin']);

        $role = isset($_GET['role']) ? trim($_GET['role']) : '';
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';

        $where = [];
        $params = [];

        if ($role !== '') {
            $where[] = "u.role = ?";
            $params[] = $role;
        }

        if ($search !== '') {
            $where[] = "(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)";
            $s = "%{$search}%";
            $params[] = $s;
            $params[] = $s;
            $params[] = $s;
        }

        $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $sql = "
            SELECT u.id, u.name, u.email, u.role, u.phone, u.address, u.department_id, u.created_at,
                   d.name as department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            {$whereSql}
            ORDER BY u.created_at DESC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $users = $stmt->fetchAll();

        Response::success($users);
    }

    // Create Officer / User (Admin)
    public function createUser() {
        AuthMiddleware::requireRole(['Admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || empty($input['name']) || empty($input['email']) || empty($input['password']) || empty($input['role'])) {
            Response::error("Name, email, password, and role are required.", 400);
        }

        $name = trim(htmlspecialchars($input['name']));
        $email = strtolower(trim($input['email']));
        $password = password_hash($input['password'], PASSWORD_BCRYPT);
        $role = $input['role'];
        $phone = isset($input['phone']) ? trim($input['phone']) : null;
        $deptId = isset($input['department_id']) ? intval($input['department_id']) : null;

        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            Response::error("User with this email already exists.", 409);
        }

        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, role, phone, department_id) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $password, $role, $phone, $deptId]);

        Response::success(['id' => $this->db->lastInsertId()], "User created successfully!", 201);
    }

    // Update User Role/Department (Admin)
    public function updateUser($id) {
        AuthMiddleware::requireRole(['Admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        $name = isset($input['name']) ? trim(htmlspecialchars($input['name'])) : null;
        $role = isset($input['role']) ? trim($input['role']) : null;
        $deptId = isset($input['department_id']) ? intval($input['department_id']) : null;
        $phone = isset($input['phone']) ? trim($input['phone']) : null;

        $stmt = $this->db->prepare("
            UPDATE users SET 
                name = COALESCE(?, name),
                role = COALESCE(?, role),
                department_id = COALESCE(?, department_id),
                phone = COALESCE(?, phone)
            WHERE id = ?
        ");
        $stmt->execute([$name, $role, $deptId, $phone, $id]);

        Response::success([], "User profile updated successfully!");
    }

    // Delete User
    public function deleteUser($id) {
        AuthMiddleware::requireRole(['Admin']);
        $this->db->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
        Response::success([], "User deleted successfully.");
    }

    // List & Manage Departments
    public function getDepartments() {
        AuthMiddleware::authenticate();
        $stmt = $this->db->query("
            SELECT d.*, COUNT(u.id) as officer_count, COUNT(c.id) as complaint_count
            FROM departments d
            LEFT JOIN users u ON d.id = u.department_id AND u.role = 'Officer'
            LEFT JOIN complaints c ON d.id = c.department_id
            GROUP BY d.id
            ORDER BY d.name ASC
        ");
        Response::success($stmt->fetchAll());
    }

    public function createDepartment() {
        AuthMiddleware::requireRole(['Admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || empty($input['name']) || empty($input['code'])) {
            Response::error("Department name and code are required.", 400);
        }

        $stmt = $this->db->prepare("INSERT INTO departments (name, code, description, head_name, contact_email, icon) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            trim($input['name']),
            strtoupper(trim($input['code'])),
            isset($input['description']) ? trim($input['description']) : null,
            isset($input['head_name']) ? trim($input['head_name']) : null,
            isset($input['contact_email']) ? trim($input['contact_email']) : null,
            isset($input['icon']) ? trim($input['icon']) : 'Building2'
        ]);

        Response::success(['id' => $this->db->lastInsertId()], "Department created successfully!", 201);
    }

    // System Settings Get/Save
    public function getSettings() {
        AuthMiddleware::requireRole(['Admin']);
        $stmt = $this->db->query("SELECT * FROM system_settings");
        Response::success($stmt->fetchAll());
    }

    public function updateSettings() {
        AuthMiddleware::requireRole(['Admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        if (is_array($input)) {
            $stmt = $this->db->prepare("UPDATE system_settings SET setting_value = ? WHERE setting_key = ?");
            foreach ($input as $key => $val) {
                $stmt->execute([$val, $key]);
            }
        }

        Response::success([], "System settings updated successfully!");
    }
}
