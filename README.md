# Smart Agency website

Plain PHP (8.x), no build step.

- Pages: `index.php`, `services.php`, `portfolio.php`, `pricing.php`, `contact.php`, `404.php`
- Text (Georgian / English): `lang/ka.php`, `lang/en.php` - Georgian is default, `?lang=en` for English
- Contact details, emails, socials: `config.php`
- Portfolio items: `data/portfolio.php`, images in `assets/img/portfolio/`
- Clean URLs and 301 redirects from old smartweb.ge URLs: `.htaccess` (Apache)
- Contact form sends with PHP `mail()` to `mail_to` in `config.php`

Local preview: `php -S localhost:8000 router.php`

## Version 2 (3D edition) - `/v2`

Same pages and content as the main site, rebuilt with three.js 3D scenes. Lives in `v2/` and runs at `/v2/`.

- `v2/config.php` - `base` is the URL folder (`/v2/`); portfolio images are shared from the root `assets/img/portfolio/`
- `v2/assets/js/scenes.js` - all 3D scenes; one WebGL canvas renders every `[data-scene]` element
- `v2/assets/js/vendor/three.min.js` - three.js r186 (MIT), bundled locally, no CDN
- Falls back to soft gradients when WebGL is unavailable; holds still when the visitor prefers reduced motion
