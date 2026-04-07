<?php

require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();
$query = $_GET['q'] ?? '';
$skill = $_GET['skill'] ?? '';
$role = $_GET['role'] ?? '';
$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(50, max(1, intval($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;

$where = ['1=1'];
$params = [];

if (!empty($query)) {
    $where[] = '(u.username LIKE ? OR u.full_name LIKE ? OR u.bio LIKE ? OR u.location LIKE ?)';
    $q = "%$query%";
    $params = array_merge($params, [$q, $q, $q, $q]);
}

if (!empty($role)) {
    $where[] = 'u.role = ?';
    $params[] = $role;
}

$joinSkill = '';
if (!empty($skill)) {
    $joinSkill = 'JOIN user_skills us2 ON u.id = us2.user_id JOIN skills sk ON us2.skill_id = sk.id';
    $where[] = '(sk.name LIKE ? OR sk.category = ?)';
    $params[] = "%$skill%";
    $params[] = $skill;
}

$whereStr = implode(' AND ', $where);

$countSql = "SELECT COUNT(DISTINCT u.id) as total FROM users u $joinSkill WHERE $whereStr";
$stmt = $db->prepare($countSql);
$stmt->execute($params);
$total = $stmt->fetch()['total'];

$sql = "SELECT DISTINCT u.id, u.username, u.full_name, u.bio, u.avatar_url, u.location, u.role, u.created_at
        FROM users u $joinSkill
        WHERE $whereStr
        ORDER BY u.created_at DESC
        LIMIT $limit OFFSET $offset";
$stmt = $db->prepare($sql);
$stmt->execute($params);
$users = $stmt->fetchAll();

foreach ($users as &$user) {
    $stmt = $db->prepare('
        SELECT s.id, s.name, s.category, s.icon, us.proficiency
        FROM user_skills us JOIN skills s ON us.skill_id = s.id
        WHERE us.user_id = ?
        ORDER BY s.name LIMIT 6
    ');
    $stmt->execute([$user['id']]);
    $user['skills'] = $stmt->fetchAll();
}

jsonResponse([
    'users' => $users,
    'total' => $total,
    'page' => $page,
    'pages' => ceil($total / $limit)
]);
