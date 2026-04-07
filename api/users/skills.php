<?php
<<<<<<< HEAD

=======
/**
 * BuildSpace - Skills API
 * GET: List all skills or user skills
 * POST: Add skill to user
 * DELETE: Remove skill from user
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
<<<<<<< HEAD

=======
    // If user_id is provided, get that user's skills
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    if (isset($_GET['user_id'])) {
        $stmt = $db->prepare('
            SELECT s.id, s.name, s.category, s.icon, us.proficiency,
                   (SELECT COUNT(*) FROM skill_endorsements se WHERE se.endorsed_user_id = ? AND se.skill_id = s.id) as endorsement_count
<<<<<<< HEAD
            FROM user_skills us
            JOIN skills s ON us.skill_id = s.id
=======
            FROM user_skills us 
            JOIN skills s ON us.skill_id = s.id 
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            WHERE us.user_id = ?
            ORDER BY s.category, s.name
        ');
        $stmt->execute([$_GET['user_id'], $_GET['user_id']]);
        jsonResponse($stmt->fetchAll());
    }
<<<<<<< HEAD

=======
    
    // Get all available skills, optionally filtered by category
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    $sql = 'SELECT * FROM skills';
    $params = [];
    if (isset($_GET['category'])) {
        $sql .= ' WHERE category = ?';
        $params[] = $_GET['category'];
    }
    $sql .= ' ORDER BY category, name';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
<<<<<<< HEAD

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();

    $skillId = intval($input['skill_id'] ?? 0);
    $proficiency = $input['proficiency'] ?? 'beginner';

=======
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();
    
    $skillId = intval($input['skill_id'] ?? 0);
    $proficiency = $input['proficiency'] ?? 'beginner';
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    if (!$skillId) jsonError('Skill ID is required');
    if (!in_array($proficiency, ['beginner', 'intermediate', 'advanced', 'expert'])) {
        jsonError('Invalid proficiency level');
    }
<<<<<<< HEAD

=======
    
    // Check if skill exists
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    $stmt = $db->prepare('SELECT * FROM skills WHERE id = ?');
    $stmt->execute([$skillId]);
    $skill = $stmt->fetch();
    if (!$skill) jsonError('Skill not found', 404);
<<<<<<< HEAD

    $stmt = $db->prepare('INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE proficiency = ?');
    $stmt->execute([$userId, $skillId, $proficiency, $proficiency]);

    $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'skill_added', ?, 'skill', ?)");
    $stmt->execute([$userId, $skillId, json_encode(['skill_name' => $skill['name'], 'proficiency' => $proficiency])]);

    jsonResponse(['message' => 'Skill added successfully', 'skill' => $skill], 201);

=======
    
    // Upsert the skill
    $stmt = $db->prepare('INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE proficiency = ?');
    $stmt->execute([$userId, $skillId, $proficiency, $proficiency]);
    
    // Feed activity
    $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'skill_added', ?, 'skill', ?)");
    $stmt->execute([$userId, $skillId, json_encode(['skill_name' => $skill['name'], 'proficiency' => $proficiency])]);
    
    jsonResponse(['message' => 'Skill added successfully', 'skill' => $skill], 201);
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $userId = requireAuth();
    $skillId = intval($_GET['skill_id'] ?? 0);
    if (!$skillId) jsonError('Skill ID required');
<<<<<<< HEAD

    $stmt = $db->prepare('DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?');
    $stmt->execute([$userId, $skillId]);

    $stmt = $db->prepare('DELETE FROM skill_endorsements WHERE endorsed_user_id = ? AND skill_id = ?');
    $stmt->execute([$userId, $skillId]);

    jsonResponse(['message' => 'Skill removed']);

=======
    
    $stmt = $db->prepare('DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?');
    $stmt->execute([$userId, $skillId]);
    
    // Also remove endorsements
    $stmt = $db->prepare('DELETE FROM skill_endorsements WHERE endorsed_user_id = ? AND skill_id = ?');
    $stmt->execute([$userId, $skillId]);
    
    jsonResponse(['message' => 'Skill removed']);
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
} else {
    jsonError('Method not allowed', 405);
}
