<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(0);

$allowedOrigins = ['http://localhost:5173'];

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/jwt.php';

$db   = new Database();
$conn = $db->connect();

header('Content-Type: application/json');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function sendResponse(int $code, bool $success, string $message, array $extra = []): void
{
    ob_clean();
    http_response_code($code);
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendResponse(405, false, 'Method not allowed');
    }

    getTransactions();

} catch (Throwable $e) {
    sendResponse(500, false, $e->getMessage());
}


function getTransactions(): void
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            o.tracking_no,
            o.name,
            o.total_price,
            o.payment_mode,
            o.status,
            o.created_at,
            COUNT(oi.id)   AS item_count,
            SUM(oi.qty)    AS total_qty
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(fn($r) => [
        'id'          => '#' . $r['tracking_no'],
        'username'    => $r['name'],
        'orderAmount' => (int) $r['total_qty'],
        'totalPrice'  => '₱' . number_format($r['total_price'], 2),
        'paymentMode' => $r['payment_mode'] ?? '—',
        'status'      => $r['status'],
        'date'        => date('M d, Y', strtotime($r['created_at'])),
        'timestamp'   => (int) strtotime($r['created_at']),
    ], $rows);

    sendResponse(200, true, 'Transactions fetched', ['transactions' => $formatted]);
}