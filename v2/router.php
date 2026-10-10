<?php
// Local dev routing for /v2 (included from the root router.php, mirrors v2/.htaccess)
$v2Pages = ['' => 'index.php', 'services' => 'services.php', 'portfolio' => 'portfolio.php', 'pricing' => 'pricing.php', 'contact' => 'contact.php'];
$v2Slug = trim(substr($path, 3), '/');
if (isset($v2Pages[$v2Slug])) {
    require __DIR__ . '/' . $v2Pages[$v2Slug];
    return true;
}
http_response_code(404);
require __DIR__ . '/404.php';
return true;
