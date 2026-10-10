<?php
require_once __DIR__ . '/config.php';
$page = '';
$clients = ['Coca-Cola', 'Mercedes-Benz', 'EU', 'UNDP', 'Nestlé', 'Toyota', 'Schwarzkopf', 'Yamaha', 'Hyundai', 'Kawasaki', 'Aversi', 'Credo', 'Mazda', 'Julius Meinl', 'Adjarabet'];
$years = (int)date('Y') - $site['founded'];
$portfolio = require __DIR__ . '/data/portfolio.php';
$featured = array_slice(array_values(array_filter($portfolio, fn($p) => $p['cat'] === 'websites')), 0, 6);
require __DIR__ . '/partials/header.php';
?>
<main>
    <section class="hero">
        <div class="scene-abs" data-scene="hero" aria-hidden="true"><div class="scene-fallback"></div></div>
        <div class="wrap hero-inner">
            <p class="eyebrow reveal"><span class="dot"></span><?= e($t['hero_eyebrow']) ?></p>
            <h1 class="hero-title">
                <span class="line"><span class="split"><?= e($t['v2_hero'][0]) ?></span></span>
                <span class="line"><span class="split outline"><?= e($t['v2_hero'][1]) ?></span></span>
                <span class="line"><span class="split"><?= e($t['v2_hero'][2]) ?></span><span class="hero-star" aria-hidden="true">✦</span></span>
            </h1>
            <div class="hero-bottom">
                <div class="hero-copy reveal">
                    <p class="rotator"><?= e($t['hero_rotate_pre']) ?> <span class="rotator-words" data-words="<?= e(json_encode($t['hero_rotate'], JSON_UNESCAPED_UNICODE)) ?>"><b><?= e($t['hero_rotate'][0]) ?></b></span></p>
                    <p class="lead"><?= e($t['v2_hero_sub']) ?></p>
                    <div class="hero-actions">
                        <a class="btn btn-accent" href="<?= e(url('contact')) ?>" data-magnetic><?= e($t['cta']) ?> <span class="arr">→</span></a>
                        <a class="btn btn-ghost" href="#work" data-magnetic><?= e($t['hero_btn2']) ?></a>
                    </div>
                </div>
                <p class="hero-hint reveal" aria-hidden="true"><span class="mouse"><span></span></span><?= e($t['v2_interact']) ?></p>
            </div>
        </div>
    </section>
    <section class="clients" aria-label="<?= e($t['clients_label']) ?>">
        <p class="clients-label"><?= e($t['clients_label']) ?></p>
        <div class="marquee">
            <div class="marquee-track">
                <?php for ($i = 0; $i < 2; $i++): ?>
                <?php foreach ($clients as $c): ?>
                <span class="marquee-item"<?= $i ? ' aria-hidden="true"' : '' ?>><?= e($c) ?></span><span class="marquee-sep" aria-hidden="true">✦</span>
                <?php endforeach; ?>
                <?php endfor; ?>
            </div>
        </div>
    </section>
    <section class="about" id="about">
        <div class="wrap">
            <p class="label reveal">(01) <?= e($t['about_label']) ?></p>
            <p class="about-text reveal-words"><?= $t['about_text'] ?></p>
            <div class="stats">
                <?php foreach ($t['stats'] as $i => $s): ?>
                <?php $n = $i === 0 ? $years : $s['n']; ?>
                <div class="stat glass reveal" style="--d:<?= $i * 90 ?>ms">
                    <span class="stat-num"><span data-count="<?= (int)$n ?>">0</span><?= e($s['s']) ?></span>
                    <span class="stat-label"><?= e($s['l']) ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <section class="services" id="services">
        <div class="wrap">
            <div class="section-head row">
                <div>
                    <p class="label reveal">(02) <?= e($t['services_label']) ?></p>
                    <h2 class="h2 reveal"><?= $t['v2_services_title'] ?></h2>
                </div>
                <a class="btn btn-ghost reveal" href="<?= e(url('services')) ?>" data-magnetic><?= e($t['services_all']) ?> <span class="arr">→</span></a>
            </div>
            <div class="svc-grid">
                <?php foreach ($t['services'] as $i => $s): ?>
                <a class="svc-card glass reveal<?= $i === 0 ? ' is-featured' : '' ?>" href="<?= e(url('services', $s['slug'])) ?>" data-hover style="--d:<?= ($i % 4) * 80 ?>ms">
                    <div class="svc-3d" data-scene="svc" data-variant="<?= e($s['slug']) ?>" aria-hidden="true"><div class="scene-fallback"></div></div>
                    <div class="svc-body">
                        <span class="svc-num"><?= sprintf('%02d', $i + 1) ?></span>
                        <h3 class="svc-title"><?= e($s['t']) ?></h3>
                        <p class="svc-desc"><?= e($s['d']) ?></p>
                        <div class="tags"><?php foreach ($s['tags'] as $tag): ?><span><?= e($tag) ?></span><?php endforeach; ?></div>
                    </div>
                    <span class="svc-arrow" aria-hidden="true">↗</span>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <section class="work" id="work">
        <div class="wrap">
            <div class="section-head row">
                <div>
                    <p class="label reveal">(03) <?= e($t['work_label']) ?></p>
                    <h2 class="h2 reveal"><?= $t['work_title'] ?></h2>
                </div>
                <a class="btn btn-ghost reveal" href="<?= e(url('portfolio')) ?>" data-magnetic><?= e($t['work_all']) ?> <span class="arr">→</span></a>
            </div>
            <div class="work-grid">
                <?php foreach ($featured as $i => $w): ?>
                <a class="work-card reveal v<?= $i + 1 ?>" href="<?= e(url('portfolio', 'websites')) ?>" data-cursor="<?= e($t['work_view']) ?>" data-tilt>
                    <div class="work-media">
                        <img src="<?= e(asset($w['img'])) ?>" alt="<?= e($w['t']) ?>" loading="lazy" width="586" height="346">
                        <span class="work-shine" aria-hidden="true"></span>
                    </div>
                    <div class="work-meta">
                        <h3><?= e($w['t']) ?></h3>
                        <span><?= e($t['types'][$w['type']]) ?></span>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <section class="process" id="process">
        <div class="scene-abs scene-terrain" data-scene="terrain" data-hover aria-hidden="true"><div class="scene-fallback"></div></div>
        <div class="wrap">
            <div class="section-head">
                <p class="label reveal">(04) <?= e($t['process_label']) ?></p>
                <h2 class="h2 reveal"><?= $t['process_title'] ?></h2>
            </div>
            <ol class="process-grid">
                <?php foreach ($t['process'] as $i => $p): ?>
                <li class="step glass reveal" style="--d:<?= $i * 100 ?>ms">
                    <span class="step-num"><?= sprintf('%02d', $i + 1) ?></span>
                    <h3><?= e($p['t']) ?></h3>
                    <p><?= e($p['d']) ?></p>
                </li>
                <?php endforeach; ?>
            </ol>
        </div>
    </section>
    <section class="family">
        <div class="wrap">
            <p class="label reveal">(05) <?= e($t['family_label']) ?></p>
            <div class="family-grid">
                <?php foreach ($t['family'] as $f): ?>
                <a class="family-card glass reveal" href="<?= e($f['u']) ?>" target="_blank" rel="noopener" data-tilt>
                    <h3><?= e($f['t']) ?> <span aria-hidden="true">↗</span></h3>
                    <p><?= e($f['d']) ?></p>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php require __DIR__ . '/partials/cta.php'; ?>
</main>
<?php require __DIR__ . '/partials/footer.php'; ?>
