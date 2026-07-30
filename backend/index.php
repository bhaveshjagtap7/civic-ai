<?php
// backend/index.php - Central REST API Entrypoint & Router

require_once __DIR__ . '/config/cors.php';
handleCORS();

require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ComplaintController.php';
require_once __DIR__ . '/controllers/OfficerController.php';
require_once __DIR__ . '/controllers/AdminController.php';
require_once __DIR__ . '/controllers/AnalyticsController.php';
require_once __DIR__ . '/controllers/NotificationController.php';
require_once __DIR__ . '/helpers/gemini.php';

// Extract raw URL path and decode URL-encoded characters (e.g. %20 -> space)
$rawUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$rawUri = urldecode($rawUri);

// Normalize backslashes on Windows for SCRIPT_NAME directory
$scriptName = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));

// Strip base script directory prefix if hosted in subdirectory
if (!empty($scriptName) && $scriptName !== '/' && strpos($rawUri, $scriptName) === 0) {
    $rawUri = substr($rawUri, strlen($scriptName));
}

// Strip /index.php if present
$rawUri = preg_replace('@^/index\.php@i', '', $rawUri);

// Trim leading and trailing slashes
$uri = trim($rawUri, '/');

// Strip optional leading 'api/' prefix if present
if (strpos($uri, 'api/') === 0) {
    $uri = substr($uri, 4);
}

$method = $_SERVER['REQUEST_METHOD'];

// Helper matching function for dynamic routes like complaints/{id}
function matchRoute($pattern, $uri, &$matches) {
    // Strip api/ prefix from pattern if present
    $cleanPattern = preg_replace('@^api/@', '', trim($pattern, '/'));
    $regex = "@^" . preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<\1>[^/]+)', $cleanPattern) . "$@";
    return preg_match($regex, $uri, $matches);
}

try {
    // -------------------------------------------------------------
    // Auth Routes
    // -------------------------------------------------------------
    if ($uri === 'auth/register') {
        if ($method === 'POST') (new AuthController())->register();
    } elseif ($uri === 'auth/login') {
        if ($method === 'POST') (new AuthController())->login();
    } elseif ($uri === 'auth/profile') {
        if ($method === 'GET') (new AuthController())->profile();
        if ($method === 'POST' || $method === 'PUT') (new AuthController())->updateProfile();
    } 
    
    // -------------------------------------------------------------
    // Complaint Routes
    // -------------------------------------------------------------
    elseif ($uri === 'complaints') {
        if ($method === 'GET') (new ComplaintController())->index();
        if ($method === 'POST') (new ComplaintController())->create();
    } elseif (matchRoute('complaints/{id}', $uri, $m)) {
        $id = $m['id'];
        if ($method === 'GET') (new ComplaintController())->show($id);
        if ($method === 'DELETE') (new ComplaintController())->destroy($id);
    } elseif (matchRoute('complaints/{id}/status', $uri, $m)) {
        $id = $m['id'];
        if ($method === 'POST' || $method === 'PUT') (new ComplaintController())->updateStatus($id);
    } elseif (matchRoute('complaints/{id}/feedback', $uri, $m)) {
        $id = $m['id'];
        if ($method === 'POST') (new ComplaintController())->submitFeedback($id);
    }

    // -------------------------------------------------------------
    // Officer Routes
    // -------------------------------------------------------------
    elseif ($uri === 'officer/dashboard') {
        if ($method === 'GET') (new OfficerController())->dashboard();
    }

    // -------------------------------------------------------------
    // Admin Routes
    // -------------------------------------------------------------
    elseif ($uri === 'admin/dashboard') {
        if ($method === 'GET') (new AdminController())->dashboard();
    } elseif ($uri === 'admin/users') {
        if ($method === 'GET') (new AdminController())->getUsers();
        if ($method === 'POST') (new AdminController())->createUser();
    } elseif (matchRoute('admin/users/{id}', $uri, $m)) {
        $id = $m['id'];
        if ($method === 'PUT' || $method === 'POST') (new AdminController())->updateUser($id);
        if ($method === 'DELETE') (new AdminController())->deleteUser($id);
    } elseif ($uri === 'admin/departments') {
        if ($method === 'GET') (new AdminController())->getDepartments();
        if ($method === 'POST') (new AdminController())->createDepartment();
    } elseif ($uri === 'admin/settings') {
        if ($method === 'GET') (new AdminController())->getSettings();
        if ($method === 'POST' || $method === 'PUT') (new AdminController())->updateSettings();
    }

    // -------------------------------------------------------------
    // Analytics & Reports
    // -------------------------------------------------------------
    elseif ($uri === 'analytics') {
        if ($method === 'GET') (new AnalyticsController())->index();
    }

    // -------------------------------------------------------------
    // AI Integration Endpoints
    // -------------------------------------------------------------
    elseif ($uri === 'ai/classify') {
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $title = isset($input['title']) ? $input['title'] : '';
            $desc = isset($input['description']) ? $input['description'] : '';
            $res = GeminiAI::processComplaint($title, $desc);
            Response::success($res);
        }
    } elseif ($uri === 'ai/chat') {
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $msg = isset($input['message']) ? $input['message'] : '';
            $complaints = isset($input['complaints']) ? $input['complaints'] : [];
            $reply = GeminiAI::generateChatResponse($msg, $complaints);
            Response::success(['reply' => $reply]);
        }
    }

    // -------------------------------------------------------------
    // Notification Routes
    // -------------------------------------------------------------
    elseif ($uri === 'notifications') {
        if ($method === 'GET') (new NotificationController())->index();
    } elseif (matchRoute('notifications/{id}/read', $uri, $m)) {
        if ($method === 'POST') (new NotificationController())->markAsRead($m['id']);
    } elseif ($uri === 'notifications/read-all') {
        if ($method === 'POST') (new NotificationController())->markAllAsRead();
    } else {
        Response::error("API endpoint not found ({$method} /{$uri})", 404);
    }
} catch (Exception $ex) {
    Response::error("Internal Server Error: " . $ex->getMessage(), 500);
}
