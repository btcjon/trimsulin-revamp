/* ============================================================
   Trimsulin v2 — main.js
   Handles: sticky nav, scroll reveals, FAQ accordion, mobile menu
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. STICKY NAV — IntersectionObserver on hero sentinel
  ---------------------------------------------------------- */
  const nav = document.querySelector('.site-nav');
  const sentinel = document.querySelector('.hero-sentinel');

  if (nav && sentinel) {
    const navObserver = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle('site-nav--scrolled', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    navObserver.observe(sentinel);
  } else if (nav) {
    // Fallback: scroll-based if no sentinel
    window.addEventListener('scroll', () => {
      nav.classList.toggle('site-nav--scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     2. SCROLL REVEAL — IntersectionObserver on .reveal elements
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     3. FAQ ACCORDION
  ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  function closeFaqItem(item) {
    const answer = item.querySelector('.faq-answer');
    const question = item.querySelector('.faq-question');
    if (!answer || !question) return;
    item.classList.remove('faq-item--open');
    question.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = '0';
  }

  function openFaqItem(item) {
    const answer = item.querySelector('.faq-answer');
    const question = item.querySelector('.faq-question');
    const inner = item.querySelector('.faq-answer-inner');
    if (!answer || !question || !inner) return;
    item.classList.add('faq-item--open');
    question.setAttribute('aria-expanded', 'true');
    answer.style.maxHeight = inner.scrollHeight + 'px';
  }

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');
      // Close all
      faqItems.forEach(closeFaqItem);
      // Open clicked if it was closed
      if (!isOpen) openFaqItem(item);
    });
    // Keyboard: Enter / Space
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  /* ----------------------------------------------------------
     4. VIDEO MODAL
  ---------------------------------------------------------- */
  const videoBackdrop = document.getElementById('video-modal-backdrop');
  const videoIframe   = document.getElementById('video-modal-iframe');
  const videoClose    = document.getElementById('video-modal-close');
  const playBtn       = document.getElementById('hero-play-btn');
  const VIMEO_SRC     = 'https://player.vimeo.com/video/961651102?autoplay=1&title=0&byline=0&portrait=0';

  function openVideoModal() {
    if (!videoBackdrop || !videoIframe) return;
    videoIframe.src = VIMEO_SRC;
    videoBackdrop.classList.add('is-open');
    videoBackdrop.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    videoClose && videoClose.focus();
  }

  function closeVideoModal() {
    if (!videoBackdrop || !videoIframe) return;
    videoIframe.src = '';
    videoBackdrop.classList.remove('is-open');
    videoBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    playBtn && playBtn.focus();
  }

  if (playBtn)    playBtn.addEventListener('click', openVideoModal);
  if (videoClose) videoClose.addEventListener('click', closeVideoModal);
  if (videoBackdrop) {
    videoBackdrop.addEventListener('click', (e) => { if (e.target === videoBackdrop) closeVideoModal(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoBackdrop && videoBackdrop.classList.contains('is-open')) closeVideoModal();
  });

  /* ----------------------------------------------------------
     6. INGREDIENTS MODAL
  ---------------------------------------------------------- */
  const ingImages = {
    'control-ingredients': './assets/section4-products/control-ingredients.jpg',
    'thermo-ingredients':  './assets/section4-products/thermo-ingredients.jpg',
    'reneu-ingredients':   './assets/section4-products/reneu-ingredients.jpg',
  };
  const backdrop = document.getElementById('ing-modal-backdrop');
  const modalImg = document.getElementById('ing-modal-img');
  const modalClose = document.getElementById('ing-modal-close');

  function openIngModal(key) {
    if (!backdrop || !modalImg) return;
    modalImg.src = ingImages[key] || '';
    modalImg.alt = key.replace('-', ' ') + ' Supplement Facts';
    backdrop.classList.add('is-open');
    backdrop.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    modalClose && modalClose.focus();
  }

  function closeIngModal() {
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal]').forEach((btn) => {
    btn.addEventListener('click', () => openIngModal(btn.dataset.modal));
  });

  if (modalClose) modalClose.addEventListener('click', closeIngModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeIngModal(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) closeIngModal();
  });

  /* ----------------------------------------------------------
     5. MOBILE NAV TOGGLE
  ---------------------------------------------------------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('site-nav--open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('site-nav--open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.setAttribute('aria-label', 'Open menu');
          document.body.style.overflow = '';
        });
      });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('site-nav--open')) {
        nav.classList.remove('site-nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && nav.classList.contains('site-nav--open')) {
        nav.classList.remove('site-nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, { passive: true });
  }
})();
