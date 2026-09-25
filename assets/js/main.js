(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Hero intro
  requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
  // Nav: scrolled state, hide on scroll down
  var nav = document.querySelector('.nav');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    var hide = y > lastY && y > 400 && !nav.classList.contains('is-open');
    nav.classList.toggle('is-hidden', hide);
    document.body.classList.toggle('nav-hidden', hide);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // Mobile menu
  var burger = document.getElementById('burger');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  // Split about text into words for scroll-scrubbed reveal
  document.querySelectorAll('.reveal-words').forEach(function (el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement('span');
        s.className = 'w';
        s.textContent = part;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    var words = el.querySelectorAll('.w');
    function scrub() {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      var n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    }
    if (reduce) { words.forEach(function (w) { w.classList.add('on'); }); return; }
    window.addEventListener('scroll', scrub, { passive: true });
    scrub();
  });
  // Reveal on view + counters
  function count(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduce) { el.textContent = target; return; }
    var start = null;
    var dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(count);
  }
  // Rotating words
  var rot = document.querySelector('.rotator-words');
  if (rot && !reduce) {
    var list = JSON.parse(rot.getAttribute('data-words'));
    var idx = 0;
    setInterval(function () {
      var b = rot.querySelector('b');
      b.classList.add('out');
      setTimeout(function () {
        idx = (idx + 1) % list.length;
        b.textContent = list[idx];
        b.classList.remove('out');
        b.classList.add('in');
        void b.offsetWidth;
        b.classList.remove('in');
      }, 450);
    }, 2400);
  }
  // Portfolio filters (supports #websites, #visualidentity, #branding, #facebook)
  var grid = document.getElementById('pfGrid');
  if (grid) {
    var filters = document.querySelectorAll('.pf-filter');
    var items = Array.prototype.slice.call(grid.querySelectorAll('.pf-item'));
    var applyFilter = function (key, push) {
      var found = false;
      filters.forEach(function (f) {
        var on = f.getAttribute('data-filter') === key;
        if (on) found = true;
        f.classList.toggle('is-active', on);
        f.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (!found) return applyFilter('all', push);
      items.forEach(function (it) { it.hidden = key !== 'all' && it.getAttribute('data-cat') !== key; });
      if (push) history.replaceState(null, '', key === 'all' ? location.pathname + location.search : '#' + key);
    };
    filters.forEach(function (f) {
      f.addEventListener('click', function () { applyFilter(f.getAttribute('data-filter'), true); });
    });
    if (location.hash) applyFilter(location.hash.slice(1), false);
    // Lightbox
    var lb = document.getElementById('lightbox');
    var lbImg = lb.querySelector('img');
    var lbTitle = lb.querySelector('figcaption strong');
    var lbType = lb.querySelector('figcaption span');
    var current = 0;
    var lastFocus = null;
    var visible = function () { return items.filter(function (it) { return !it.hidden; }); };
    var show = function (it) {
      current = visible().indexOf(it);
      var img = it.querySelector('img');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.alt;
      lbTitle.textContent = it.querySelector('.pf-title').textContent;
      lbType.textContent = it.querySelector('.pf-type').textContent;
    };
    var open = function (it) {
      lastFocus = it;
      show(it);
      lb.hidden = false;
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    };
    var close = function () {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { lb.hidden = true; }, 300);
      if (lastFocus) lastFocus.focus();
    };
    var step = function (d) {
      var v = visible();
      show(v[(current + d + v.length) % v.length]);
    };
    items.forEach(function (it) { it.addEventListener('click', function () { open(it); }); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }
  // Services sub-nav active state
  var srvLinks = document.querySelectorAll('.srv-index a');
  if (srvLinks.length && 'IntersectionObserver' in window) {
    var srvIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        srvLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('is-active', on);
          if (on && a.scrollIntoView) a.parentNode.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.srv').forEach(function (s) { srvIo.observe(s); });
  }
  // Custom cursor and magnetic elements
  if (!finePointer || reduce) return;
  var cursor = document.querySelector('.cursor');
  var label = cursor.querySelector('span');
  var mx = -100, my = -100, cx = -100, cy = -100;
  window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function loop() {
    cx += (mx - cx) * 0.2;
    cy += (my - cy) * 0.2;
    cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .service').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      var text = el.getAttribute('data-cursor');
      if (text) { label.textContent = text; cursor.classList.add('is-label'); } else { cursor.classList.add('is-hover'); }
    });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover', 'is-label'); });
  });
  document.querySelectorAll('[data-magnetic]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * 0.25;
      var y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });
  // Subtle parallax for hero orb
  var orb = document.querySelector('.hero-orb');
  if (orb) window.addEventListener('mousemove', function (e) {
    var x = (e.clientX / window.innerWidth - 0.5) * 40;
    var y = (e.clientY / window.innerHeight - 0.5) * 40;
    orb.style.translate = x + 'px ' + y + 'px';
  }, { passive: true });
})();
