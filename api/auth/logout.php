<?php
<<<<<<< HEAD

=======
/**
 * BuildSpace - Auth: Logout
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

startSession();
$userId = getCurrentUserId();
if ($userId) {
    $db = getDB();
    $stmt = $db->prepare('UPDATE users SET is_online = 0, last_seen = NOW() WHERE id = ?');
    $stmt->execute([$userId]);
}

session_destroy();
jsonResponse(['message' => 'Logged out successfully']);
