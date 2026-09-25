<section class="page-hero">
    <div class="hero-orb hero-orb-sm" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="wrap">
        <p class="eyebrow reveal"><span class="dot"></span><?= e($heroLabel) ?></p>
        <h1 class="page-title reveal"><?= $heroTitle ?></h1>
        <?php if (!empty($heroSub)): ?>
        <p class="lead page-lead reveal"><?= e($heroSub) ?></p>
        <?php endif; ?>
    </div>
</section>
