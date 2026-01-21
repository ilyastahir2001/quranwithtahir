<?php
require_once 'config.php';

// Professional SQL Schema for Quran Academy
$sql = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academyId VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255),
    authProvider ENUM('EMAIL', 'GOOGLE') DEFAULT 'EMAIL',
    role ENUM('DIRECTOR', 'DEAN', 'TUTOR', 'REGISTRAR', 'BURSAR', 'GUARDIAN', 'STUDENT') DEFAULT 'STUDENT',
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    course VARCHAR(100),
    tier ENUM('STANDARD', 'SENIOR', 'ELITE') DEFAULT 'STANDARD',
    hasPaid TINYINT(1) DEFAULT 0,
    streakCount INT DEFAULT 0,
    points INT DEFAULT 0,
    progressPercent INT DEFAULT 0,
    rank VARCHAR(50) DEFAULT 'NOVICE',
    timestamp BIGINT
);
";

try {
    $db = getDB();
    $db->exec($sql);
    echo "<h1>QWT Database Initialized Successfully</h1>";
    echo "<p>Relational tables for Users, Streaks, and Registry are now live.</p>";
} catch (PDOException $e) {
    echo "Initialization Error: " . $e->getMessage();
}
?>