<?php
// proxy.php - Forward requests to Maven service

$target_url = 'http://172.32.0.11:35729/api'; // maven is the container name in same network

// Get the request path
$path = isset($_GET['path']) ? $_GET['path'] : '';
$full_url = $target_url . '/' . $path;

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Prepare headers
$headers = [];
foreach (getallheaders() as $name => $value) {
    if (!in_array(strtolower($name), ['host', 'connection'])) {
        $headers[] = $name . ': ' . $value;
    }
}

// Get request body
$body = file_get_contents('php://input');

// Make request to Maven service
$options = [
    'http' => [
        'method' => $method,
        'header' => implode("\r\n", $headers),
        'content' => $body,
        'ignore_errors' => true
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($full_url . '?' . http_build_query($_GET), false, $context);

// Forward response headers
if (isset($http_response_header)) {
    foreach ($http_response_header as $header) {
        header($header);
    }
}

echo $response;
?>
