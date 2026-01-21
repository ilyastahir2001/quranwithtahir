<?php
/**
 * QWT Institutional Gateway v4.2
 * Handles high-integrity user operations and MySQL synchronization.
 */
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = file_get_contents("php://input");
$data = json_decode($input, true);
$action = $_GET['action'] ?? '';

$db = getDB();

switch ($action) {
    case 'register':
        $db->beginTransaction();
        try {
            $hashed = password_hash($data['password'] ?? '', PASSWORD_BCRYPT);
            $stmt = $db->prepare("INSERT INTO users (academyId, name, email, password, role, course, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, 'APPROVED', ?)");
            $stmt->execute([
                $data['academyId'], $data['name'], $data['email'], $hashed, 
                $data['role'], $data['course'], time()
            ]);
            $db->commit();
            echo json_encode(['success' => true, 'id' => $data['academyId']]);
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode(['success' => false, 'error' => 'Identity conflict or DB error: ' . $e->getMessage()]);
        }
        exit;

    case 'login':
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$data['email'] ?? '']);
        $user = $stmt->fetch();
        
        if ($user && password_verify($data['password'] ?? '', $user['password'])) {
            unset($user['password']); // Never leak hash
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid academic credentials']);
        }
        exit;

    case 'get_all':
        try {
            $stmt = $db->query("SELECT academyId, name, email, role, status, tier FROM users ORDER BY id DESC");
            echo json_encode(['users' => $stmt->fetchAll()]);
        } catch (Exception $e) {
            echo json_encode(['users' => [], 'error' => $e->getMessage()]);
        }
        exit;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Action not found']);
        exit;
}