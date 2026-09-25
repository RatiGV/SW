<footer class="footer">
    <div class="wrap footer-grid">
        <div class="footer-brand">
            <a class="logo" href="<?= e(url()) ?>" aria-label="<?= e($site['name']) ?>"><?= $logo ?></a>
            <p class="muted"><?= e($t['footer_address']) ?><br><?= e($t['footer_hours']) ?></p>
        </div>
        <div class="footer-col">
            <p class="footer-head"><?= e($t['footer_pages']) ?></p>
            <?php foreach ($t['nav'] as $id => $label): ?>
            <a href="<?= e(url($id)) ?>"><?= e($label) ?></a>
            <?php endforeach; ?>
        </div>
        <div class="footer-col">
            <p class="footer-head"><?= e($t['footer_contact']) ?></p>
            <a href="<?= e(tel($site['phone'])) ?>"><?= e($site['phone']) ?></a>
            <a href="<?= e(tel($site['phone2'])) ?>"><?= e($site['phone2']) ?></a>
            <a href="mailto:<?= e($site['email']) ?>"><?= e($site['email']) ?></a>
            <a href="https://wa.me/<?= e($site['whatsapp']) ?>" target="_blank" rel="noopener">WhatsApp <span aria-hidden="true">↗</span></a>
        </div>
        <div class="footer-col">
            <p class="footer-head"><?= e($t['footer_social']) ?></p>
            <?php foreach ($site['social'] as $name => $link): ?>
            <a href="<?= e($link) ?>" target="_blank" rel="noopener"><?= e($name) ?> <span aria-hidden="true">↗</span></a>
            <?php endforeach; ?>
        </div>
    </div>
    <div class="wrap footer-bottom">
        <span>© <?= date('Y') ?> <?= e($site['name']) ?>. <?= e($t['footer_rights']) ?></span>
        <a href="#top"><?= e($t['footer_top']) ?> ↑</a>
    </div>
    <div class="footer-giant" aria-hidden="true">smartagency</div>
</footer>
<script src="<?= e(asset('assets/js/main.js')) ?>" defer></script>
</body>
</html>
