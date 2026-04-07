<?php
/**
 * BuildSpace - Auth: Logout
 */
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
