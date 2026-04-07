<?php
<<<<<<< HEAD

=======
/**
 * BuildSpace - Opportunity Applications API
 * POST: Apply to opportunity
 * PUT: Accept/reject application
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = requireAuth();
    $input = getJsonInput();
    $oppId = intval($input['opportunity_id'] ?? 0);
    $message = sanitize($input['message'] ?? '');
<<<<<<< HEAD

    if (!$oppId) jsonError('Opportunity ID required');

=======
    
    if (!$oppId) jsonError('Opportunity ID required');
    
    // Check opportunity exists and is open
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    $stmt = $db->prepare('SELECT * FROM opportunities WHERE id = ? AND status = "open"');
    $stmt->execute([$oppId]);
    $opp = $stmt->fetch();
    if (!$opp) jsonError('Opportunity not found or closed', 404);
<<<<<<< HEAD

    if ($opp['creator_id'] == $userId) jsonError('Cannot apply to your own opportunity');

    $stmt = $db->prepare('SELECT * FROM opportunity_applications WHERE opportunity_id = ? AND user_id = ?');
    $stmt->execute([$oppId, $userId]);
    if ($stmt->fetch()) jsonError('Already applied');

    $stmt = $db->prepare('INSERT INTO opportunity_applications (opportunity_id, user_id, message) VALUES (?, ?, ?)');
    $stmt->execute([$oppId, $userId, $message]);

    $userName = $db->query("SELECT full_name FROM users WHERE id = $userId")->fetch()['full_name'];
    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, 'application_received', 'New Application 📩', ?, ?, 'opportunity')");
    $stmt->execute([$opp['creator_id'], "$userName applied to \"{$opp['title']}\"", $oppId]);

    jsonResponse(['message' => 'Application submitted'], 201);

=======
    
    // Can't apply to own opportunity
    if ($opp['creator_id'] == $userId) jsonError('Cannot apply to your own opportunity');
    
    // Check if already applied
    $stmt = $db->prepare('SELECT * FROM opportunity_applications WHERE opportunity_id = ? AND user_id = ?');
    $stmt->execute([$oppId, $userId]);
    if ($stmt->fetch()) jsonError('Already applied');
    
    $stmt = $db->prepare('INSERT INTO opportunity_applications (opportunity_id, user_id, message) VALUES (?, ?, ?)');
    $stmt->execute([$oppId, $userId, $message]);
    
    // Notify creator
    $userName = $db->query("SELECT full_name FROM users WHERE id = $userId")->fetch()['full_name'];
    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, 'application_received', 'New Application 📩', ?, ?, 'opportunity')");
    $stmt->execute([$opp['creator_id'], "$userName applied to \"{$opp['title']}\"", $oppId]);
    
    jsonResponse(['message' => 'Application submitted'], 201);
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $userId = requireAuth();
    $input = getJsonInput();
    $appId = intval($input['application_id'] ?? 0);
    $action = $input['action'] ?? '';
<<<<<<< HEAD

    if (!$appId || !in_array($action, ['accept', 'reject'])) {
        jsonError('application_id and action (accept/reject) required');
    }

=======
    
    if (!$appId || !in_array($action, ['accept', 'reject'])) {
        jsonError('application_id and action (accept/reject) required');
    }
    
    // Get application and verify ownership
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    $stmt = $db->prepare('
        SELECT oa.*, o.creator_id, o.title as opp_title
        FROM opportunity_applications oa
        JOIN opportunities o ON oa.opportunity_id = o.id
        WHERE oa.id = ?
    ');
    $stmt->execute([$appId]);
    $app = $stmt->fetch();
<<<<<<< HEAD

    if (!$app) jsonError('Application not found', 404);
    if ($app['creator_id'] != $userId) jsonError('Not authorized', 403);

    $status = $action === 'accept' ? 'accepted' : 'rejected';
    $stmt = $db->prepare('UPDATE opportunity_applications SET status = ? WHERE id = ?');
    $stmt->execute([$status, $appId]);

    $emoji = $action === 'accept' ? '🎉' : '📋';
    $msg = $action === 'accept'
        ? "Your application for \"{$app['opp_title']}\" has been accepted!"
        : "Your application for \"{$app['opp_title']}\" was not selected";

    $notifType = $action === 'accept' ? 'application_accepted' : 'application_rejected';
    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, ?, ?, ?, ?, 'opportunity')");
    $stmt->execute([$app['user_id'], $notifType, "Application $status $emoji", $msg, $app['opportunity_id']]);

    jsonResponse(['message' => "Application $status"]);

=======
    
    if (!$app) jsonError('Application not found', 404);
    if ($app['creator_id'] != $userId) jsonError('Not authorized', 403);
    
    $status = $action === 'accept' ? 'accepted' : 'rejected';
    $stmt = $db->prepare('UPDATE opportunity_applications SET status = ? WHERE id = ?');
    $stmt->execute([$status, $appId]);
    
    // Notify applicant
    $emoji = $action === 'accept' ? '🎉' : '📋';
    $msg = $action === 'accept' 
        ? "Your application for \"{$app['opp_title']}\" has been accepted!" 
        : "Your application for \"{$app['opp_title']}\" was not selected";
    
    $notifType = $action === 'accept' ? 'application_accepted' : 'application_rejected';
    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, ?, ?, ?, ?, 'opportunity')");
    $stmt->execute([$app['user_id'], $notifType, "Application $status $emoji", $msg, $app['opportunity_id']]);
    
    jsonResponse(['message' => "Application $status"]);
    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
} else {
    jsonError('Method not allowed', 405);
}
