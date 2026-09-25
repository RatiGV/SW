<?php
// Local dev router for "php -S localhost:8000 router.php" (mirrors .htaccess rules)
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path !== '/' && is_file(__DIR__ . $path)) {
    return false;
}
$pages = ['' => 'index.php', 'services' => 'services.php', 'portfolio' => 'portfolio.php', 'pricing' => 'pricing.php', 'contact' => 'contact.php'];
$slug = trim($path, '/');
if (isset($pages[$slug])) {
    require __DIR__ . '/' . $pages[$slug];
    return true;
}
http_response_code(404);
require __DIR__ . '/404.php';
