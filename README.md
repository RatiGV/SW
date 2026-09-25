# Smart Agency website

Plain PHP (8.x), no build step.

- Pages: `index.php`, `services.php`, `portfolio.php`, `pricing.php`, `contact.php`, `404.php`
- Text (Georgian / English): `lang/ka.php`, `lang/en.php` - Georgian is default, `?lang=en` for English
- Contact details, emails, socials: `config.php`
- Portfolio items: `data/portfolio.php`, images in `assets/img/portfolio/`
- Clean URLs and 301 redirects from old smartweb.ge URLs: `.htaccess` (Apache)
- Contact form sends with PHP `mail()` to `mail_to` in `config.php`

Local preview: `php -S localhost:8000 router.php`
