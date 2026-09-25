<footer class="footer">
    <div class="wrap footer-grid">
        <div>
            <a class="logo" href="#top"><span class="logo-mark">S</span><span class="logo-text">smart<b>web</b><i>.</i></span></a>
            <p class="muted"><?= e($t['footer_address']) ?></p>
        </div>
        <div class="footer-col">
            <a href="tel:<?= e(str_replace(' ', '', $site['phone'])) ?>"><?= e($site['phone']) ?></a>
            <a href="tel:<?= e(str_replace(' ', '', $site['phone2'])) ?>"><?= e($site['phone2']) ?></a>
            <a href="mailto:<?= e($site['email']) ?>"><?= e($site['email']) ?></a>
        </div>
        <div class="footer-col">
            <?php foreach ($site['social'] as $name => $url): ?>
            <a href="<?= e($url) ?>" target="_blank" rel="noopener"><?= e($name) ?> <span aria-hidden="true">↗</span></a>
            <?php endforeach; ?>
        </div>
    </div>
    <div class="wrap footer-bottom">
        <span>© <?= date('Y') ?> Smart Web. <?= e($t['footer_rights']) ?></span>
        <a href="#top"><?= e($t['footer_top']) ?> ↑</a>
    </div>
    <div class="footer-giant" aria-hidden="true">smartweb</div>
</footer>
<script src="<?= e(asset('assets/js/main.js')) ?>" defer></script>
</body>
</html>
