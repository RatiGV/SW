<?php
require_once __DIR__ . '/config.php';
$page = 'services';
$metaTitle = $t['srv_meta_title'];
$metaDesc = $t['srv_meta_desc'];
$portfolio = require __DIR__ . '/data/portfolio.php';
$showcase = [
    'web-design' => ['websites', 'meinl'],
    'app-development' => ['websites', 'players'],
    'branding' => ['branding', 'avocado'],
    'social-media' => ['facebook', 'sorelle'],
    'photo-video' => ['websites', 'mercedes'],
    'seo' => ['websites', 'ocg'],
    'website-care' => ['websites', 'hyundai'],
];
$findImg = function ($cat, $slug) use ($portfolio) {
    foreach ($portfolio as $p) {
        if ($p['cat'] === $cat && basename($p['img'], '.webp') === $slug) {
            return $p;
        }
    }
    return null;
};
$heroLabel = $t['srv_label'];
$heroTitle = $t['srv_title'];
$heroSub = $t['srv_sub'];
require __DIR__ . '/partials/header.php';
?>
<main>
    <?php require __DIR__ . '/partials/page-hero.php'; ?>
    <nav class="srv-index" aria-label="<?= e($t['srv_label']) ?>">
        <div class="wrap srv-index-inner">
            <?php foreach ($t['services'] as $i => $s): ?>
            <a href="#<?= e($s['slug']) ?>"><span><?= sprintf('%02d', $i + 1) ?></span><?= e($s['t']) ?></a>
            <?php endforeach; ?>
        </div>
    </nav>
    <section class="srv-list">
        <div class="wrap">
            <?php foreach ($t['services'] as $i => $s): ?>
            <?php $img = $findImg(...$showcase[$s['slug']]); ?>
            <article class="srv" id="<?= e($s['slug']) ?>">
                <div class="srv-media reveal">
                    <span class="srv-num" aria-hidden="true"><?= sprintf('%02d', $i + 1) ?></span>
                    <?php if ($img): ?>
                    <img src="<?= e(asset($img['img'])) ?>" alt="<?= e($img['t']) ?>" loading="lazy">
                    <?php endif; ?>
                </div>
                <div class="srv-content">
                    <h2 class="srv-title reveal"><?= e($s['t']) ?></h2>
                    <p class="srv-lead reveal"><?= e($s['d']) ?></p>
                    <p class="srv-text reveal"><?= e($s['long']) ?></p>
                    <p class="srv-sub reveal"><?= e($t['srv_includes']) ?></p>
                    <ul class="srv-items reveal">
                        <?php foreach ($s['items'] as $item): ?>
                        <li><?= e($item) ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <div class="srv-actions reveal">
                        <a class="btn btn-accent" href="<?= e(url('contact', '', null, ['service' => $s['slug']])) ?>" data-magnetic><?= e($t['srv_discuss']) ?> <span class="arr">→</span></a>
                        <?php if ($s['price'] !== ''): ?>
                        <a class="btn btn-ghost" href="<?= e(url('pricing')) ?>" data-magnetic><?= e($s['price']) ?></a>
                        <?php endif; ?>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </section>
    <section class="process" id="process">
        <div class="wrap">
            <div class="section-head">
                <p class="label reveal"><?= e($t['process_label']) ?></p>
                <h2 class="h2 reveal"><?= $t['process_title'] ?></h2>
            </div>
            <ol class="process-grid">
                <?php foreach ($t['process'] as $i => $p): ?>
                <li class="step reveal" style="--d:<?= $i * 100 ?>ms">
                    <span class="step-num"><?= sprintf('%02d', $i + 1) ?></span>
                    <h3><?= e($p['t']) ?></h3>
                    <p><?= e($p['d']) ?></p>
                </li>
                <?php endforeach; ?>
            </ol>
        </div>
    </section>
    <?php require __DIR__ . '/partials/cta.php'; ?>
</main>
<?php require __DIR__ . '/partials/footer.php'; ?>
