<?php
/**
 * BuildSpace - User Profile API
 * GET: Get user profile
 * PUT: Update user profile
 */
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['id'] ?? $_GET['username'] ?? null;
    
    if (!$userId) {
        $userId = getCurrentUserId();
        if (!$userId) jsonError('User ID or username required');
    }
    
    // Fetch by ID or username
    if (is_numeric($userId)) {
        $stmt = $db->prepare('SELECT id, username, email, full_name, bio, avatar_url, github_url, linkedin_url, portfolio_url, location, role, created_at FROM users WHERE id = ?');
    } else {
        $stmt = $db->prepare('SELECT id, username, email, full_name, bio, avatar_url, github_url, linkedin_url, portfolio_url, location, role, created_at FROM users WHERE username = ?');
    }
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        jsonError('User not found', 404);
    }
    
    // Get skills with endorsement count
    $stmt = $db->prepare('
        SELECT s.id, s.name, s.category, s.icon, us.proficiency,
               (SELECT COUNT(*) FROM skill_endorsements se WHERE se.endorsed_user_id = us.user_id AND se.skill_id = s.id) as endorsement_count
        FROM user_skills us 
        JOIN skills s ON us.skill_id = s.id 
        WHERE us.user_id = ?
        ORDER BY endorsement_count DESC, s.name
    ');
    $stmt->execute([$user['id']]);
    $user['skills'] = $stmt->fetchAll();
    
    // Get projects
    $stmt = $db->prepare('
        SELECT p.id, p.title, p.short_description, p.status, p.image_url, pm.role as member_role
        FROM project_members pm
        JOIN projects p ON pm.project_id = p.id
        WHERE pm.user_id = ? AND pm.status = "active"
        ORDER BY p.updated_at DESC
    ');
    $stmt->execute([$user['id']]);
    $user['projects'] = $stmt->fetchAll();
    
    // Get stats
    $stmt = $db->prepare('SELECT COUNT(*) as count FROM project_members WHERE user_id = ? AND status = "active"');
    $stmt->execute([$user['id']]);
    $user['project_count'] = $stmt->fetch()['count'];
    
    $stmt = $db->prepare('SELECT COUNT(*) as count FROM skill_endorsements WHERE endorsed_user_id = ?');
    $stmt->execute([$user['id']]);
    $user['endorsement_count'] = $stmt->fetch()['count'];
    
    $stmt = $db->prepare('SELECT COUNT(*) as count FROM opportunities WHERE creator_id = ?');
    $stmt->execute([$user['id']]);
    $user['opportunity_count'] = $stmt->fetch()['count'];
    
    // Check if current user has endorsed any skills
    $currentUserId = getCurrentUserId();
    if ($currentUserId && $currentUserId != $user['id']) {
        $stmt = $db->prepare('SELECT skill_id FROM skill_endorsements WHERE endorser_id = ? AND endorsed_user_id = ?');
        $stmt->execute([$currentUserId, $user['id']]);
        $user['endorsed_skills'] = array_column($stmt->fetchAll(), 'skill_id');
    } else {
        $user['endorsed_skills'] = [];
    }
    
    jsonResponse($user);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $userId = requireAuth();
    $input = getJsonInput();
    
    $allowedFields = ['full_name', 'bio', 'avatar_url', 'github_url', 'linkedin_url', 'portfolio_url', 'location', 'role'];
    $updates = [];
    $params = [];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $params[] = sanitize($input[$field]);
        }
    }
    
    if (empty($updates)) {
        jsonError('No fields to update');
    }
    
    $params[] = $userId;
    $sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    // Create feed activity
    $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'profile_updated', ?, 'user', ?)");
    $name = $db->query("SELECT full_name FROM users WHERE id = $userId")->fetch()['full_name'];
    $stmt->execute([$userId, $userId, json_encode(['user_name' => $name, 'action' => 'updated their profile'])]);
    
    // Return updated profile
    $stmt = $db->prepare('SELECT id, username, email, full_name, bio, avatar_url, github_url, linkedin_url, portfolio_url, location, role, created_at FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    jsonResponse($stmt->fetch());
    
} else {
    jsonError('Method not allowed', 405);
}
