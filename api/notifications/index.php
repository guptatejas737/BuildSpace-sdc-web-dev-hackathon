<?php
/**
 * BuildSpace - Notifications API
 * GET: Get notifications
 * PUT: Mark as read
 */
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();
$userId = requireAuth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    $unreadOnly = isset($_GET['unread']);
    
    $where = 'n.user_id = ?';
    $params = [$userId];
    
    if ($unreadOnly) {
        $where .= ' AND n.is_read = 0';
    }
    
    $stmt = $db->prepare("SELECT n.* FROM notifications n WHERE $where ORDER BY n.created_at DESC LIMIT $limit OFFSET $offset");
    $stmt->execute($params);
    $notifications = $stmt->fetchAll();
    
    // Unread count
    $stmt = $db->prepare('SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ? AND is_read = 0');
    $stmt->execute([$userId]);
    $unreadCount = $stmt->fetch()['cnt'];
    
    // Message unread count
    $stmt = $db->prepare('SELECT COUNT(*) as cnt FROM messages WHERE receiver_id = ? AND is_read = 0');
    $stmt->execute([$userId]);
    $unreadMessages = $stmt->fetch()['cnt'];
    
    jsonResponse([
        'notifications' => $notifications,
        'unread_count' => $unreadCount,
        'unread_messages' => $unreadMessages
    ]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = getJsonInput();
    
    if (isset($input['id'])) {
        // Mark single notification as read
        $stmt = $db->prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?');
        $stmt->execute([intval($input['id']), $userId]);
    } else {
        // Mark all as read
        $stmt = $db->prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?');
        $stmt->execute([$userId]);
    }
    
    jsonResponse(['message' => 'Notifications updated']);
    
} else {
    jsonError('Method not allowed', 405);
}
