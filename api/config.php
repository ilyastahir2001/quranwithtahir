<?php
// QWT Institutional Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'quranwithtahir_db');
define('DB_USER', 'root'); // Update with your hosting DB username
define('DB_PASS', '');     // Update with your hosting DB password

function getDB() {
    try {
        $db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ATTR_ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::ATTR_FETCH_ASSOC);
        return $db;
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Database Link Failure: ' . $e->getMessage()]);
        exit;
    }
}