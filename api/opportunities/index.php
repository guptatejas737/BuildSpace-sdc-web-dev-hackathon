<?php

require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_GET['id'])) {
        $stmt = $db->prepare('
            SELECT o.*, u.username as creator_username, u.full_name as creator_name, u.avatar_url as creator_avatar
            FROM opportunities o JOIN users u ON o.creator_id = u.id WHERE o.id = ?
        ');
        $stmt->execute([$_GET['id']]);
        $opp = $stmt->fetch();
        if (!$opp) jsonError('Opportunity not found', 404);

        $stmt = $db->prepare('SELECT COUNT(*) as cnt FROM opportunity_applications WHERE opportunity_id = ?');
        $stmt->execute([$opp['id']]);
        $opp['application_count'] = $stmt->fetch()['cnt'];

        $currentUserId = getCurrentUserId();
        if ($currentUserId) {
            $stmt = $db->prepare('SELECT * FROM opportunity_applications WHERE opportunity_id = ? AND user_id = ?');
            $stmt->execute([$opp['id'], $currentUserId]);
            $opp['current_user_application'] = $stmt->fetch() ?: null;

            if ($currentUserId == $opp['creator_id']) {
                $stmt = $db->prepare('
                    SELECT oa.*, u.username, u.full_name, u.avatar_url, u.bio
                    FROM opportunity_applications oa JOIN users u ON oa.user_id = u.id
                    WHERE oa.opportunity_id = ?
                    ORDER BY oa.created_at DESC
                ');
                $stmt->execute([$opp['id']]);
                $opp['applications'] = $stmt->fetchAll();
            }
        }

        jsonResponse($opp);
    }

    $type = $_GET['type'] ?? '';
    $status = $_GET['status'] ?? '';
    $search = $_GET['q'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 12)));
    $offset = ($page - 1) * $limit;
    $creatorId = $_GET['creator_id'] ?? '';

    $where = ['1=1'];
    $params = [];

    if (!empty($type)) {
        $where[] = 'o.type = ?';
        $params[] = $type;
    }
    if (!empty($status)) {
        $where[] = 'o.status = ?';
        $params[] = $status;
    } else {
        $where[] = 'o.status = "open"';
    }
    if (!empty($search)) {
        $where[] = '(o.title LIKE ? OR o.description LIKE ? OR o.skills_required LIKE ?)';
        $q = "%$search%";
        $params[] = $q; $params[] = $q; $params[] = $q;
    }
    if (!empty($creatorId)) {
        $where[] = 'o.creator_id = ?';
        $params[] = $creatorId;
    }

    $whereStr = implode(' AND ', $where);

    $countStmt = $db->prepare("SELECT COUNT(*) as total FROM opportunities o WHERE $whereStr");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];

    $sql = "SELECT o.*, u.username as creator_username, u.full_name as creator_name, u.avatar_url as creator_avatar,
            (SELECT COUNT(*) FROM opportunity_applications WHERE opportunity_id = o.id) as application_count
            FROM opportunities o
            JOIN users u ON o.creator_id = u.id
            WHERE $whereStr
            ORDER BY o.created_at DESC
            LIMIT $limit OFFSET $offset";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse([
        'opportunities' => $stmt->fetchAll(),
        'total' => $total,
        'page' => $page,
        'pages' => ceil($total / $limit)
    ]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();

    $title = sanitize($input['title'] ?? '');
    $description = sanitize($input['description'] ?? '');
    $type = $input['type'] ?? '';
    $skillsRequired = sanitize($input['skills_required'] ?? '');
    $location = sanitize($input['location'] ?? '');
    $isRemote = intval($input['is_remote'] ?? 1);
    $deadline = $input['deadline'] ?? null;
    $maxApplicants = isset($input['max_applicants']) ? intval($input['max_applicants']) : null;

    if (empty($title) || empty($description) || empty($type)) {
        jsonError('Title, description, and type are required');
    }
    if (!in_array($type, ['teammate', 'hiring', 'hackathon', 'opensource', 'mentorship'])) {
        jsonError('Invalid opportunity type');
    }

    $stmt = $db->prepare('INSERT INTO opportunities (creator_id, title, description, type, skills_required, location, is_remote, deadline, max_applicants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$userId, $title, $description, $type, $skillsRequired, $location, $isRemote, $deadline, $maxApplicants]);
    $oppId = $db->lastInsertId();

    $stmt = $db->prepare("INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata) VALUES (?, 'opportunity_posted', ?, 'opportunity', ?)");
    $stmt->execute([$userId, $oppId, json_encode(['title' => $title, 'type' => $type])]);

    jsonResponse(['message' => 'Opportunity created', 'id' => $oppId], 201);

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $userId = requireAuth();
    $input = getJsonInput();
    $oppId = intval($input['id'] ?? $_GET['id'] ?? 0);

    if (!$oppId) jsonError('Opportunity ID required');

    $stmt = $db->prepare('SELECT * FROM opportunities WHERE id = ? AND creator_id = ?');
    $stmt->execute([$oppId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);

    $allowedFields = ['title', 'description', 'type', 'status', 'skills_required', 'location', 'is_remote', 'deadline', 'max_applicants'];
    $updates = [];
    $params = [];

    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $params[] = is_string($input[$field]) ? sanitize($input[$field]) : $input[$field];
        }
    }

    if (!empty($updates)) {
        $params[] = $oppId;
        $stmt = $db->prepare('UPDATE opportunities SET ' . implode(', ', $updates) . ' WHERE id = ?');
        $stmt->execute($params);
    }

    jsonResponse(['message' => 'Opportunity updated']);

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $userId = requireAuth();
    $oppId = intval($_GET['id'] ?? 0);
    if (!$oppId) jsonError('Opportunity ID required');

    $stmt = $db->prepare('SELECT * FROM opportunities WHERE id = ? AND creator_id = ?');
    $stmt->execute([$oppId, $userId]);
    if (!$stmt->fetch()) jsonError('Not authorized', 403);

    $db->prepare('DELETE FROM opportunities WHERE id = ?')->execute([$oppId]);
    jsonResponse(['message' => 'Opportunity deleted']);

} else {
    jsonError('Method not allowed', 405);
}
