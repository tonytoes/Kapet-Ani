<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(0);


require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/config.php';
applyCors(); 

$db   = new Database();
$conn = $db->connect();


function sendResponse(int $code, bool $success, string $message, array $extra = []): void
{
    ob_clean();
    http_response_code($code);
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit();
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET')  getTransactions();
    if ($method === 'POST') updateOrderStatus();
    sendResponse(405, false, 'Method not allowed');
} catch (Throwable $e) {
    sendResponse(500, false, $e->getMessage());
}


// ─────────────────────────────────────────────────────────
// 📋 GET TRANSACTIONS
// ─────────────────────────────────────────────────────────

function getTransactions(): void
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            o.id,
            o.tracking_no,
            o.name,
            o.email,
            o.phone,
            o.address,
            o.postalcode,
            o.total_price,
            o.payment_mode,
            o.payment_id,
            o.status,
            o.created_at,
            COUNT(oi.id) AS item_count,
            SUM(oi.qty)  AS total_qty
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(fn($r) => [
        // dbId  = real integer PK used for UPDATE queries
        // trackingId = the human-readable #TRK... shown in the UI
        'dbId'        => (int) $r['id'],
        'trackingId'  => '#' . $r['tracking_no'],
        'username'    => $r['name'],
        'email'       => $r['email'],
        'phone'       => $r['phone'],
        'address'     => $r['address'],
        'postalcode'  => $r['postalcode'],
        'orderAmount' => (int) ($r['total_qty'] ?? 0),
        'totalPrice'  => '₱' . number_format($r['total_price'], 2),
        'paymentMode' => $r['payment_mode'] ?? '—',
        'paymentId'   => $r['payment_id']   ?? '—',
        'status'      => $r['status'],
        'date'        => date('M d, Y', strtotime($r['created_at'])),
        'timestamp'   => (int) strtotime($r['created_at']),
    ], $rows);

    sendResponse(200, true, 'Transactions fetched', ['transactions' => $formatted]);
}


// ─────────────────────────────────────────────────────────
// ✏️  UPDATE ORDER STATUS
// ─────────────────────────────────────────────────────────

function updateOrderStatus(): void
{
    global $conn;

    $raw    = file_get_contents("php://input");
    $data   = json_decode($raw, true) ?? [];

    // Must match JS: JSON.stringify({ dbId, status })
    $id     = (int)  ($data['dbId']  ?? 0);
    $status = trim($data['status'] ?? '');

    $allowed = ['pending', 'confirmed', 'cancelled'];

    if (!$id) {
        sendResponse(400, false, 'Order ID required');
    }

    if (!in_array($status, $allowed)) {
        sendResponse(400, false, 'Invalid status');
    }

    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    sendResponse(200, true, 'Order status updated');
}