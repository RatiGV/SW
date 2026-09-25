<?php
require_once __DIR__ . '/config.php';
$page = 'contact';
$metaTitle = $t['ct_meta_title'];
$metaDesc = $t['ct_meta_desc'];
$services = array_column($t['services'], 't', 'slug');
$packages = array_column($t['packages'], 't', 'slug');
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}
$old = [
    'name' => '',
    'email' => '',
    'phone' => '',
    'company' => '',
    'service' => $_GET['service'] ?? (isset($_GET['package']) ? 'web-design' : ''),
    'package' => $_GET['package'] ?? '',
    'budget' => '',
    'message' => '',
];
$errors = [];
$status = '';
if (!empty($_SESSION['contact_sent'])) {
    unset($_SESSION['contact_sent']);
    $status = 'success';
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($old as $k => $v) {
        $old[$k] = trim((string)($_POST[$k] ?? ''));
    }
    $validToken = hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''));
    $isBot = ($_POST['website'] ?? '') !== '' || (time() - (int)($_POST['ts'] ?? 0)) < 3;
    $tooFast = !empty($_SESSION['contact_last']) && time() - $_SESSION['contact_last'] < 60;
    if ($old['name'] === '' || mb_strlen($old['name']) > 100) {
        $errors['name'] = $t['ct_err_name'];
    }
    $emailOk = $old['email'] !== '' && filter_var($old['email'], FILTER_VALIDATE_EMAIL);
    $phoneOk = preg_match('/^[+0-9 ()-]{6,20}$/', $old['phone']);
    if (!$emailOk && !$phoneOk) {
        $errors['contact'] = $t['ct_err_contact'];
    }
    if ($old['email'] !== '' && !$emailOk) {
        $errors['contact'] = $t['ct_err_contact'];
    }
    if (mb_strlen($old['message']) < 10 || mb_strlen($old['message']) > 5000) {
        $errors['message'] = $t['ct_err_message'];
    }
    if (!isset($services[$old['service']])) {
        $old['service'] = '';
    }
    if (!isset($packages[$old['package']])) {
        $old['package'] = '';
    }
    if (!in_array($old['budget'], $t['ct_budgets'], true)) {
        $old['budget'] = '';
    }
    if (!$validToken || $tooFast) {
        $status = 'fail';
    } elseif ($errors) {
        $status = 'error';
    } elseif ($isBot) {
        $_SESSION['contact_sent'] = true;
        header('Location: ' . url('contact', 'form'), true, 303);
        exit;
    } else {
        $clean = fn($s) => str_replace(["\r", "\n"], ' ', $s);
        $body = "Name: {$old['name']}\nEmail: {$old['email']}\nPhone: {$old['phone']}\nCompany: {$old['company']}\n";
        $body .= 'Service: ' . ($services[$old['service']] ?? '-') . "\n";
        $body .= 'Package: ' . ($packages[$old['package']] ?? '-') . "\n";
        $body .= 'Budget: ' . ($old['budget'] ?: '-') . "\nLanguage: {$lang}\n\n{$old['message']}\n";
        $headers = [
            'From: ' . $site['name'] . ' <' . $site['mail_from'] . '>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];
        if ($emailOk) {
            $headers[] = 'Reply-To: ' . $clean($old['email']);
        }
        $subject = '=?UTF-8?B?' . base64_encode('New project brief: ' . $clean($old['name'])) . '?=';
        if (@mail($site['mail_to'], $subject, $body, implode("\r\n", $headers))) {
            $_SESSION['contact_last'] = time();
            $_SESSION['contact_sent'] = true;
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
            header('Location: ' . url('contact', 'form'), true, 303);
            exit;
        }
        $status = 'fail';
    }
}
$heroLabel = $t['ct_label'];
$heroTitle = $t['ct_title'];
$heroSub = $t['ct_sub'];
$mapQ = urlencode($site['map_query']);
require __DIR__ . '/partials/header.php';
?>
<main>
    <?php require __DIR__ . '/partials/page-hero.php'; ?>
    <section class="ct">
        <div class="wrap ct-grid">
            <form class="ct-form reveal" id="form" method="post" action="<?= e(url('contact', 'form')) ?>" novalidate>
                <h2 class="ct-form-title"><?= e($t['ct_form_title']) ?></h2>
                <?php if ($status === 'success'): ?>
                <p class="alert alert-success" role="status"><?= e($t['ct_success']) ?></p>
                <?php elseif ($status === 'error'): ?>
                <p class="alert alert-error" role="alert"><?= e($t['ct_error']) ?></p>
                <?php elseif ($status === 'fail'): ?>
                <p class="alert alert-error" role="alert"><?= e($t['ct_fail']) ?></p>
                <?php endif; ?>
                <input type="hidden" name="csrf" value="<?= e($_SESSION['csrf']) ?>">
                <input type="hidden" name="ts" value="<?= time() ?>">
                <input type="hidden" name="package" value="<?= e($old['package']) ?>">
                <div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
                <p class="field-label"><?= e($t['ct_interest']) ?></p>
                <div class="chips">
                    <?php foreach ($services as $slug => $label): ?>
                    <label class="chip"><input type="radio" name="service" value="<?= e($slug) ?>"<?= $old['service'] === $slug ? ' checked' : '' ?>><span><?= e($label) ?></span></label>
                    <?php endforeach; ?>
                </div>
                <?php if ($old['package'] !== '' && isset($packages[$old['package']])): ?>
                <p class="ct-package">✦ <?= e($packages[$old['package']]) ?></p>
                <?php endif; ?>
                <div class="field-row">
                    <div class="field<?= isset($errors['name']) ? ' has-error' : '' ?>">
                        <input type="text" id="f-name" name="name" value="<?= e($old['name']) ?>" placeholder=" " required maxlength="100" autocomplete="name">
                        <label for="f-name"><?= e($t['ct_name']) ?> *</label>
                        <?php if (isset($errors['name'])): ?><small class="field-error"><?= e($errors['name']) ?></small><?php endif; ?>
                    </div>
                    <div class="field">
                        <input type="text" id="f-company" name="company" value="<?= e($old['company']) ?>" placeholder=" " maxlength="100" autocomplete="organization">
                        <label for="f-company"><?= e($t['ct_company']) ?></label>
                    </div>
                </div>
                <div class="field-row">
                    <div class="field<?= isset($errors['contact']) ? ' has-error' : '' ?>">
                        <input type="email" id="f-email" name="email" value="<?= e($old['email']) ?>" placeholder=" " maxlength="150" autocomplete="email">
                        <label for="f-email"><?= e($t['ct_email']) ?></label>
                    </div>
                    <div class="field<?= isset($errors['contact']) ? ' has-error' : '' ?>">
                        <input type="tel" id="f-phone" name="phone" value="<?= e($old['phone']) ?>" placeholder=" " maxlength="20" autocomplete="tel">
                        <label for="f-phone"><?= e($t['ct_phone']) ?></label>
                    </div>
                </div>
                <?php if (isset($errors['contact'])): ?><small class="field-error field-error-block"><?= e($errors['contact']) ?></small><?php endif; ?>
                <p class="field-label"><?= e($t['ct_budget']) ?></p>
                <div class="chips">
                    <?php foreach ($t['ct_budgets'] as $b): ?>
                    <label class="chip"><input type="radio" name="budget" value="<?= e($b) ?>"<?= $old['budget'] === $b ? ' checked' : '' ?>><span><?= e($b) ?></span></label>
                    <?php endforeach; ?>
                </div>
                <div class="field<?= isset($errors['message']) ? ' has-error' : '' ?>">
                    <textarea id="f-message" name="message" rows="5" placeholder=" " required maxlength="5000"><?= e($old['message']) ?></textarea>
                    <label for="f-message"><?= e($t['ct_message']) ?> *</label>
                    <?php if (isset($errors['message'])): ?><small class="field-error"><?= e($errors['message']) ?></small><?php endif; ?>
                </div>
                <div class="ct-submit">
                    <button type="submit" class="btn btn-accent" data-magnetic><?= e($t['ct_send']) ?> <span class="arr">→</span></button>
                    <small class="muted"><?= e($t['ct_privacy']) ?></small>
                </div>
            </form>
            <aside class="ct-info">
                <p class="label reveal"><?= e($t['ct_info_title']) ?></p>
                <a class="ct-card reveal" href="<?= e(tel($site['phone'])) ?>">
                    <span class="ct-card-label"><?= e($t['ct_call']) ?></span>
                    <strong><?= e($site['phone']) ?></strong>
                    <span class="muted"><?= e($site['phone2']) ?></span>
                </a>
                <a class="ct-card reveal" href="mailto:<?= e($site['email']) ?>">
                    <span class="ct-card-label"><?= e($t['ct_write']) ?></span>
                    <strong><?= e($site['email']) ?></strong>
                </a>
                <div class="ct-card-row reveal">
                    <a class="ct-card ct-card-sm" href="https://wa.me/<?= e($site['whatsapp']) ?>" target="_blank" rel="noopener"><strong>WhatsApp</strong> <span aria-hidden="true">↗</span></a>
                    <a class="ct-card ct-card-sm" href="<?= e($site['social']['Facebook']) ?>" target="_blank" rel="noopener"><strong>Messenger</strong> <span aria-hidden="true">↗</span></a>
                </div>
                <div class="ct-card reveal">
                    <span class="ct-card-label"><?= e($t['ct_visit']) ?></span>
                    <strong><?= e($t['footer_address']) ?></strong>
                    <span class="muted"><?= e($t['ct_hours']) ?>: <?= e($t['footer_hours']) ?></span>
                    <a class="ct-dir" href="https://www.google.com/maps/dir/?api=1&amp;destination=<?= e($mapQ) ?>" target="_blank" rel="noopener"><?= e($t['ct_directions']) ?> ↗</a>
                </div>
            </aside>
        </div>
    </section>
    <section class="ct-map reveal">
        <iframe title="<?= e($t['footer_address']) ?>" src="https://maps.google.com/maps?q=<?= e($mapQ) ?>&amp;z=16&amp;output=embed&amp;hl=<?= e($lang) ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </section>
</main>
<?php require __DIR__ . '/partials/footer.php'; ?>
