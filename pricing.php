<?php
require_once __DIR__ . '/config.php';
$page = 'pricing';
$metaTitle = $t['pr_meta_title'];
$metaDesc = $t['pr_meta_desc'];
$heroLabel = $t['pr_label'];
$heroTitle = $t['pr_title'];
$heroSub = $t['pr_sub'];
$faqSchema = ['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => array_map(fn($f) => ['@type' => 'Question', 'name' => $f['q'], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['a']]], $t['faq'])];
require __DIR__ . '/partials/header.php';
?>
<main>
    <?php require __DIR__ . '/partials/page-hero.php'; ?>
    <section class="pricing">
        <div class="wrap">
            <div class="price-grid">
                <?php foreach ($t['packages'] as $i => $p): ?>
                <article class="price-card reveal<?= !empty($p['popular']) ? ' is-popular' : '' ?>" style="--d:<?= $i * 90 ?>ms">
                    <?php if (!empty($p['popular'])): ?>
                    <span class="price-badge"><?= e($t['pr_popular']) ?></span>
                    <?php endif; ?>
                    <h2 class="price-name"><?= e($p['t']) ?></h2>
                    <p class="price-desc"><?= e($p['d']) ?></p>
                    <p class="price-amount">
                        <?php if ($t['pr_from'] !== ''): ?><small><?= e($t['pr_from']) ?></small><?php endif; ?>
                        <strong><?= e($p['price']) ?></strong>
                        <small><?= e($t['pr_currency']) ?></small>
                    </p>
                    <ul class="price-items">
                        <?php foreach ($p['items'] as $item): ?>
                        <li><?= e($item) ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <a class="btn <?= !empty($p['popular']) ? 'btn-accent' : 'btn-ghost' ?> price-btn" href="<?= e(url('contact', '', null, ['package' => $p['slug']])) ?>" data-magnetic><?= e($t['pr_choose']) ?> <span class="arr">→</span></a>
                </article>
                <?php endforeach; ?>
            </div>
            <p class="price-vat reveal">* <?= e($t['pr_vat']) ?></p>
            <div class="price-includes reveal">
                <p class="label"><?= e($t['pr_all_include']) ?></p>
                <ul>
                    <?php foreach ($t['pr_all_items'] as $item): ?>
                    <li><?= e($item) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </section>
    <section class="price-other">
        <div class="wrap price-other-inner">
            <div>
                <p class="label reveal"><?= e($t['pr_other_label']) ?></p>
                <h2 class="h2 reveal"><?= $t['pr_other_title'] ?></h2>
            </div>
            <div>
                <p class="lead reveal"><?= e($t['pr_other_sub']) ?></p>
                <div class="tags tags-lg reveal">
                    <?php foreach (array_slice($t['services'], 1) as $s): ?>
                    <a href="<?= e(url('services', $s['slug'])) ?>"><?= e($s['t']) ?></a>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>
    <section class="faq">
        <div class="wrap faq-inner">
            <div>
                <p class="label reveal"><?= e($t['faq_label']) ?></p>
                <h2 class="h2 reveal"><?= $t['faq_title'] ?></h2>
            </div>
            <div class="faq-list">
                <?php foreach ($t['faq'] as $i => $f): ?>
                <details class="faq-item reveal"<?= $i === 0 ? ' open' : '' ?>>
                    <summary><?= e($f['q']) ?><span class="faq-icon" aria-hidden="true"></span></summary>
                    <p><?= e($f['a']) ?></p>
                </details>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php require __DIR__ . '/partials/cta.php'; ?>
</main>
<script type="application/ld+json"><?= json_encode($faqSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) ?></script>
<?php require __DIR__ . '/partials/footer.php'; ?>
