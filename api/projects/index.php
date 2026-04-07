<?php
<<<<<<< HEAD

=======
/**
 * BuildSpace - Projects API
 * GET: List/get projects
 * POST: Create project
 * PUT: Update project
 * DELETE: Delete project
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
<<<<<<< HEAD

=======
    // Single project
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    if (isset($_GET['id'])) {
        $stmt = $db->prepare('
            SELECT p.*, u.username as creator_username, u.full_name as creator_name, u.avatar_url as creator_avatar
            FROM projects p JOIN users u ON p.creator_id = u.id WHERE p.id = ?
        ');
        $stmt->execute([$_GET['id']]);
        $project = $stmt->fetch();
        if (!$project) jsonError('Project not found', 404);
<<<<<<< HEAD

        $stmt = $db->prepare('SELECT s.id, s.name, s.category, s.icon FROM project_tech_stack pts JOIN skills s ON pts.skill_id = s.id WHERE pts.project_id = ?');
        $stmt->execute([$project['id']]);
        $project['tech_stack'] = $stmt->fetchAll();

        $stmt = $db->prepare('
            SELECT pm.*, u.username, u.full_name, u.avatar_url
            FROM project_members pm JOIN users u ON pm.user_id = u.id
=======
        
        // Tech stack
        $stmt = $db->prepare('SELECT s.id, s.name, s.category, s.icon FROM project_tech_stack pts JOIN skills s ON pts.skill_id = s.id WHERE pts.project_id = ?');
        $stmt->execute([$project['id']]);
        $project['tech_stack'] = $stmt->fetchAll();
        
        // Members
        $stmt = $db->prepare('
            SELECT pm.*, u.username, u.full_name, u.avatar_url 
            FROM project_members pm JOIN users u ON pm.user_id = u.id 
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            WHERE pm.project_id = ? AND pm.status IN ("active", "pending")
            ORDER BY pm.role = "owner" DESC, pm.joined_at
        ');
        $stmt->execute([$project['id']]);
        $project['members'] = $stmt->fetchAll();
<<<<<<< HEAD

        $project['member_count'] = count(array_filter($project['members'], fn($m) => $m['status'] === 'active'));

=======
        
        $project['member_count'] = count(array_filter($project['members'], fn($m) => $m['status'] === 'active'));
        
        // Check if current user is a member
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        $currentUserId = getCurrentUserId();
        if ($currentUserId) {
            $stmt = $db->prepare('SELECT * FROM project_members WHERE project_id = ? AND user_id = ?');
            $stmt->execute([$project['id'], $currentUserId]);
            $project['current_user_membership'] = $stmt->fetch() ?: null;
        }
<<<<<<< HEAD

        jsonResponse($project);
    }

=======
        
        jsonResponse($project);
    }
    
    // List projects
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    $status = $_GET['status'] ?? '';
    $search = $_GET['q'] ?? '';
    $skill = $_GET['skill'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 12)));
    $offset = ($page - 1) * $limit;
    $creator = $_GET['creator_id'] ?? '';
<<<<<<< HEAD

    $where = ['1=1'];
    $params = [];

=======
    
    $where = ['1=1'];
    $params = [];
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
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
<<<<<<< HEAD

=======
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    $joinSkill = '';
    if (!empty($skill)) {
        $joinSkill = 'JOIN project_tech_stack pts2 ON p.id = pts2.project_id JOIN skills sk ON pts2.skill_id = sk.id';
        $where[] = '(sk.name LIKE ? OR sk.category = ?)';
        $params[] = "%$skill%";
        $params[] = $skill;
    }
<<<<<<< HEAD

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
=======
    
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
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            LIMIT $limit OFFSET $offset";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();
<<<<<<< HEAD

    foreach ($projects as &$proj) {

        $stmt = $db->prepare('SELECT s.id, s.name, s.category, s.icon FROM project_tech_stack pts JOIN skills s ON pts.skill_id = s.id WHERE pts.project_id = ?');
        $stmt->execute([$proj['id']]);
        $proj['tech_stack'] = $stmt->fetchAll();

=======
    
    foreach ($projects as &$proj) {
        // Tech stack
        $stmt = $db->prepare('SELECT s.id, s.name, s.category, s.icon FROM project_tech_stack pts JOIN skills s ON pts.skill_id = s.id WHERE pts.project_id = ?');
        $stmt->execute([$proj['id']]);
        $proj['tech_stack'] = $stmt->fetchAll();
        
        // Member count
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        $stmt = $db->prepare('SELECT COUNT(*) as cnt FROM project_members WHERE project_id = ? AND status = "active"');
        $stmt->execute([$proj['id']]);
        $proj['member_count'] = $stmt->fetch()['cnt'];
    }
<<<<<<< HEAD

    jsonResponse(['projects' => $projects, 'total' => $total, 'page' => $page, 'pages' => ceil($total / $limit)]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();

=======
    
    jsonResponse(['projects' => $projects, 'total' => $total, 'page' => $page, 'pages' => ceil($total / $limit)]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    $title = sanitize($input['title'] ?? '');
    $description = sanitize($input['description'] ?? '');
    $shortDesc = sanitize($input['short_description'] ?? '');
    $repoUrl = sanitize($input['repo_url'] ?? '');
    $demoUrl = sanitize($input['demo_url'] ?? '');
    $maxMembers = intval($input['max_members'] ?? 5);
    $techStack = $input['tech_stack'] ?? [];
<<<<<<< HEAD

    if (empty($title) || empty($description)) {
        jsonError('Title and description are required');
    }

    if (empty($shortDesc)) {
        $shortDesc = substr($description, 0, 200);
    }

    $stmt = $db->prepare('INSERT INTO projects (creator_id, title, description, short_description, repo_url, demo_url, max_members) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$userId, $title, $description, $shortDesc, $repoUrl, $demoUrl, $maxMembers]);
    $projectId = $db->lastInsertId();

    $stmt = $db->prepare("INSERT INTO project_members (project_id, user_id, role, status) VALUES (?, ?, 'owner', 'active')");
    $stmt->execute([$projectId, $userId]);

=======
    
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
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    if (!empty($techStack)) {
        $stmt = $db->prepare('INSERT INTO project_tech_stack (project_id, skill_id) VALUES (?, ?)');
        foreach ($techStack as $skillId) {
            $stmt->execute([$projectId, intval($skillId)]);
        }
    }
<<<<<<< HEAD

    $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'project_created', ?, 'project', ?)");
    $stmt->execute([$userId, $projectId, json_encode(['title' => $title])]);

    jsonResponse(['message' => 'Project created', 'id' => $projectId], 201);

=======
    
    // Feed activity
    $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'project_created', ?, 'project', ?)");
    $stmt->execute([$userId, $projectId, json_encode(['title' => $title])]);
    
    jsonResponse(['message' => 'Project created', 'id' => $projectId], 201);
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $userId = requireAuth();
    $input = getJsonInput();
    $projectId = intval($input['id'] ?? $_GET['id'] ?? 0);
<<<<<<< HEAD

    if (!$projectId) jsonError('Project ID required');

    $stmt = $db->prepare('SELECT * FROM projects WHERE id = ? AND creator_id = ?');
    $stmt->execute([$projectId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);

    $allowedFields = ['title', 'description', 'short_description', 'status', 'repo_url', 'demo_url', 'max_members', 'is_open'];
    $updates = [];
    $params = [];

=======
    
    if (!$projectId) jsonError('Project ID required');
    
    // Check ownership
    $stmt = $db->prepare('SELECT * FROM projects WHERE id = ? AND creator_id = ?');
    $stmt->execute([$projectId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);
    
    $allowedFields = ['title', 'description', 'short_description', 'status', 'repo_url', 'demo_url', 'max_members', 'is_open'];
    $updates = [];
    $params = [];
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $params[] = is_string($input[$field]) ? sanitize($input[$field]) : $input[$field];
        }
    }
<<<<<<< HEAD

=======
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    if (!empty($updates)) {
        $params[] = $projectId;
        $stmt = $db->prepare('UPDATE projects SET ' . implode(', ', $updates) . ' WHERE id = ?');
        $stmt->execute($params);
    }
<<<<<<< HEAD

=======
    
    // Update tech stack if provided
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    if (isset($input['tech_stack'])) {
        $db->prepare('DELETE FROM project_tech_stack WHERE project_id = ?')->execute([$projectId]);
        $stmt = $db->prepare('INSERT INTO project_tech_stack (project_id, skill_id) VALUES (?, ?)');
        foreach ($input['tech_stack'] as $skillId) {
            $stmt->execute([$projectId, intval($skillId)]);
        }
    }
<<<<<<< HEAD

=======
    
    // Check if project just completed
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    if (isset($input['status']) && $input['status'] === 'completed') {
        $title = $db->query("SELECT title FROM projects WHERE id = $projectId")->fetch()['title'];
        $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'project_completed', ?, 'project', ?)");
        $stmt->execute([$userId, $projectId, json_encode(['title' => $title])]);
    }
<<<<<<< HEAD

    jsonResponse(['message' => 'Project updated']);

=======
    
    jsonResponse(['message' => 'Project updated']);
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $userId = requireAuth();
    $projectId = intval($_GET['id'] ?? 0);
    if (!$projectId) jsonError('Project ID required');
<<<<<<< HEAD

    $stmt = $db->prepare('SELECT * FROM projects WHERE id = ? AND creator_id = ?');
    $stmt->execute([$projectId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);

    $db->prepare('DELETE FROM projects WHERE id = ?')->execute([$projectId]);
    jsonResponse(['message' => 'Project deleted']);

=======
    
    $stmt = $db->prepare('SELECT * FROM projects WHERE id = ? AND creator_id = ?');
    $stmt->execute([$projectId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);
    
    $db->prepare('DELETE FROM projects WHERE id = ?')->execute([$projectId]);
    jsonResponse(['message' => 'Project deleted']);
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
} else {
    jsonError('Method not allowed', 405);
}
