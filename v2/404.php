<?php
require_once __DIR__ . '/config.php';
http_response_code(404);
$page = '';
$metaTitle = $t['nf_meta_title'];
$metaDesc = $t['nf_sub'];
require __DIR__ . '/partials/header.php';
?>
<main>
    <section class="nf">
        <div class="scene-abs" data-scene="shards" data-hover aria-hidden="true"><div class="scene-fallback"></div></div>
        <div class="wrap">
            <p class="nf-code" aria-hidden="true">4<span>0</span>4</p>
            <h1 class="h2 reveal"><?= $t['nf_title'] ?></h1>
            <p class="lead reveal"><?= e($t['nf_sub']) ?></p>
            <a class="btn btn-accent reveal" href="<?= e(url()) ?>" data-magnetic><?= e($t['nf_home']) ?> <span class="arr">→</span></a>
        </div>
    </section>
</main>
<?php require __DIR__ . '/partials/footer.php'; ?>
