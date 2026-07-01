/* =========================================================================
   Pastor Naklee Quamele Ministry — Shared behavior for every page.
   ========================================================================= */
(function () {
  'use strict';

  // ---------- Custom cursor (pointer devices only) ----------
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (dot && ring && window.matchMedia('(hover: hover)').matches) {
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function anim() {
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(anim);
    })();
  }

  // ---------- Mobile drawer ----------
  var btn = document.getElementById('hamburgerBtn');
  var drawer = document.getElementById('navDrawer');
  var overlay = document.getElementById('navOverlay');
  function openDrawer() {
    btn.classList.add('active');
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (btn) btn.classList.remove('active');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (btn && drawer) {
    btn.addEventListener('click', function () {
      drawer.classList.contains('active') ? closeDrawer() : openDrawer();
    });
  }
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-link').forEach(function (l) {
    l.addEventListener('click', closeDrawer);
  });

  // ---------- Nav background on scroll ----------
  var nav = document.getElementById('mainNav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---------- Smooth in-page anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      }
    });
  });

  // ---------- Sermon filters ----------
  var filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    var cards = document.querySelectorAll('.sermon-card');
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        filterBtns.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var f = b.dataset.filter;
        cards.forEach(function (c) {
          var show = f === 'all' || c.dataset.series === f;
          c.style.display = show ? 'flex' : 'none';
        });
      });
    });
  }

  // ---------- Contact form (demo handler) ----------
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.getElementById('formSuccess');
      var submit = form.querySelector('.form-submit');
      if (success) success.classList.add('show');
      if (submit) { submit.textContent = 'Sent'; submit.disabled = true; }
      setTimeout(function () {
        if (submit) { submit.textContent = 'Send Message'; submit.disabled = false; }
        if (success) success.classList.remove('show');
        form.reset();
      }, 3500);
    });
  }
})();
