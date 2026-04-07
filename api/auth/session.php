<?php
<<<<<<< HEAD

=======
/**
 * BuildSpace - Auth: Session check
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$userId = getCurrentUserId();
if (!$userId) {
    jsonResponse(['authenticated' => false, 'user' => null]);
}

$db = getDB();
$stmt = $db->prepare('SELECT id, username, email, full_name, bio, avatar_url, github_url, linkedin_url, portfolio_url, location, role, created_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user) {
    session_destroy();
    jsonResponse(['authenticated' => false, 'user' => null]);
}

<<<<<<< HEAD
=======
// Update last seen
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
$stmt = $db->prepare('UPDATE users SET is_online = 1, last_seen = NOW() WHERE id = ?');
$stmt->execute([$userId]);

jsonResponse(['authenticated' => true, 'user' => $user]);
