<?php

require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();

    $endorsedUserId = intval($input['user_id'] ?? 0);
    $skillId = intval($input['skill_id'] ?? 0);

    if (!$endorsedUserId || !$skillId) jsonError('User ID and Skill ID required');
    if ($endorsedUserId === $userId) jsonError('Cannot endorse your own skills');

    $stmt = $db->prepare('SELECT * FROM user_skills WHERE user_id = ? AND skill_id = ?');
    $stmt->execute([$endorsedUserId, $skillId]);
    if (!$stmt->fetch()) jsonError('User does not have this skill');

    $stmt = $db->prepare('INSERT IGNORE INTO skill_endorsements (endorser_id, endorsed_user_id, skill_id) VALUES (?, ?, ?)');
    $stmt->execute([$userId, $endorsedUserId, $skillId]);

    $endorserName = $db->query("SELECT full_name FROM users WHERE id = $userId")->fetch()['full_name'];
    $skillName = $db->query("SELECT name FROM skills WHERE id = $skillId")->fetch()['name'];

    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, 'endorsement', 'Skill Endorsed ⭐', ?, ?, 'user')");
    $stmt->execute([$endorsedUserId, "$endorserName endorsed your $skillName skill", $userId]);

    $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'endorsement_given', ?, 'user', ?)");
    $stmt->execute([$userId, $endorsedUserId, json_encode(['endorser' => $endorserName, 'skill' => $skillName])]);

    $stmt = $db->prepare('SELECT COUNT(*) as count FROM skill_endorsements WHERE endorsed_user_id = ? AND skill_id = ?');
    $stmt->execute([$endorsedUserId, $skillId]);
    $count = $stmt->fetch()['count'];

    jsonResponse(['message' => 'Skill endorsed', 'endorsement_count' => $count]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $userId = requireAuth();
    $endorsedUserId = intval($_GET['user_id'] ?? 0);
    $skillId = intval($_GET['skill_id'] ?? 0);

    if (!$endorsedUserId || !$skillId) jsonError('User ID and Skill ID required');

    $stmt = $db->prepare('DELETE FROM skill_endorsements WHERE endorser_id = ? AND endorsed_user_id = ? AND skill_id = ?');
    $stmt->execute([$userId, $endorsedUserId, $skillId]);

    jsonResponse(['message' => 'Endorsement removed']);

} else {
    jsonError('Method not allowed', 405);
}
