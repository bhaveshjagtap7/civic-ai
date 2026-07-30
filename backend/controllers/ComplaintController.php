<?php
// backend/controllers/ComplaintController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/gemini.php';
require_once __DIR__ . '/../middleware/auth.php';

class ComplaintController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Submit a New Complaint with Automated AI Processing
    public function create() {
        $currentUser = AuthMiddleware::authenticate();

        // Handle multipart form-data or JSON payload
        $title = isset($_POST['title']) ? trim($_POST['title']) : null;
        $description = isset($_POST['description']) ? trim($_POST['description']) : null;
        $location = isset($_POST['location']) ? trim($_POST['location']) : 'City Central Area';
        $latitude = isset($_POST['latitude']) ? floatval($_POST['latitude']) : null;
        $longitude = isset($_POST['longitude']) ? floatval($_POST['longitude']) : null;

        if (!$title || !$description) {
            // Check raw JSON payload fallback
            $input = json_decode(file_get_contents('php://input'), true);
            if ($input) {
                $title = isset($input['title']) ? trim($input['title']) : null;
                $description = isset($input['description']) ? trim($input['description']) : null;
                $location = isset($input['location']) ? trim($input['location']) : 'City Central Area';
                $latitude = isset($input['latitude']) ? floatval($input['latitude']) : null;
                $longitude = isset($input['longitude']) ? floatval($input['longitude']) : null;
            }
        }

        if (!$title || !$description) {
            Response::error("Complaint title and description are required.", 400);
        }

        // Process complaint text via Gemini AI Integration
        $aiAnalysis = GeminiAI::processComplaint($title, $description);

        $category = $aiAnalysis['category'];
        $priority = $aiAnalysis['priority'];
        $deptId = $aiAnalysis['department_id'];
        $aiSummary = $aiAnalysis['summary'];
        $aiSuggestedResolution = $aiAnalysis['suggested_resolution'];

        // Generate unique complaint number
        $complaintNumber = 'CIV-' . date('Y') . '-' . strtoupper(substr(uniqid(), -6));

        // Status is Assigned if dept is matched, else Submitted
        $status = 'Submitted';
        $assignedOfficerId = null;

        // Auto-assign officer from department if available
        if ($deptId) {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE role = 'Officer' AND department_id = ? LIMIT 1");
            $stmt->execute([$deptId]);
            $officer = $stmt->fetch();
            if ($officer) {
                $assignedOfficerId = $officer['id'];
                $status = 'Assigned';
            }
        }

        $this->db->beginTransaction();

        try {
            $stmt = $this->db->prepare("
                INSERT INTO complaints (
                    complaint_number, citizen_id, department_id, title, description,
                    category, priority, status, location, latitude, longitude,
                    assigned_officer_id, ai_summary, ai_suggested_resolution
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $complaintNumber,
                $currentUser['id'],
                $deptId,
                $title,
                $description,
                $category,
                $priority,
                $status,
                $location,
                $latitude,
                $longitude,
                $assignedOfficerId,
                $aiSummary,
                $aiSuggestedResolution
            ]);

            $complaintId = $this->db->lastInsertId();

            // Handle Image Uploads if provided in $_FILES
            if (isset($_FILES['images'])) {
                $uploadDir = __DIR__ . '/../uploads/complaints/';
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $files = $_FILES['images'];
                $fileCount = is_array($files['name']) ? count($files['name']) : 1;

                for ($i = 0; $i < $fileCount; $i++) {
                    $fileName = is_array($files['name']) ? $files['name'][$i] : $files['name'];
                    $tmpName = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
                    $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

                    if ($error === UPLOAD_ERR_OK && !empty($tmpName)) {
                        $ext = pathinfo($fileName, PATHINFO_EXTENSION);
                        $uniqueName = 'cmp_' . $complaintId . '_' . time() . '_' . $i . '.' . $ext;
                        $targetPath = $uploadDir . $uniqueName;

                        if (move_uploaded_file($tmpName, $targetPath)) {
                            $imgStmt = $this->db->prepare("INSERT INTO complaint_images (complaint_id, image_url) VALUES (?, ?)");
                            $imgStmt->execute([$complaintId, 'uploads/complaints/' . $uniqueName]);
                        }
                    }
                }
            }

            // Create initial Complaint Log
            $logStmt = $this->db->prepare("INSERT INTO complaint_logs (complaint_id, action_by_user_id, status_from, status_to, comment) VALUES (?, ?, NULL, ?, ?)");
            $logStmt->execute([$complaintId, $currentUser['id'], $status, 'Complaint logged and classified by AI']);

            // Create Notification for Citizen
            $notifStmt = $this->db->prepare("INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)");
            $notifStmt->execute([
                $currentUser['id'],
                'Complaint Logged Successfully',
                "Your complaint {$complaintNumber} has been logged and assigned to " . $aiAnalysis['department'],
                "/complaints/{$complaintId}"
            ]);

            // Create Notification for Officer if assigned
            if ($assignedOfficerId) {
                $notifStmt->execute([
                    $assignedOfficerId,
                    'New Complaint Assigned',
                    "New complaint {$complaintNumber} has been assigned to your department.",
                    "/officer/complaint/{$complaintId}"
                ]);
            }

            $this->db->commit();

            Response::success([
                'complaint_id' => $complaintId,
                'complaint_number' => $complaintNumber,
                'ai_analysis' => $aiAnalysis,
                'status' => $status
            ], "Complaint submitted and classified by AI successfully!", 201);

        } catch (Exception $e) {
            $this->db->rollBack();
            Response::error("Error saving complaint: " . $e->getMessage(), 500);
        }
    }

    // Get List of Complaints (Role-filtered & Search/Filter supported)
    public function index() {
        $currentUser = AuthMiddleware::authenticate();

        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $category = isset($_GET['category']) ? trim($_GET['category']) : '';
        $status = isset($_GET['status']) ? trim($_GET['status']) : '';
        $priority = isset($_GET['priority']) ? trim($_GET['priority']) : '';
        $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
        $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
        $offset = ($page - 1) * $limit;

        $whereClauses = [];
        $params = [];

        // Role-based restrictions
        if ($currentUser['role'] === 'Citizen') {
            $whereClauses[] = "c.citizen_id = ?";
            $params[] = $currentUser['id'];
        } elseif ($currentUser['role'] === 'Officer') {
            // Officer sees complaints for their assigned department or assigned to them
            if (!empty($currentUser['department_id'])) {
                $whereClauses[] = "(c.department_id = ? OR c.assigned_officer_id = ?)";
                $params[] = $currentUser['department_id'];
                $params[] = $currentUser['id'];
            } else {
                $whereClauses[] = "c.assigned_officer_id = ?";
                $params[] = $currentUser['id'];
            }
        }
        // Admin sees all complaints

        // Filters
        if ($search !== '') {
            $whereClauses[] = "(c.complaint_number LIKE ? OR c.title LIKE ? OR c.description LIKE ? OR c.location LIKE ?)";
            $searchTerm = "%{$search}%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if ($category !== '') {
            $whereClauses[] = "c.category = ?";
            $params[] = $category;
        }

        if ($status !== '') {
            $whereClauses[] = "c.status = ?";
            $params[] = $status;
        }

        if ($priority !== '') {
            $whereClauses[] = "c.priority = ?";
            $params[] = $priority;
        }

        $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

        // Total count
        $countSql = "SELECT COUNT(*) as total FROM complaints c {$whereSql}";
        $stmt = $this->db->prepare($countSql);
        $stmt->execute($params);
        $totalRecords = $stmt->fetch()['total'];

        // Data Query
        $sql = "
            SELECT c.*, 
                   u.name as citizen_name, u.email as citizen_email, u.phone as citizen_phone,
                   d.name as department_name, d.code as department_code,
                   o.name as officer_name
            FROM complaints c
            LEFT JOIN users u ON c.citizen_id = u.id
            LEFT JOIN departments d ON c.department_id = d.id
            LEFT JOIN users o ON c.assigned_officer_id = o.id
            {$whereSql}
            ORDER BY c.created_at DESC
            LIMIT {$limit} OFFSET {$offset}
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $complaints = $stmt->fetchAll();

        // Fetch images for each complaint
        foreach ($complaints as &$cmp) {
            $imgStmt = $this->db->prepare("SELECT image_url FROM complaint_images WHERE complaint_id = ?");
            $imgStmt->execute([$cmp['id']]);
            $cmp['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);
        }

        Response::success([
            'complaints' => $complaints,
            'pagination' => [
                'total' => (int)$totalRecords,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($totalRecords / $limit)
            ]
        ]);
    }

    // Get Single Complaint Details
    public function show($id) {
        $currentUser = AuthMiddleware::authenticate();

        $stmt = $this->db->prepare("
            SELECT c.*, 
                   u.name as citizen_name, u.email as citizen_email, u.phone as citizen_phone, u.address as citizen_address,
                   d.name as department_name, d.code as department_code, d.head_name as department_head,
                   o.name as officer_name, o.email as officer_email, o.phone as officer_phone
            FROM complaints c
            LEFT JOIN users u ON c.citizen_id = u.id
            LEFT JOIN departments d ON c.department_id = d.id
            LEFT JOIN users o ON c.assigned_officer_id = o.id
            WHERE c.id = ?
        ");
        $stmt->execute([$id]);
        $complaint = $stmt->fetch();

        if (!$complaint) {
            Response::error("Complaint not found.", 404);
        }

        // Authorization check
        if ($currentUser['role'] === 'Citizen' && $complaint['citizen_id'] != $currentUser['id']) {
            Response::error("Access denied.", 403);
        }

        // Images
        $imgStmt = $this->db->prepare("SELECT id, image_url FROM complaint_images WHERE complaint_id = ?");
        $imgStmt->execute([$id]);
        $complaint['images'] = $imgStmt->fetchAll();

        // Audit Logs / History Timeline
        $logStmt = $this->db->prepare("
            SELECT cl.*, u.name as user_name, u.role as user_role
            FROM complaint_logs cl
            LEFT JOIN users u ON cl.action_by_user_id = u.id
            WHERE cl.complaint_id = ?
            ORDER BY cl.created_at ASC
        ");
        $logStmt->execute([$id]);
        $complaint['timeline'] = $logStmt->fetchAll();

        // Feedback
        $fbStmt = $this->db->prepare("SELECT * FROM feedback WHERE complaint_id = ?");
        $fbStmt->execute([$id]);
        $complaint['feedback'] = $fbStmt->fetch();

        Response::success($complaint);
    }

    // Update Complaint Status & Resolution
    public function updateStatus($id) {
        $currentUser = AuthMiddleware::requireRole(['Officer', 'Admin']);

        $status = isset($_POST['status']) ? trim($_POST['status']) : null;
        $resolutionNotes = isset($_POST['resolution_notes']) ? trim($_POST['resolution_notes']) : null;
        $officerId = isset($_POST['assigned_officer_id']) ? intval($_POST['assigned_officer_id']) : null;
        $deptId = isset($_POST['department_id']) ? intval($_POST['department_id']) : null;

        if (!$status) {
            $input = json_decode(file_get_contents('php://input'), true);
            if ($input) {
                $status = isset($input['status']) ? trim($input['status']) : null;
                $resolutionNotes = isset($input['resolution_notes']) ? trim($input['resolution_notes']) : null;
                $officerId = isset($input['assigned_officer_id']) ? intval($input['assigned_officer_id']) : null;
                $deptId = isset($input['department_id']) ? intval($input['department_id']) : null;
            }
        }

        if (!$status) {
            Response::error("Status field is required.", 400);
        }

        // Fetch existing complaint
        $stmt = $this->db->prepare("SELECT * FROM complaints WHERE id = ?");
        $stmt->execute([$id]);
        $complaint = $stmt->fetch();

        if (!$complaint) {
            Response::error("Complaint not found.", 404);
        }

        $oldStatus = $complaint['status'];

        // Handle Uploaded Resolution Image if status is Resolved
        $resolutionImagePath = $complaint['resolution_image'];
        if (isset($_FILES['resolution_image']) && $_FILES['resolution_image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/resolutions/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $ext = pathinfo($_FILES['resolution_image']['name'], PATHINFO_EXTENSION);
            $uniqueName = 'res_' . $id . '_' . time() . '.' . $ext;
            if (move_uploaded_file($_FILES['resolution_image']['tmp_name'], $uploadDir . $uniqueName)) {
                $resolutionImagePath = 'uploads/resolutions/' . $uniqueName;
            }
        }

        $this->db->beginTransaction();

        try {
            $updateSql = "
                UPDATE complaints SET 
                    status = ?, 
                    resolution_notes = COALESCE(?, resolution_notes), 
                    resolution_image = COALESCE(?, resolution_image),
                    assigned_officer_id = COALESCE(?, assigned_officer_id),
                    department_id = COALESCE(?, department_id),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ";
            $this->db->prepare($updateSql)->execute([$status, $resolutionNotes, $resolutionImagePath, $officerId, $deptId, $id]);

            // Add Audit Log
            $logComment = $resolutionNotes ? $resolutionNotes : "Status changed to {$status}";
            $this->db->prepare("INSERT INTO complaint_logs (complaint_id, action_by_user_id, status_from, status_to, comment) VALUES (?, ?, ?, ?, ?)")
                     ->execute([$id, $currentUser['id'], $oldStatus, $status, $logComment]);

            // Notify Citizen
            $this->db->prepare("INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, 'info', ?)")
                     ->execute([
                         $complaint['citizen_id'],
                         "Complaint Status Updated: {$status}",
                         "Your complaint {$complaint['complaint_number']} status was updated to {$status}.",
                         "/complaints/{$id}"
                     ]);

            $this->db->commit();
            Response::success([], "Complaint status updated to {$status} successfully.");
        } catch (Exception $e) {
            $this->db->rollBack();
            Response::error("Error updating complaint status: " . $e->getMessage(), 500);
        }
    }

    // Submit Citizen Feedback for Resolved Complaint
    public function submitFeedback($id) {
        $currentUser = AuthMiddleware::requireRole(['Citizen']);
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || empty($input['rating'])) {
            Response::error("Rating is required.", 400);
        }

        $rating = intval($input['rating']);
        $comments = isset($input['comments']) ? trim($input['comments']) : '';

        $stmt = $this->db->prepare("SELECT * FROM complaints WHERE id = ? AND citizen_id = ?");
        $stmt->execute([$id, $currentUser['id']]);
        $complaint = $stmt->fetch();

        if (!$complaint) {
            Response::error("Complaint not found or unauthorized.", 404);
        }

        $this->db->beginTransaction();
        try {
            $this->db->prepare("UPDATE complaints SET rating = ?, feedback_notes = ? WHERE id = ?")
                     ->execute([$rating, $comments, $id]);

            $this->db->prepare("INSERT INTO feedback (complaint_id, citizen_id, rating, comments) VALUES (?, ?, ?, ?)")
                     ->execute([$id, $currentUser['id'], $rating, $comments]);

            $this->db->commit();
            Response::success([], "Thank you for your feedback!");
        } catch (Exception $e) {
            $this->db->rollBack();
            Response::error("Error saving feedback: " . $e->getMessage(), 500);
        }
    }

    // Delete Complaint (Admin or Owner Citizen if Submitted)
    public function destroy($id) {
        $currentUser = AuthMiddleware::authenticate();

        $stmt = $this->db->prepare("SELECT * FROM complaints WHERE id = ?");
        $stmt->execute([$id]);
        $complaint = $stmt->fetch();

        if (!$complaint) {
            Response::error("Complaint not found.", 404);
        }

        if ($currentUser['role'] !== 'Admin' && ($complaint['citizen_id'] != $currentUser['id'] || $complaint['status'] !== 'Submitted')) {
            Response::error("You are not authorized to delete this complaint.", 403);
        }

        $this->db->prepare("DELETE FROM complaints WHERE id = ?")->execute([$id]);
        Response::success([], "Complaint deleted successfully.");
    }
}
