<?php
require_once 'config.php';

class AcademyDB {
    private $pdo;

    public function __construct() {
        $this->pdo = getDB();
    }

    public function getUserByEmail($email) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function registerUser($data) {
        $sql = "INSERT INTO users (academyId, name, email, password, role, course, status, timestamp) 
                VALUES (:id, :name, :email, :pass, :role, :course, 'APPROVED', :time)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $data['academyId'],
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':pass' => password_hash($data['password'], PASSWORD_BCRYPT),
            ':role' => $data['role'],
            ':course' => $data['course'],
            ':time' => time()
        ]);
    }

    public function syncProgress($academyId, $progress, $streak) {
        $stmt = $this->pdo->prepare("UPDATE users SET progressPercent = ?, streakCount = ? WHERE academyId = ?");
        return $stmt->execute([$progress, $streak, $academyId]);
    }
}
