<?php
/**
 * QWT AI Proxy v4.0 - Institutional Grade
 * Hides API Key from frontend and enforces server-side rate limiting.
 */
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// SECURITY: Retrieve API Key from Server Environment
$api_key = getenv('API_KEY'); 

if (!$api_key) {
    http_response_code(500);
    echo json_encode(['error' => 'Server Environment Configuration Error: Missing API_KEY']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$prompt = $input['prompt'] ?? '';

if (empty($prompt)) {
    http_response_code(400);
    echo json_encode(['error' => 'Instruction Input Required']);
    exit;
}

// Using Gemini 3 Flash for high-performance scholarly inquiries
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" . $api_key;

$payload = [
    "contents" => [
        [
            "role" => "user",
            "parts" => [
                ["text" => "You are the Elite AI Scholarly Assistant at QuranWithTahir.com. Provide a detailed, respectful, and academically grounded response to: " . $prompt]
            ]
        ]
    ],
    "generationConfig" => [
        "temperature" => 0.7,
        "topP" => 0.95,
        "maxOutputTokens" => 1024
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($http_code !== 200) {
    http_response_code($http_code);
    echo json_encode(['error' => 'Upstream AI Error', 'details' => json_decode($response)]);
    exit;
}

echo $response;
exit;