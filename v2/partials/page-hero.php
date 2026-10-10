<section class="page-hero<?= !empty($heroWide) ? ' page-hero-wide' : '' ?>">
    <div class="wrap page-hero-grid">
        <div class="page-hero-text">
            <p class="eyebrow reveal"><span class="dot"></span><?= e($heroLabel) ?></p>
            <h1 class="page-title reveal"><?= $heroTitle ?></h1>
            <?php if (!empty($heroSub)): ?>
            <p class="lead page-lead reveal"><?= e($heroSub) ?></p>
            <?php endif; ?>
        </div>
        <?php if (!empty($heroScene)): ?>
        <div class="page-hero-3d" data-scene="<?= e($heroScene) ?>"<?= $heroSceneAttrs ?? '' ?> data-hover aria-hidden="true">
            <div class="scene-fallback"></div>
            <?php if (!empty($heroCaption)): ?>
            <span class="scene-caption"><span class="dot"></span><?= e($heroCaption) ?></span>
            <?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
</section>
