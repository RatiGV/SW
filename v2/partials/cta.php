<section class="contact cta-3d" id="contact">
    <div class="scene-abs" data-scene="portal" data-hover aria-hidden="true"><div class="scene-fallback"></div></div>
    <div class="wrap">
        <p class="label reveal"><?= e($t['contact_label']) ?></p>
        <h2 class="contact-title reveal"><?= $t['contact_title'] ?></h2>
        <p class="lead reveal"><?= e($t['contact_sub']) ?></p>
        <a class="contact-mail reveal" href="mailto:<?= e($site['email']) ?>" data-magnetic><?= e($site['email']) ?> <span aria-hidden="true">↗</span></a>
        <div class="contact-row reveal">
            <a class="btn btn-accent" href="<?= e(url('contact')) ?>" data-magnetic><?= e($t['contact_form_btn']) ?> <span class="arr">→</span></a>
            <a class="btn btn-ghost" href="<?= e(tel($site['phone'])) ?>" data-magnetic><?= e($site['phone']) ?></a>
        </div>
    </div>
</section>
