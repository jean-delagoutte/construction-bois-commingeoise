/*
  CBC — Construction Bois Commingeoise
  JS vanilla, sans dépendance (remplace jQuery/MooTools/Bootstrap2/Skitter/Fancybox de l'ancien site).
  Chaque comportement se dégrade proprement si son markup n'est pas présent sur la page.
*/
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- En-tête transparent -> opaque au défilement ---------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var THRESHOLD = 60;
    function update() {
      header.classList.toggle('has-bg', window.scrollY > THRESHOLD);
    }
    update(); // au cas où la page se charge déjà défilée (ancre, retour arrière…)
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Navigation mobile ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Sous-menus au clic en mobile (le hover ne fonctionne pas au toucher). Le lien
    // "Prestations"/"Société" reste un vrai lien vers sa page ; c'est le bouton dédié
    // (.main-nav__subtoggle, visible seulement en mobile) qui déplie/replie le sous-menu,
    // pour que les deux usages (aller sur la page / voir le sous-menu) restent accessibles.
    nav.querySelectorAll('.main-nav__subtoggle').forEach(function (btn) {
      var item = btn.closest('.main-nav__item');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  /* ---------- Slider hero ---------- */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero__slide'));
    if (slides.length < 2) return;
    var dotsWrap = hero.querySelector('.hero__dots');
    var index = 0;
    var timer;

    var dots = slides.map(function (_, i) {
      if (!dotsWrap) return null;
      var dot = document.createElement('button');
      dot.className = 'hero__dot' + (i === 0 ? ' is-active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Aller à l’image ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function show(i) {
      slides[index].classList.remove('is-active');
      if (dots[index]) dots[index].classList.remove('is-active');
      index = (i + slides.length) % slides.length;
      slides[index].classList.add('is-active');
      if (dots[index]) dots[index].classList.add('is-active');
    }
    function goTo(i) { show(i); }
    function next() { show(index + 1); }
    function prev() { show(index - 1); }
    function restart() {
      if (prefersReducedMotion) return;
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    hero.querySelector('.hero__arrow--next') && hero.querySelector('.hero__arrow--next').addEventListener('click', function () { next(); restart(); });
    hero.querySelector('.hero__arrow--prev') && hero.querySelector('.hero__arrow--prev').addEventListener('click', function () { prev(); restart(); });

    slides[0].classList.add('is-active');
    restart();
  }

  /* ---------- Onglets services ---------- */
  function initTabs() {
    var wrap = document.querySelector('.services-tabs');
    if (!wrap) return;
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('.services-tabs__tab'));
    var panels = Array.prototype.slice.call(wrap.querySelectorAll('.services-tabs__panel'));

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { activate(tab); });
      tab.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); activate(tabs[(i + 1) % tabs.length]); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); activate(tabs[(i - 1 + tabs.length) % tabs.length]); }
      });
    });

    function activate(tab) {
      var target = tab.getAttribute('aria-controls');
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      panels.forEach(function (p) { p.classList.toggle('is-active', p.id === target); });
    }
  }

  /* ---------- Galerie + lightbox ---------- */
  function initGallery() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.gallery-open'));
    if (!buttons.length) return;
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;
    var img = lightbox.querySelector('img');
    var caption = lightbox.querySelector('.lightbox__caption');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var prevBtn = lightbox.querySelector('.lightbox__arrow--prev');
    var nextBtn = lightbox.querySelector('.lightbox__arrow--next');
    var current = 0;
    var lastFocused = null;

    function open(i) {
      current = i;
      lastFocused = document.activeElement;
      var full = buttons[i].getAttribute('data-full') || buttons[i].querySelector('img').src;
      img.src = full;
      img.alt = buttons[i].querySelector('img').alt || '';
      caption.textContent = buttons[i].getAttribute('data-caption') || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
      document.addEventListener('keydown', onKeydown);
    }
    function close() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }
    function step(delta) { open((current + delta + buttons.length) % buttons.length); }
    function onKeydown(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    }

    buttons.forEach(function (btn, i) { btn.addEventListener('click', function () { open(i); }); });
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });
  }

  /* ---------- Filtres galerie réalisations ---------- */
  function initFilters() {
    var bar = document.querySelector('.filter-bar');
    var grid = document.querySelector('.gallery-grid');
    if (!bar || !grid) return;
    var items = Array.prototype.slice.call(grid.children);

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      bar.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      var filter = btn.getAttribute('data-filter');
      items.forEach(function (item) {
        var match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.hidden = !match;
      });
    });
  }

  /* ---------- Formulaire de contact (mailto amélioré, sans backend) ---------- */
  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;
    var status = form.querySelector('.form-status');
    var dest = 'cbc31800@gmail.com';

    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) return; // laisse le navigateur afficher les messages de champs requis
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      var subject = 'Demande de contact site web — ' + name;
      var body =
        'Nom : ' + name + '\n' +
        'Téléphone : ' + phone + '\n' +
        'E-mail : ' + email + '\n\n' +
        message;

      var mailtoUrl = 'mailto:' + dest +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      if (status) {
        status.textContent = 'Votre messagerie va s’ouvrir avec le message pré-rempli : il ne vous reste qu’à cliquer sur Envoyer.';
        status.setAttribute('data-state', 'success');
      }
      window.location.href = mailtoUrl;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initNav();
    initHero();
    initTabs();
    initGallery();
    initFilters();
    initContactForm();
  });
})();
