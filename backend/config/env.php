<?php

$host    = $_SERVER['HTTP_HOST'] ?? 'localhost';
$isLocal = in_array($host, ['localhost', '127.0.0.1']) || str_starts_with($host, 'localhost:');

define('IS_LOCAL', $isLocal);

define('LINK_PATH', $isLocal
    ? 'http://localhost/backend/controllers/'
    : 'https://cornflowerblue-skunk-618358.hostingersite.com/backend/controllers/'
);

define('ALLOWED_ORIGINS', $isLocal
    ? ['http://localhost:5173']
    : ['https://cornflowerblue-skunk-618358.hostingersite.com']
);

define('DB_HOST',    'localhost');
define('DB_NAME',    $isLocal ? 'kapetpamana'          : 'u136989324_admin');
define('DB_USER',    $isLocal ? 'root'                 : 'u136989324_superadmin');
define('DB_PASS',    $isLocal ? ''                     : 'KapetAdmin123@');
define('DB_CHARSET', 'utf8mb4');