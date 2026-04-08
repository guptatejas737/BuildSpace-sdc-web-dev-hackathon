<?php
<<<<<<< HEAD
=======
/**
 * BuildSpace - Database Configuration
 * PDO connection with error handling
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73

define('DB_HOST', 'sql211.infinityfree.com');
define('DB_NAME', 'DB NAME');
define('DB_USER', 'USERNAME');
define('DB_PASS', 'DATABASE PASSWORD');
define('DB_CHARSET', 'utf8mb4');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}

<<<<<<< HEAD
=======
// Session management
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
function startSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function getCurrentUserId() {
    startSession();
    return $_SESSION['user_id'] ?? null;
}

function requireAuth() {
    $userId = getCurrentUserId();
    if (!$userId) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }
    return $userId;
}

<<<<<<< HEAD
=======
// JSON response helpers
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function jsonError($message, $code = 400) {
    jsonResponse(['error' => $message], $code);
}

<<<<<<< HEAD
=======
// Input helpers
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
function getJsonInput() {
    $input = json_decode(file_get_contents('php://input'), true);
    return $input ?? [];
}

function sanitize($str) {
    return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
}

<<<<<<< HEAD
=======
// CORS headers (for development)
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
