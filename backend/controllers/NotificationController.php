<?php
// backend/controllers/NotificationController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class NotificationController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function index() {
        $user = AuthMiddleware::authenticate();
        $stmt = $this->db->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30");
        $stmt->execute([$user['id']]);
        Response::success($stmt->fetchAll());
    }

    public function markAsRead($id) {
        $user = AuthMiddleware::authenticate();
        $stmt = $this->db->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user['id']]);
        Response::success([], "Marked as read.");
    }

    public function markAllAsRead() {
        $user = AuthMiddleware::authenticate();
        $stmt = $this->db->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        Response::success([], "All notifications marked as read.");
    }
}
