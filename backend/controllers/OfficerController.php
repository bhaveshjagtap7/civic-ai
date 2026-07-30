<?php
// backend/controllers/OfficerController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class OfficerController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Get Officer Dashboard Summary & Assigned Tasks
    public function dashboard() {
        $officer = AuthMiddleware::requireRole(['Officer', 'Admin']);
        $deptId = $officer['department_id'] ? intval($officer['department_id']) : null;

        $params = [];
        $whereDept = "";
        $whereDeptAnd = "";

        if ($deptId) {
            $whereDept = "WHERE department_id = ?";
            $whereDeptAnd = "WHERE c.department_id = ?";
            $params[] = $deptId;
        }

        // Stat 1: Assigned Complaints
        $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM complaints {$whereDept}");
        $stmt->execute($params);
        $totalAssigned = $stmt->fetch()['total'];

        // Stat 2: In Progress
        $sql2 = "SELECT COUNT(*) as total FROM complaints " . ($whereDept ? "{$whereDept} AND status = 'In Progress'" : "WHERE status = 'In Progress'");
        $stmt = $this->db->prepare($sql2);
        $stmt->execute($params);
        $inProgress = $stmt->fetch()['total'];

        // Stat 3: Resolved
        $sql3 = "SELECT COUNT(*) as total FROM complaints " . ($whereDept ? "{$whereDept} AND status = 'Resolved'" : "WHERE status = 'Resolved'");
        $stmt = $this->db->prepare($sql3);
        $stmt->execute($params);
        $resolved = $stmt->fetch()['total'];

        // Stat 4: Pending / Action Required
        $sql4 = "SELECT COUNT(*) as total FROM complaints " . ($whereDept ? "{$whereDept} AND status IN ('Submitted', 'Assigned')" : "WHERE status IN ('Submitted', 'Assigned')");
        $stmt = $this->db->prepare($sql4);
        $stmt->execute($params);
        $pendingAction = $stmt->fetch()['total'];

        // Stat 5: High / Critical Priority Alerts Count
        $sql5 = "SELECT COUNT(*) as total FROM complaints " . ($whereDept ? "{$whereDept} AND priority IN ('High', 'Critical') AND status != 'Resolved'" : "WHERE priority IN ('High', 'Critical') AND status != 'Resolved'");
        $stmt = $this->db->prepare($sql5);
        $stmt->execute($params);
        $highPriorityAlerts = $stmt->fetch()['total'];

        // Department Resolution Performance %
        $deptPerformance = $totalAssigned > 0 ? round(($resolved / $totalAssigned) * 100, 1) : 100;

        // Recent Timeline Activities for Department
        $sqlLogs = "
            SELECT l.*, u.name as user_name, u.role as user_role, c.complaint_number, c.title as complaint_title
            FROM complaint_logs l
            JOIN complaints c ON l.complaint_id = c.id
            LEFT JOIN users u ON l.action_by_user_id = u.id
            {$whereDeptAnd}
            ORDER BY l.created_at DESC
            LIMIT 6
        ";
        $stmt = $this->db->prepare($sqlLogs);
        $stmt->execute($params);
        $timelineActivities = $stmt->fetchAll();

        // Recent Assigned Complaints
        $sql = "
            SELECT c.*, u.name as citizen_name, u.phone as citizen_phone
            FROM complaints c
            LEFT JOIN users u ON c.citizen_id = u.id
            {$whereDept}
            ORDER BY FIELD(c.priority, 'Critical', 'High', 'Medium', 'Low'), c.created_at DESC
            LIMIT 10
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $recentComplaints = $stmt->fetchAll();

        Response::success([
            'metrics' => [
                'total_assigned' => (int)$totalAssigned,
                'in_progress' => (int)$inProgress,
                'resolved' => (int)$resolved,
                'pending_action' => (int)$pendingAction,
                'high_priority_alerts' => (int)$highPriorityAlerts,
                'department_performance' => $deptPerformance
            ],
            'recent_complaints' => $recentComplaints,
            'complaint_timeline' => $timelineActivities
        ]);
    }
}
