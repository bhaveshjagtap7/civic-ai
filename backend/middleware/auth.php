<?php
// backend/middleware/auth.php
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../helpers/response.php';

class AuthMiddleware
{
    public static function authenticate()
    {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            Response::error("Authorization token required", 401);
        }

        $token = $matches[1];
        $payload = JWT::decode($token);

        if (!$payload) {
            Response::error("Invalid or expired session token. Please log in again.", 401);
        }

        return $payload;
    }

    public static function requireRole($allowedRoles = [])
    {
        $user = self::authenticate();

        if (!in_array($user['role'], $allowedRoles)) {
            Response::error("Forbidden: You do not have access to this resource.", 403);
        }

        return $user;
    }
}
