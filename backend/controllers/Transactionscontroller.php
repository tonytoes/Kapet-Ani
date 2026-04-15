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
    if ($method === 'POST') handlePostAction();
    sendResponse(405, false, 'Method not allowed');
} catch (Throwable $e) {
    sendResponse(500, false, $e->getMessage());
}

function handlePostAction(): void
{
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?? [];
    if (isset($data['dbId']) && isset($data['status'])) {
        updateOrderStatus($data);
        return;
    }
    placeOrder($data);
}


// ─────────────────────────────────────────────────────────
// 📋 GET TRANSACTIONS
// ─────────────────────────────────────────────────────────

function getTransactions(): void
{
    global $conn;

    $archiveEmail = 'deleted.user@system.local';
    $stmt = $conn->query("
        SELECT
            o.id,
            o.user_id,
            o.tracking_no,
            o.name AS order_name,
            o.email AS order_email,
            u.first_name AS user_first_name,
            u.last_name  AS user_last_name,
            u.email      AS user_email,
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
        LEFT JOIN users u ON u.id = o.user_id
        LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY
            o.id, o.user_id, o.tracking_no,
            o.name, o.email, u.first_name, u.last_name, u.email,
            o.phone, o.address, o.postalcode,
            o.total_price, o.payment_mode, o.payment_id, o.status, o.created_at
        ORDER BY o.created_at DESC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(function ($r) use ($archiveEmail) {
        $userEmail = isset($r['user_email']) ? (string)$r['user_email'] : '';
        $isArchive = $userEmail !== '' && strtolower($userEmail) === strtolower($archiveEmail);
        $hasRealUser = !$isArchive && ((int)($r['user_id'] ?? 0) > 0) && $userEmail !== '';

        $liveName = trim(((string)($r['user_first_name'] ?? '')) . ' ' . ((string)($r['user_last_name'] ?? '')));
        $orderName = (string)($r['order_name'] ?? '');
        $orderEmail = (string)($r['order_email'] ?? '');

        $displayName = $hasRealUser && $liveName !== '' ? $liveName : $orderName;
        $displayEmail = $hasRealUser ? $userEmail : $orderEmail;

        return [
        // dbId  = real integer PK used for UPDATE queries
        // trackingId = the human-readable #TRK... shown in the UI
        'dbId'        => (int) $r['id'],
        'userId'      => (int) ($r['user_id'] ?? 0),
        'trackingId'  => '#' . $r['tracking_no'],
        'username'    => $displayName,
        'email'       => $displayEmail,
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
        ];
    }, $rows);

    sendResponse(200, true, 'Transactions fetched', ['transactions' => $formatted]);
}


// ─────────────────────────────────────────────────────────
// ✏️  UPDATE ORDER STATUS
// ─────────────────────────────────────────────────────────

function updateOrderStatus(array $data): void
{
    global $conn;

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

function placeOrder(array $data): void
{
    global $conn;

    $userId      = (int)($data['user_id'] ?? 0);
    $name        = trim($data['name'] ?? '');
    $email       = trim($data['email'] ?? '');
    $phone       = trim($data['phone'] ?? '');
    $address     = trim($data['address'] ?? '');
    $postalcode  = trim($data['postalcode'] ?? '');
    $paymentMode = trim($data['payment_mode'] ?? 'COD');
    $paymentId   = trim($data['payment_id'] ?? '');
    $items       = $data['items'] ?? [];

    if ($name === '' || $email === '' || $phone === '' || $address === '' || $postalcode === '') {
        sendResponse(400, false, 'Customer information is incomplete');
    }
    if (!is_array($items) || count($items) === 0) {
        sendResponse(400, false, 'Cart is empty');
    }

    $paymentAllowed = ['COD', 'GCash', 'PayPal', 'Card'];
    if (!in_array($paymentMode, $paymentAllowed, true)) $paymentMode = 'COD';

    $cleanItems = [];
    foreach ($items as $item) {
        $pid = (int)($item['id'] ?? 0);
        $qty = (int)($item['qty'] ?? 0);
        if ($pid > 0 && $qty > 0) $cleanItems[] = ['id' => $pid, 'qty' => $qty];
    }
    if (count($cleanItems) === 0) sendResponse(400, false, 'No valid items to checkout');

    try {
        $conn->beginTransaction();

        $orderTotal = 0.0;
        $resolved = [];
        $select = $conn->prepare("SELECT id, name, qty, price, discount, totalprice FROM products WHERE id = ? LIMIT 1 FOR UPDATE");

        foreach ($cleanItems as $it) {
            $select->execute([$it['id']]);
            $prod = $select->fetch(PDO::FETCH_ASSOC);
            if (!$prod) throw new Exception("Product #{$it['id']} not found");
            $stock = (int)$prod['qty'];
            $wanted = (int)$it['qty'];
            if ($wanted > $stock) {
                throw new Exception("Insufficient stock for {$prod['name']}. Available: {$stock}");
            }
            $discount = (int)($prod['discount'] ?? 0);
            $base = (float)$prod['price'];
            $priceToUse = $discount > 0 ? (float)$prod['totalprice'] : $base;
            $line = $priceToUse * $wanted;
            $orderTotal += $line;
            $resolved[] = [
                'prod_id' => (int)$prod['id'],
                'qty' => $wanted,
                'unit_price' => $priceToUse,
                'new_qty' => $stock - $wanted,
            ];
        }

        $tracking = 'TRK' . strtoupper(substr(bin2hex(random_bytes(6)), 0, 10));
        if ($paymentId === '') $paymentId = 'PAY' . strtoupper(substr(bin2hex(random_bytes(5)), 0, 8));

        $initialStatus = $paymentMode === 'COD' ? 'pending' : 'confirmed';

        $insertOrder = $conn->prepare("
            INSERT INTO orders (tracking_no, user_id, name, email, phone, address, postalcode, total_price, payment_mode, payment_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $insertOrder->execute([
            $tracking,
            $userId > 0 ? $userId : 0,
            $name,
            $email,
            $phone,
            $address,
            $postalcode,
            round($orderTotal, 2),
            $paymentMode,
            $paymentId,
            $initialStatus,
        ]);
        $orderId = (int)$conn->lastInsertId();

        $insertItem = $conn->prepare("INSERT INTO order_items (order_id, prod_id, qty, price) VALUES (?, ?, ?, ?)");
        $updateStock = $conn->prepare("UPDATE products SET qty = ? WHERE id = ?");
        foreach ($resolved as $r) {
            $insertItem->execute([$orderId, $r['prod_id'], $r['qty'], round($r['unit_price'], 2)]);
            $updateStock->execute([$r['new_qty'], $r['prod_id']]);
        }

        $conn->commit();
        sendResponse(201, true, 'Order placed successfully', [
            'order' => [
                'dbId' => $orderId,
                'trackingId' => '#' . $tracking,
                'paymentId' => $paymentId,
                'paymentMode' => $paymentMode,
                'totalPrice' => '₱' . number_format($orderTotal, 2),
                'status' => $initialStatus,
            ],
        ]);
    } catch (Throwable $e) {
        if ($conn->inTransaction()) $conn->rollBack();
        sendResponse(400, false, $e->getMessage());
    }
}