<?php
/**
 * BuildSpace - Messages API
 * GET: Get conversations or messages
 * POST: Send message
 */
require_once __DIR__ . '/../../config/database.php';
header('Content-Type: application/json');

$db = getDB();
$userId = requireAuth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // If user_id provided, get conversation with that user
    if (isset($_GET['user_id'])) {
        $otherUserId = intval($_GET['user_id']);
        
        // Mark messages as read
        $stmt = $db->prepare('UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?');
        $stmt->execute([$otherUserId, $userId]);
        
        // Get messages
        $stmt = $db->prepare('
            SELECT m.*, u.username as sender_username, u.full_name as sender_name, u.avatar_url as sender_avatar
            FROM messages m JOIN users u ON m.sender_id = u.id
            WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.created_at ASC
            LIMIT 100
        ');
        $stmt->execute([$userId, $otherUserId, $otherUserId, $userId]);
        $messages = $stmt->fetchAll();
        
        // Get other user info
        $stmt = $db->prepare('SELECT id, username, full_name, avatar_url, is_online FROM users WHERE id = ?');
        $stmt->execute([$otherUserId]);
        $otherUser = $stmt->fetch();
        
        jsonResponse(['messages' => $messages, 'other_user' => $otherUser]);
    }
    
    // Get conversation list
    $sql = "
        SELECT 
            IF(m.sender_id = ?, m.receiver_id, m.sender_id) as other_user_id,
            u.username, u.full_name, u.avatar_url, u.is_online,
            m.content as last_message,
            m.created_at as last_message_at,
            m.sender_id as last_sender_id,
            (SELECT COUNT(*) FROM messages m2 WHERE m2.sender_id = IF(m.sender_id = ?, m.receiver_id, m.sender_id) AND m2.receiver_id = ? AND m2.is_read = 0) as unread_count
        FROM messages m
        JOIN users u ON u.id = IF(m.sender_id = ?, m.receiver_id, m.sender_id)
        WHERE m.id IN (
            SELECT MAX(id) FROM messages 
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
        )
        ORDER BY m.created_at DESC
    ";
    $stmt = $db->prepare($sql);
    $stmt->execute([$userId, $userId, $userId, $userId, $userId, $userId]);
    
    // Total unread
    $unreadStmt = $db->prepare('SELECT COUNT(*) as cnt FROM messages WHERE receiver_id = ? AND is_read = 0');
    $unreadStmt->execute([$userId]);
    
    jsonResponse([
        'conversations' => $stmt->fetchAll(),
        'total_unread' => $unreadStmt->fetch()['cnt']
    ]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    $receiverId = intval($input['receiver_id'] ?? 0);
    $content = sanitize($input['content'] ?? '');
    
    if (!$receiverId || empty($content)) {
        jsonError('Receiver ID and message content required');
    }
    if ($receiverId === $userId) jsonError('Cannot message yourself');
    
    // Check receiver exists
    $stmt = $db->prepare('SELECT id, full_name FROM users WHERE id = ?');
    $stmt->execute([$receiverId]);
    if (!$stmt->fetch()) jsonError('User not found', 404);
    
    $stmt = $db->prepare('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)');
    $stmt->execute([$userId, $receiverId, $content]);
    
    // Notify receiver
    $senderName = $db->query("SELECT full_name FROM users WHERE id = $userId")->fetch()['full_name'];
    $stmt = $db->prepare("INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type) VALUES (?, 'message', 'New Message 💬', ?, ?, 'user')");
    $stmt->execute([$receiverId, "New message from $senderName", $userId]);
    
    jsonResponse(['message' => 'Message sent'], 201);
    
} else {
    jsonError('Method not allowed', 405);
}
