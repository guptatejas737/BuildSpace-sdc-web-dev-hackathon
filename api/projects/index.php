<?php
/**
 * BuildSpace - Projects API
 * GET: List/get projects
 * POST: Create project
 * PUT: Update project
 * DELETE: Delete project
 */
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Single project
    if (isset($_GET['id'])) {
        $stmt = $db->prepare('
            SELECT p.*, u.username as creator_username, u.full_name as creator_name, u.avatar_url as creator_avatar
            FROM projects p JOIN users u ON p.creator_id = u.id WHERE p.id = ?
        ');
        $stmt->execute([$_GET['id']]);
        $project = $stmt->fetch();
        if (!$project) jsonError('Project not found', 404);
        
        // Tech stack
        $stmt = $db->prepare('SELECT s.id, s.name, s.category, s.icon FROM project_tech_stack pts JOIN skills s ON pts.skill_id = s.id WHERE pts.project_id = ?');
        $stmt->execute([$project['id']]);
        $project['tech_stack'] = $stmt->fetchAll();
        
        // Members
        $stmt = $db->prepare('
            SELECT pm.*, u.username, u.full_name, u.avatar_url 
            FROM project_members pm JOIN users u ON pm.user_id = u.id 
            WHERE pm.project_id = ? AND pm.status IN ("active", "pending")
            ORDER BY pm.role = "owner" DESC, pm.joined_at
        ');
        $stmt->execute([$project['id']]);
        $project['members'] = $stmt->fetchAll();
        
        $project['member_count'] = count(array_filter($project['members'], fn($m) => $m['status'] === 'active'));
        
        // Check if current user is a member
        $currentUserId = getCurrentUserId();
        if ($currentUserId) {
            $stmt = $db->prepare('SELECT * FROM project_members WHERE project_id = ? AND user_id = ?');
            $stmt->execute([$project['id'], $currentUserId]);
            $project['current_user_membership'] = $stmt->fetch() ?: null;
        }
        
        jsonResponse($project);
    }
    
    // List projects
    $status = $_GET['status'] ?? '';
    $search = $_GET['q'] ?? '';
    $skill = $_GET['skill'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 12)));
    $offset = ($page - 1) * $limit;
    $creator = $_GET['creator_id'] ?? '';
    
    $where = ['1=1'];
    $params = [];
    
    if (!empty($status)) {
        $where[] = 'p.status = ?';
        $params[] = $status;
    }
    if (!empty($search)) {
        $where[] = '(p.title LIKE ? OR p.description LIKE ?)';
        $q = "%$search%";
        $params[] = $q;
        $params[] = $q;
    }
    if (!empty($creator)) {
        $where[] = 'p.creator_id = ?';
        $params[] = $creator;
    }
    
    $joinSkill = '';
    if (!empty($skill)) {
        $joinSkill = 'JOIN project_tech_stack pts2 ON p.id = pts2.project_id JOIN skills sk ON pts2.skill_id = sk.id';
        $where[] = '(sk.name LIKE ? OR sk.category = ?)';
        $params[] = "%$skill%";
        $params[] = $skill;
    }
    
    $whereStr = implode(' AND ', $where);
    
    $countStmt = $db->prepare("SELECT COUNT(DISTINCT p.id) as total FROM projects p $joinSkill WHERE $whereStr");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    $sql = "SELECT DISTINCT p.*, u.username as creator_username, u.full_name as creator_name, u.avatar_url as creator_avatar
            FROM projects p 
            JOIN users u ON p.creator_id = u.id 
            $joinSkill
            WHERE $whereStr 
            ORDER BY p.updated_at DESC 
            LIMIT $limit OFFSET $offset";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();
    
    foreach ($projects as &$proj) {
        // Tech stack
        $stmt = $db->prepare('SELECT s.id, s.name, s.category, s.icon FROM project_tech_stack pts JOIN skills s ON pts.skill_id = s.id WHERE pts.project_id = ?');
        $stmt->execute([$proj['id']]);
        $proj['tech_stack'] = $stmt->fetchAll();
        
        // Member count
        $stmt = $db->prepare('SELECT COUNT(*) as cnt FROM project_members WHERE project_id = ? AND status = "active"');
        $stmt->execute([$proj['id']]);
        $proj['member_count'] = $stmt->fetch()['cnt'];
    }
    
    jsonResponse(['projects' => $projects, 'total' => $total, 'page' => $page, 'pages' => ceil($total / $limit)]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();
    
    $title = sanitize($input['title'] ?? '');
    $description = sanitize($input['description'] ?? '');
    $shortDesc = sanitize($input['short_description'] ?? '');
    $repoUrl = sanitize($input['repo_url'] ?? '');
    $demoUrl = sanitize($input['demo_url'] ?? '');
    $maxMembers = intval($input['max_members'] ?? 5);
    $techStack = $input['tech_stack'] ?? [];
    
    if (empty($title) || empty($description)) {
        jsonError('Title and description are required');
    }
    
    if (empty($shortDesc)) {
        $shortDesc = substr($description, 0, 200);
    }
    
    $stmt = $db->prepare('INSERT INTO projects (creator_id, title, description, short_description, repo_url, demo_url, max_members) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$userId, $title, $description, $shortDesc, $repoUrl, $demoUrl, $maxMembers]);
    $projectId = $db->lastInsertId();
    
    // Add creator as owner
    $stmt = $db->prepare("INSERT INTO project_members (project_id, user_id, role, status) VALUES (?, ?, 'owner', 'active')");
    $stmt->execute([$projectId, $userId]);
    
    // Add tech stack
    if (!empty($techStack)) {
        $stmt = $db->prepare('INSERT INTO project_tech_stack (project_id, skill_id) VALUES (?, ?)');
        foreach ($techStack as $skillId) {
            $stmt->execute([$projectId, intval($skillId)]);
        }
    }
    
    // Feed activity
    $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'project_created', ?, 'project', ?)");
    $stmt->execute([$userId, $projectId, json_encode(['title' => $title])]);
    
    jsonResponse(['message' => 'Project created', 'id' => $projectId], 201);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $userId = requireAuth();
    $input = getJsonInput();
    $projectId = intval($input['id'] ?? $_GET['id'] ?? 0);
    
    if (!$projectId) jsonError('Project ID required');
    
    // Check ownership
    $stmt = $db->prepare('SELECT * FROM projects WHERE id = ? AND creator_id = ?');
    $stmt->execute([$projectId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);
    
    $allowedFields = ['title', 'description', 'short_description', 'status', 'repo_url', 'demo_url', 'max_members', 'is_open'];
    $updates = [];
    $params = [];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $params[] = is_string($input[$field]) ? sanitize($input[$field]) : $input[$field];
        }
    }
    
    if (!empty($updates)) {
        $params[] = $projectId;
        $stmt = $db->prepare('UPDATE projects SET ' . implode(', ', $updates) . ' WHERE id = ?');
        $stmt->execute($params);
    }
    
    // Update tech stack if provided
    if (isset($input['tech_stack'])) {
        $db->prepare('DELETE FROM project_tech_stack WHERE project_id = ?')->execute([$projectId]);
        $stmt = $db->prepare('INSERT INTO project_tech_stack (project_id, skill_id) VALUES (?, ?)');
        foreach ($input['tech_stack'] as $skillId) {
            $stmt->execute([$projectId, intval($skillId)]);
        }
    }
    
    // Check if project just completed
    if (isset($input['status']) && $input['status'] === 'completed') {
        $title = $db->query("SELECT title FROM projects WHERE id = $projectId")->fetch()['title'];
        $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'project_completed', ?, 'project', ?)");
        $stmt->execute([$userId, $projectId, json_encode(['title' => $title])]);
    }
    
    jsonResponse(['message' => 'Project updated']);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $userId = requireAuth();
    $projectId = intval($_GET['id'] ?? 0);
    if (!$projectId) jsonError('Project ID required');
    
    $stmt = $db->prepare('SELECT * FROM projects WHERE id = ? AND creator_id = ?');
    $stmt->execute([$projectId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);
    
    $db->prepare('DELETE FROM projects WHERE id = ?')->execute([$projectId]);
    jsonResponse(['message' => 'Project deleted']);
    
} else {
    jsonError('Method not allowed', 405);
}
