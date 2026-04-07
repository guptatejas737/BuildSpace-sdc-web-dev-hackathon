<?php
/**
 * BuildSpace - Project Members API
 * POST: Request to join
 * PUT: Accept/reject member
 * DELETE: Leave/remove member
 */
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();
    $projectId = intval($input['project_id'] ?? 0);
    
    if (!$projectId) jsonError('Project ID required');
    
    // Check if project exists and is open
    $stmt = $db->prepare('SELECT * FROM projects WHERE id = ? AND is_open = 1');
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    if (!$project) jsonError('Project not found or not accepting members', 404);
    
    // Check member limit
    $stmt = $db->prepare('SELECT COUNT(*) as cnt FROM project_members WHERE project_id = ? AND status = "active"');
    $stmt->execute([$projectId]);
    if ($stmt->fetch()['cnt'] >= $project['max_members']) {
        jsonError('Project has reached maximum members');
    }
    
    // Check if already a member
    $stmt = $db->prepare('SELECT * FROM project_members WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$projectId, $userId]);
    $existing = $stmt->fetch();
    if ($existing) {
        if ($existing['status'] === 'active') jsonError('Already a member');
        if ($existing['status'] === 'pending') jsonError('Request already pending');
        // If left/removed, allow re-join
        $stmt = $db->prepare("UPDATE project_members SET status = 'pending', joined_at = NOW() WHERE project_id = ? AND user_id = ?");
        $stmt->execute([$projectId, $userId]);
    } else {
        $stmt = $db->prepare("INSERT INTO project_members (project_id, user_id, role, status) VALUES (?, ?, 'member', 'pending')");
        $stmt->execute([$projectId, $userId]);
    }
    
    // Notify project owner
    $userName = $db->query("SELECT full_name FROM users WHERE id = $userId")->fetch()['full_name'];
    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, 'member_request', 'Join Request 👋', ?, ?, 'project')");
    $stmt->execute([$project['creator_id'], "$userName wants to join {$project['title']}", $projectId]);
    
    jsonResponse(['message' => 'Join request sent'], 201);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $userId = requireAuth();
    $input = getJsonInput();
    $projectId = intval($input['project_id'] ?? 0);
    $memberId = intval($input['user_id'] ?? 0);
    $action = $input['action'] ?? ''; // accept or reject
    
    if (!$projectId || !$memberId || !in_array($action, ['accept', 'reject'])) {
        jsonError('project_id, user_id, and action (accept/reject) required');
    }
    
    // Check if requester is owner/admin
    $stmt = $db->prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ? AND status = "active" AND role IN ("owner", "admin")');
    $stmt->execute([$projectId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);
    
    if ($action === 'accept') {
        $stmt = $db->prepare("UPDATE project_members SET status = 'active' WHERE project_id = ? AND user_id = ? AND status = 'pending'");
        $stmt->execute([$projectId, $memberId]);
        
        // Feed activity
        $memberName = $db->query("SELECT full_name FROM users WHERE id = $memberId")->fetch()['full_name'];
        $projectTitle = $db->query("SELECT title FROM projects WHERE id = $projectId")->fetch()['title'];
        
        $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'member_joined', ?, 'project', ?)");
        $stmt->execute([$memberId, $projectId, json_encode(['project_title' => $projectTitle, 'user_name' => $memberName])]);
        
        // Notify member
        $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, 'request_accepted', 'Welcome to the team! 🎉', ?, ?, 'project')");
        $stmt->execute([$memberId, "You've been accepted into $projectTitle", $projectId]);
        
    } else {
        $stmt = $db->prepare("UPDATE project_members SET status = 'removed' WHERE project_id = ? AND user_id = ? AND status = 'pending'");
        $stmt->execute([$projectId, $memberId]);
        
        $projectTitle = $db->query("SELECT title FROM projects WHERE id = $projectId")->fetch()['title'];
        $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, 'request_rejected', 'Join Request Update', ?, ?, 'project')");
        $stmt->execute([$memberId, "Your request to join $projectTitle was not accepted", $projectId]);
    }
    
    jsonResponse(['message' => "Member $action" . "ed"]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $userId = requireAuth();
    $projectId = intval($_GET['project_id'] ?? 0);
    $memberId = intval($_GET['user_id'] ?? $userId);
    
    if (!$projectId) jsonError('Project ID required');
    
    // If removing self (leaving)
    if ($memberId === $userId) {
        $stmt = $db->prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?');
        $stmt->execute([$projectId, $userId]);
        $membership = $stmt->fetch();
        if (!$membership) jsonError('Not a member');
        if ($membership['role'] === 'owner') jsonError('Owner cannot leave. Transfer ownership first.');
        
        $stmt = $db->prepare("UPDATE project_members SET status = 'left' WHERE project_id = ? AND user_id = ?");
        $stmt->execute([$projectId, $userId]);
    } else {
        // Removing another user - must be owner/admin
        $stmt = $db->prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ? AND role IN ("owner", "admin")');
        $stmt->execute([$projectId, $userId]);
        if (!$stmt->fetch()) jsonError('Not authorized', 403);
        
        $stmt = $db->prepare("UPDATE project_members SET status = 'removed' WHERE project_id = ? AND user_id = ?");
        $stmt->execute([$projectId, $memberId]);
    }
    
    jsonResponse(['message' => 'Member removed']);
    
} else {
    jsonError('Method not allowed', 405);
}
