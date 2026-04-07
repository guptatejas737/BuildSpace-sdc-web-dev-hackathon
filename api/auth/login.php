<?php

require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();
$login = sanitize($input['login'] ?? '');
$password = $input['password'] ?? '';

if (empty($login) || empty($password)) {
    jsonError('Login and password are required');
}

$db = getDB();
$stmt = $db->prepare('SELECT * FROM users WHERE username = ? OR email = ?');
$stmt->execute([$login, $login]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonError('Invalid credentials', 401);
}

startSession();
$_SESSION['user_id'] = $user['id'];

$stmt = $db->prepare('UPDATE users SET is_online = 1, last_seen = NOW() WHERE id = ?');
$stmt->execute([$user['id']]);

unset($user['password_hash']);
jsonResponse(['message' => 'Login successful', 'user' => $user]);
