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

  // ---------- Video lightbox ----------
  var modal, modalTitle, modalFrame, modalLink;
  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML =
      '<button class="video-modal-close" aria-label="Close video">&times;</button>' +
      '<div class="video-modal-box">' +
      '  <div class="video-modal-title"></div>' +
      '  <div class="video-modal-frame"></div>' +
      '  <a class="video-modal-link" target="_blank" rel="noopener">Watch on YouTube &rarr;</a>' +
      '</div>';
    document.body.appendChild(modal);
    modalTitle = modal.querySelector('.video-modal-title');
    modalFrame = modal.querySelector('.video-modal-frame');
    modalLink = modal.querySelector('.video-modal-link');
    modal.querySelector('.video-modal-close').addEventListener('click', closeVideo);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeVideo(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideo(); });
  }
  function openVideo(id, title) {
    if (!modal) buildModal();
    modalTitle.textContent = title || 'Watch';
    modalFrame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
      '?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    modalLink.href = 'https://www.youtube.com/watch?v=' + id;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeVideo() {
    if (!modal) return;
    modal.classList.remove('active');
    modalFrame.innerHTML = '';
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-video]').forEach(function (card) {
    var id = card.dataset.video;
    if (!id) return;
    var title = card.dataset.videoTitle ||
      (card.querySelector('.sermon-title, .video-title') || {}).textContent || 'Watch';
    // Show the real YouTube thumbnail inside the card so the video is visible
    var thumb = card.querySelector('.sermon-thumb, .video-thumb');
    if (thumb && !thumb.querySelector('.yt-thumb')) {
      var img = document.createElement('img');
      img.className = 'yt-thumb';
      img.alt = title;
      img.loading = 'lazy';
      img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
      // Upgrade to HD frame when available (falls back silently if not)
      var hd = new Image();
      hd.onload = function () { if (hd.naturalWidth > 120) img.src = hd.src; };
      hd.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
      thumb.insertBefore(img, thumb.firstChild);
    }
    card.querySelectorAll('.sermon-play, .play-badge, .sermon-link, .video-link, .video-thumb, .sermon-thumb')
      .forEach(function (t) {
        t.addEventListener('click', function (e) { e.preventDefault(); openVideo(id, title); });
      });
  });

  // ---------- Daily verse ----------
  var verseEl = document.getElementById('dailyVerse');
  var verseRefEl = document.getElementById('dailyVerseRef');
  if (verseEl && verseRefEl) {
    var verses = [
      ['"Go into all the world and preach the gospel to every creature."', 'Mark 16:15'],
      ['"I can do all things through Christ who strengthens me."', 'Philippians 4:13'],
      ['"Trust in the LORD with all your heart, and lean not on your own understanding."', 'Proverbs 3:5'],
      ['"For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you."', 'Jeremiah 29:11'],
      ['"Thy word is a lamp unto my feet, and a light unto my path."', 'Psalm 119:105'],
      ['"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles."', 'Isaiah 40:31'],
      ['"Be strong and of a good courage; be not afraid... for the LORD thy God is with thee."', 'Joshua 1:9'],
      ['"My grace is sufficient for thee: for my strength is made perfect in weakness."', '2 Corinthians 12:9'],
      ['"The LORD is my shepherd; I shall not want."', 'Psalm 23:1'],
      ['"Train up a child in the way he should go: and when he is old, he will not depart from it."', 'Proverbs 22:6'],
      ['"Let your light so shine before men, that they may see your good works, and glorify your Father."', 'Matthew 5:16'],
      ['"And we know that all things work together for good to them that love God."', 'Romans 8:28'],
      ['"Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost."', 'Matthew 28:19'],
      ['"Draw nigh to God, and he will draw nigh to you."', 'James 4:8']
    ];
    var dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    var v = verses[dayOfYear % verses.length];
    verseEl.textContent = v[0];
    verseRefEl.textContent = v[1];
  }

  // ---------- Back to top ----------
  var topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML = '&uarr;';
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', function () {
    topBtn.classList.toggle('show', window.scrollY > 600);
  });

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
