<?php
$site = [
    'name' => 'Smart Web',
    'founded' => 2011,
    'phone' => '+995 591 400 011',
    'phone2' => '+995 322 110 105',
    'email' => 'info@smartweb.ge',
    'social' => [
        'Facebook' => 'https://facebook.com/smartweb.ge',
        'Instagram' => 'https://instagram.com/smartweb.ge',
        'Behance' => 'https://behance.net/SmartWebGe',
        'Dribbble' => 'https://dribbble.com/SmartWeb-ge',
    ],
];
$langs = ['ka', 'en'];
$lang = $_GET['lang'] ?? ($_COOKIE['lang'] ?? 'ka');
if (!in_array($lang, $langs, true)) {
    $lang = 'ka';
}
if (isset($_GET['lang']) && !headers_sent()) {
    setcookie('lang', $lang, time() + 31536000, '/');
}
$t = require __DIR__ . '/lang/' . $lang . '.php';
function e($s)
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}
function asset($path)
{
    $file = __DIR__ . '/' . $path;
    return $path . (is_file($file) ? '?v=' . filemtime($file) : '');
}
