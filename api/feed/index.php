<?php

require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();
$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(50, max(1, intval($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;
$type = $_GET['type'] ?? '';

$where = ['1=1'];
$params = [];

if (!empty($type)) {
    $where[] = 'fa.type = ?';
    $params[] = $type;
}

$whereStr = implode(' AND ', $where);

$sql = "SELECT fa.*, u.username, u.full_name, u.avatar_url, u.role as user_role
        FROM feed_activities fa
        JOIN users u ON fa.user_id = u.id
        WHERE $whereStr
        ORDER BY fa.created_at DESC
        LIMIT $limit OFFSET $offset";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$activities = $stmt->fetchAll();

foreach ($activities as &$activity) {
    if ($activity['metadata']) {
        $activity['metadata'] = json_decode($activity['metadata'], true);
    }
}

$countSql = "SELECT COUNT(*) as total FROM feed_activities fa WHERE $whereStr";
$stmt = $db->prepare($countSql);
$stmt->execute($params);
$total = $stmt->fetch()['total'];

$stats = [];
$stats['total_users'] = $db->query('SELECT COUNT(*) as cnt FROM users')->fetch()['cnt'];
$stats['total_projects'] = $db->query('SELECT COUNT(*) as cnt FROM projects')->fetch()['cnt'];
$stats['active_projects'] = $db->query('SELECT COUNT(*) as cnt FROM projects WHERE status = "active"')->fetch()['cnt'];
$stats['open_opportunities'] = $db->query('SELECT COUNT(*) as cnt FROM opportunities WHERE status = "open"')->fetch()['cnt'];
$stats['total_skills'] = $db->query('SELECT COUNT(DISTINCT skill_id) as cnt FROM user_skills')->fetch()['cnt'];

jsonResponse([
    'activities' => $activities,
    'total' => $total,
    'page' => $page,
    'pages' => ceil($total / $limit),
    'stats' => $stats
]);
