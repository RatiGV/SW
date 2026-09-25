<?php
require __DIR__ . '/config.php';
$clients = ['Coca-Cola', 'Mercedes-Benz', 'EU', 'UNDP', 'Nestlé', 'Toyota', 'Schwarzkopf', 'Yamaha', 'Hyundai', 'Kawasaki', 'Aversi', 'Credo', 'Mazda', 'Julius Meinl', 'Adjarabet'];
$years = (int)date('Y') - $site['founded'];
require __DIR__ . '/partials/header.php';
?>
<main>
    <section class="hero">
        <div class="hero-orb" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="wrap">
            <p class="eyebrow reveal"><span class="dot"></span><?= e($t['hero_eyebrow']) ?></p>
            <h1 class="hero-title">
                <span class="line"><span class="split"><?= e($t['hero_l1']) ?></span></span>
                <span class="line"><span class="split outline"><?= e($t['hero_l2']) ?></span> <span class="hero-star" aria-hidden="true">✦</span></span>
                <span class="line"><span class="split"><?= e($t['hero_l3']) ?></span></span>
            </h1>
            <div class="hero-bottom">
                <div class="hero-copy reveal">
                    <p class="rotator"><?= e($t['hero_rotate_pre']) ?> <span class="rotator-words" data-words="<?= e(json_encode($t['hero_rotate'], JSON_UNESCAPED_UNICODE)) ?>"><b><?= e($t['hero_rotate'][0]) ?></b></span></p>
                    <p class="lead"><?= e($t['hero_sub']) ?></p>
                    <div class="hero-actions">
                        <a class="btn btn-accent" href="#contact" data-magnetic><?= e($t['cta']) ?> <span class="arr">→</span></a>
                        <a class="btn btn-ghost" href="#work" data-magnetic><?= e($t['hero_btn2']) ?></a>
                    </div>
                </div>
                <a class="badge reveal" href="#about" aria-label="<?= e($t['scroll']) ?>">
                    <svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs><text><textPath href="#circle"><?= e($t['badge'] . $t['badge']) ?></textPath></text></svg>
                    <span class="badge-center">↓</span>
                </a>
            </div>
        </div>
    </section>
    <section class="clients" aria-label="<?= e($t['clients_label']) ?>">
        <p class="clients-label"><?= e($t['clients_label']) ?></p>
        <div class="marquee">
            <div class="marquee-track">
                <?php for ($i = 0; $i < 2; $i++): ?>
                <?php foreach ($clients as $c): ?>
                <span class="marquee-item"><?= e($c) ?></span><span class="marquee-sep" aria-hidden="true">✦</span>
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
                <div class="stat reveal" style="--d:<?= $i * 90 ?>ms">
                    <span class="stat-num"><span data-count="<?= (int)$n ?>">0</span><?= e($s['s']) ?></span>
                    <span class="stat-label"><?= e($s['l']) ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <section class="services" id="services">
        <div class="wrap">
            <div class="section-head">
                <p class="label reveal">(02) <?= e($t['services_label']) ?></p>
                <h2 class="h2 reveal"><?= $t['services_title'] ?></h2>
            </div>
            <ul class="service-list">
                <?php foreach ($t['services'] as $i => $s): ?>
                <li class="service reveal">
                    <span class="service-num"><?= sprintf('%02d', $i + 1) ?></span>
                    <h3 class="service-title"><?= e($s['t']) ?></h3>
                    <div class="service-body">
                        <p><?= e($s['d']) ?></p>
                        <div class="tags"><?php foreach ($s['tags'] as $tag): ?><span><?= e($tag) ?></span><?php endforeach; ?></div>
                    </div>
                    <span class="service-arrow" aria-hidden="true">↗</span>
                </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </section>
    <section class="work" id="work">
        <div class="wrap">
            <div class="section-head row">
                <div>
                    <p class="label reveal">(03) <?= e($t['work_label']) ?></p>
                    <h2 class="h2 reveal"><?= $t['work_title'] ?></h2>
                </div>
                <a class="btn btn-ghost reveal" href="#" data-magnetic><?= e($t['work_all']) ?> <span class="arr">→</span></a>
            </div>
            <div class="work-grid">
                <?php foreach ($t['work'] as $i => $w): ?>
                <a class="work-card reveal v<?= $i + 1 ?>" href="#" data-cursor="<?= e($t['work_view']) ?>">
                    <div class="work-media">
                        <div class="work-art" aria-hidden="true"><span></span><span></span></div>
                        <span class="work-initial" aria-hidden="true"><?= e(mb_substr($w['t'], 0, 1)) ?></span>
                    </div>
                    <div class="work-meta">
                        <h3><?= e($w['t']) ?></h3>
                        <span><?= e($w['c']) ?></span>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <section class="process" id="process">
        <div class="wrap">
            <div class="section-head">
                <p class="label reveal">(04) <?= e($t['process_label']) ?></p>
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
    <section class="family">
        <div class="wrap">
            <p class="label reveal">(05) <?= e($t['family_label']) ?></p>
            <div class="family-grid">
                <?php foreach ($t['family'] as $f): ?>
                <a class="family-card reveal" href="<?= e($f['u']) ?>" target="_blank" rel="noopener" data-magnetic>
                    <h3><?= e($f['t']) ?> <span aria-hidden="true">↗</span></h3>
                    <p><?= e($f['d']) ?></p>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <section class="contact" id="contact">
        <div class="wrap">
            <p class="label reveal">(06) <?= e($t['contact_label']) ?></p>
            <h2 class="contact-title reveal"><?= $t['contact_title'] ?></h2>
            <p class="lead reveal"><?= e($t['contact_sub']) ?></p>
            <a class="contact-mail reveal" href="mailto:<?= e($site['email']) ?>" data-magnetic><?= e($site['email']) ?> <span aria-hidden="true">↗</span></a>
            <div class="contact-row reveal">
                <a class="btn btn-accent" href="tel:<?= e(str_replace(' ', '', $site['phone'])) ?>" data-magnetic><?= e($site['phone']) ?></a>
                <a class="btn btn-ghost" href="<?= e($site['social']['Facebook']) ?>" target="_blank" rel="noopener" data-magnetic>Messenger</a>
            </div>
        </div>
    </section>
</main>
<?php require __DIR__ . '/partials/footer.php'; ?>
