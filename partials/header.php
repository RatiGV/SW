<?php
$page = $page ?? '';
$other = $lang === 'ka' ? 'en' : 'ka';
$metaTitle = $metaTitle ?? $t['meta_title'];
$metaDesc = $metaDesc ?? $t['meta_desc'];
$logo = '<span class="logo-mark">S</span><span class="logo-text">smart<b>agency</b><i>.</i></span>';
?>
<!doctype html>
<html lang="<?= e($lang) ?>" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($metaTitle) ?></title>
<meta name="description" content="<?= e($metaDesc) ?>">
<link rel="canonical" href="<?= e($site['url'] . url($page)) ?>">
<?php foreach ($langs as $l): ?>
<link rel="alternate" hreflang="<?= e($l) ?>" href="<?= e($site['url'] . url($page, '', $l)) ?>">
<?php endforeach; ?>
<meta property="og:title" content="<?= e($metaTitle) ?>">
<meta property="og:description" content="<?= e($metaDesc) ?>">
<meta property="og:type" content="website">
<meta property="og:site_name" content="<?= e($site['name']) ?>">
<meta name="theme-color" content="#0b0b0f">
<link rel="icon" href="<?= e(asset('assets/img/favicon.svg')) ?>" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Georgian:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= e(asset('assets/css/style.css')) ?>">
</head>
<body class="lang-<?= e($lang) ?> page-<?= e($page ?: 'home') ?>">
<div class="cursor" aria-hidden="true"><span></span></div>
<div class="grain" aria-hidden="true"></div>
<header class="nav" id="top">
    <a class="logo" href="<?= e(url()) ?>" aria-label="<?= e($site['name']) ?>"><?= $logo ?></a>
    <nav class="nav-links" id="navLinks">
        <?php foreach ($t['nav'] as $id => $label): ?>
        <a href="<?= e(url($id)) ?>"<?= $page === $id ? ' class="is-active" aria-current="page"' : '' ?> data-magnetic><?= e($label) ?></a>
        <?php endforeach; ?>
    </nav>
    <div class="nav-right">
        <a class="lang-switch" href="<?= e(url($page, '', $other)) ?>" hreflang="<?= e($other) ?>" lang="<?= e($other) ?>"><?= $other === 'en' ? 'EN' : 'ქარ' ?></a>
        <a class="btn btn-accent btn-sm" href="<?= e(url('contact')) ?>" data-magnetic><?= e($t['cta']) ?></a>
        <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
    </div>
</header>
