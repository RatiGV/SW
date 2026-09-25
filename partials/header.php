<?php $other = $lang === 'ka' ? 'en' : 'ka'; ?>
<!doctype html>
<html lang="<?= e($lang) ?>" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($t['meta_title']) ?></title>
<meta name="description" content="<?= e($t['meta_desc']) ?>">
<meta property="og:title" content="<?= e($t['meta_title']) ?>">
<meta property="og:description" content="<?= e($t['meta_desc']) ?>">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0b0b0f">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;700;800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Georgian:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= e(asset('assets/css/style.css')) ?>">
</head>
<body class="lang-<?= e($lang) ?>">
<div class="cursor" aria-hidden="true"><span></span></div>
<div class="grain" aria-hidden="true"></div>
<header class="nav" id="top">
    <a class="logo" href="?lang=<?= e($lang) ?>" aria-label="Smart Web">
        <span class="logo-mark">S</span><span class="logo-text">smart<b>web</b><i>.</i></span>
    </a>
    <nav class="nav-links" id="navLinks">
        <?php foreach ($t['nav'] as $id => $label): ?>
        <a href="<?= $id === 'pricing' ? 'pricing.php?lang=' . e($lang) : '#' . e($id) ?>" data-magnetic><?= e($label) ?></a>
        <?php endforeach; ?>
    </nav>
    <div class="nav-right">
        <a class="lang-switch" href="?lang=<?= e($other) ?>" hreflang="<?= e($other) ?>"><?= $other === 'en' ? 'EN' : 'ქარ' ?></a>
        <a class="btn btn-accent btn-sm" href="#contact" data-magnetic><?= e($t['cta']) ?></a>
        <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
    </div>
</header>
