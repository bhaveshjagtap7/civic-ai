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
        $deptId = $officer['department_id'];

        $whereDept = $deptId ? "WHERE department_id = {$deptId}" : "";

        // Stat 1: Assigned Complaints
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM complaints {$whereDept}");
        $totalAssigned = $stmt->fetch()['total'];

        // Stat 2: In Progress
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM complaints " . ($whereDept ? "{$whereDept} AND status = 'In Progress'" : "WHERE status = 'In Progress'"));
        $inProgress = $stmt->fetch()['total'];

        // Stat 3: Resolved
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM complaints " . ($whereDept ? "{$whereDept} AND status = 'Resolved'" : "WHERE status = 'Resolved'"));
        $resolved = $stmt->fetch()['total'];

        // Stat 4: Pending / Action Required
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM complaints " . ($whereDept ? "{$whereDept} AND status IN ('Submitted', 'Assigned')" : "WHERE status IN ('Submitted', 'Assigned')"));
        $pendingAction = $stmt->fetch()['total'];

        // Priority distribution for officer department
        $stmt = $this->db->query("SELECT priority, COUNT(*) as count FROM complaints {$whereDept} GROUP BY priority");
        $priorityCounts = $stmt->fetchAll();

        // Recent Assigned Complaints
        $sql = "
            SELECT c.*, u.name as citizen_name, u.phone as citizen_phone
            FROM complaints c
            LEFT JOIN users u ON c.citizen_id = u.id
            {$whereDept}
            ORDER BY FIELD(c.priority, 'Critical', 'High', 'Medium', 'Low'), c.created_at DESC
            LIMIT 10
        ";
        $recentComplaints = $this->db->query($sql)->fetchAll();

        Response::success([
            'metrics' => [
                'total_assigned' => (int)$totalAssigned,
                'in_progress' => (int)$inProgress,
                'resolved' => (int)$resolved,
                'pending_action' => (int)$pendingAction
            ],
            'priority_distribution' => $priorityCounts,
            'recent_complaints' => $recentComplaints
        ]);
    }
}
