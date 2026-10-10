<?php
session_start();
$site = [
    'name' => 'Smart Agency',
    'url' => 'https://smartweb.ge',
    'base' => '/v2/',
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
// Paths starting with "/" point to the site root (shared files such as portfolio images), others to this version's folder
function asset($path)
{
    global $site;
    if ($path[0] === '/') {
        $file = dirname(__DIR__) . $path;
        $href = $path;
    } else {
        $file = __DIR__ . '/' . $path;
        $href = $site['base'] . $path;
    }
    return $href . (is_file($file) ? '?v=' . filemtime($file) : '');
}
function url($page = '', $anchor = '', $forLang = null, $params = [])
{
    global $lang, $site;
    $l = $forLang ?? $lang;
    if ($l !== 'ka') {
        $params = ['lang' => $l] + $params;
    }
    return $site['base'] . $page . ($params ? '?' . http_build_query($params) : '') . ($anchor !== '' ? '#' . $anchor : '');
}
function tel($phone)
{
    return 'tel:' . str_replace(' ', '', $phone);
}
