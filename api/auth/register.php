<?php

require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();
$username = sanitize($input['username'] ?? '');
$email = sanitize($input['email'] ?? '');
$password = $input['password'] ?? '';
$full_name = sanitize($input['full_name'] ?? '');

if (empty($username) || empty($email) || empty($password) || empty($full_name)) {
    jsonError('All fields are required');
}

if (strlen($username) < 3 || strlen($username) > 50) {
    jsonError('Username must be 3-50 characters');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Invalid email address');
}

if (strlen($password) < 6) {
    jsonError('Password must be at least 6 characters');
}

$db = getDB();

$stmt = $db->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
$stmt->execute([$username, $email]);
if ($stmt->fetch()) {
    jsonError('Username or email already exists');
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare('INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)');
$stmt->execute([$username, $email, $password_hash, $full_name]);

$userId = $db->lastInsertId();

startSession();
$_SESSION['user_id'] = $userId;

$stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'profile_updated', ?, 'user', ?)");
$stmt->execute([$userId, $userId, json_encode(['action' => 'joined BuildSpace', 'user_name' => $full_name])]);

$stmt = $db->prepare('SELECT id, username, email, full_name, bio, avatar_url, github_url, linkedin_url, portfolio_url, location, role, created_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

jsonResponse(['message' => 'Registration successful', 'user' => $user], 201);
