<?php
session_start();
$site = [
    'name' => 'Smart Agency',
    'url' => 'https://smartweb.ge',
    'founded' => 2011,
    'phone' => '+995 591 400 011',
    'phone2' => '+995 322 110 105',
    'email' => 'info@smartweb.ge',
    'mail_to' => 'info@smartweb.ge',
    'mail_from' => 'noreply@smartweb.ge',
    'whatsapp' => '995591400011',
    'map_query' => 'Zedazeni St 2, Tbilisi, Georgia',
    'social' => [
        'Facebook' => 'https://facebook.com/smartweb.ge',
        'Instagram' => 'https://instagram.com/smartweb.ge',
        'Behance' => 'https://behance.net/SmartWebGe',
        'Dribbble' => 'https://dribbble.com/SmartWeb-ge',
    ],
];
$langs = ['ka', 'en'];
$lang = $_GET['lang'] ?? 'ka';
if (!in_array($lang, $langs, true)) {
    $lang = 'ka';
}
$t = require __DIR__ . '/lang/' . $lang . '.php';
function e($s)
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}
function asset($path)
{
    $file = __DIR__ . '/' . $path;
    return '/' . $path . (is_file($file) ? '?v=' . filemtime($file) : '');
}
function url($page = '', $anchor = '', $forLang = null, $params = [])
{
    global $lang;
    $l = $forLang ?? $lang;
    if ($l !== 'ka') {
        $params = ['lang' => $l] + $params;
    }
    return '/' . $page . ($params ? '?' . http_build_query($params) : '') . ($anchor !== '' ? '#' . $anchor : '');
}
function tel($phone)
{
    return 'tel:' . str_replace(' ', '', $phone);
}
