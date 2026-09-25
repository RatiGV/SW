<?php
require_once __DIR__ . '/config.php';
$page = 'portfolio';
$metaTitle = $t['pf_meta_title'];
$metaDesc = $t['pf_meta_desc'];
$portfolio = require __DIR__ . '/data/portfolio.php';
$counts = array_count_values(array_column($portfolio, 'cat'));
$heroLabel = $t['pf_label'];
$heroTitle = $t['pf_title'];
$heroSub = $t['pf_sub'];
require __DIR__ . '/partials/header.php';
?>
<main>
    <?php require __DIR__ . '/partials/page-hero.php'; ?>
    <section class="pf">
        <div class="wrap">
            <div class="pf-filters reveal" role="tablist" aria-label="<?= e($t['pf_label']) ?>">
                <?php foreach ($t['pf_filters'] as $key => $label): ?>
                <button type="button" role="tab" class="pf-filter<?= $key === 'all' ? ' is-active' : '' ?>" data-filter="<?= e($key) ?>" aria-selected="<?= $key === 'all' ? 'true' : 'false' ?>">
                    <?= e($label) ?> <sup><?= $key === 'all' ? count($portfolio) : (int)($counts[$key] ?? 0) ?></sup>
                </button>
                <?php endforeach; ?>
            </div>
            <div class="pf-grid" id="pfGrid">
                <?php foreach ($portfolio as $i => $p): ?>
                <button type="button" class="pf-item pf-<?= e($p['cat']) ?>" data-cat="<?= e($p['cat']) ?>" data-index="<?= $i ?>" data-cursor="<?= e($t['work_view']) ?>">
                    <span class="pf-media"><img src="<?= e(asset($p['img'])) ?>" alt="<?= e($p['t']) ?>" loading="lazy"></span>
                    <span class="pf-meta">
                        <span class="pf-title"><?= e($p['t']) ?></span>
                        <span class="pf-type"><?= e($t['types'][$p['type']]) ?></span>
                    </span>
                </button>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="<?= e($t['pf_label']) ?>" hidden>
        <button type="button" class="lb-close" aria-label="<?= e($t['pf_close']) ?>">✕</button>
        <button type="button" class="lb-nav lb-prev" aria-label="<?= e($t['pf_prev']) ?>">←</button>
        <figure class="lb-figure">
            <img src="" alt="">
            <figcaption><strong></strong><span></span></figcaption>
        </figure>
        <button type="button" class="lb-nav lb-next" aria-label="<?= e($t['pf_next']) ?>">→</button>
    </div>
    <?php require __DIR__ . '/partials/cta.php'; ?>
</main>
<?php require __DIR__ . '/partials/footer.php'; ?>
