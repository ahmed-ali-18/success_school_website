/**
 * SUCCESS SCHOOL — Main JavaScript
 */
(function () {
  'use strict';

  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const backToTop = document.querySelector('.back-to-top');

  /* Sticky header */
  function handleScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 60);
    if (backToTop) backToTop.classList.toggle('visible', y > 400);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* Mobile navigation */
  function closeNav() {
    navToggle?.classList.remove('active');
    navMenu?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
  function openNav() {
    navToggle?.classList.add('active');
    navMenu?.classList.add('active');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  navToggle?.addEventListener('click', () => {
    navMenu?.classList.contains('active') ? closeNav() : openNav();
  });
  navOverlay?.addEventListener('click', closeNav);
  navMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* Back to top */
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* Counter animation */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => counterObs.observe(el));
  }

  /* Testimonial carousel */
  const testimonialTrack = document.querySelector('.testimonial-slides');
  const testimonialDots = document.querySelectorAll('.testimonial-dots button');
  const testimonialPrev = document.querySelector('.testimonial-prev');
  const testimonialNext = document.querySelector('.testimonial-next');
  let testimonialIndex = 0;
  let testimonialTimer;

  function goToTestimonial(i) {
    const slides = testimonialTrack?.children;
    if (!slides?.length) return;
    testimonialIndex = ((i % slides.length) + slides.length) % slides.length;
    testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
    testimonialDots.forEach((dot, idx) => dot.classList.toggle('active', idx === testimonialIndex));
  }
  function startTestimonialAuto() {
    testimonialTimer = setInterval(() => goToTestimonial(testimonialIndex + 1), 5000);
  }
  if (testimonialTrack) {
    testimonialDots.forEach((dot, i) => dot.addEventListener('click', () => {
      clearInterval(testimonialTimer);
      goToTestimonial(i);
      startTestimonialAuto();
    }));
    testimonialPrev?.addEventListener('click', () => { clearInterval(testimonialTimer); goToTestimonial(testimonialIndex - 1); startTestimonialAuto(); });
    testimonialNext?.addEventListener('click', () => { clearInterval(testimonialTimer); goToTestimonial(testimonialIndex + 1); startTestimonialAuto(); });
    startTestimonialAuto();
  }

  /* Achievement tabs (home) */
  document.querySelectorAll('.achievement-tabs').forEach((tabBar) => {
    const panels = tabBar.parentElement?.querySelectorAll('.achievement-panel');
    tabBar.querySelectorAll('button').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        tabBar.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        panels?.forEach((p, j) => p.classList.toggle('active', j === i));
      });
    });
  });

  /* FAQ accordion */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item?.querySelector('.faq-answer');
      const isActive = item?.classList.contains('active');
      item?.closest('.faq-list')?.querySelectorAll('.faq-item').forEach((el) => {
        el.classList.remove('active');
        const a = el.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });
      if (!isActive && item && answer) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* Gallery filter */
  document.querySelectorAll('.gallery-filters').forEach((filterBar) => {
    const grid = filterBar.nextElementSibling || document.querySelector('.gallery-grid');
    filterBar.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        grid?.querySelectorAll('.gallery-item').forEach((item) => {
          const cat = item.dataset.category || 'all';
          const show = filter === 'all' || cat === filter;
          item.classList.toggle('hidden', !show);
        });
      });
    });
  });

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-next');
  let lightboxImages = [];
  let lightboxIndex = 0;

  function openLightbox(src, images) {
    if (!lightbox || !lightboxImg) return;
    lightboxImages = images || [src];
    lightboxIndex = lightboxImages.indexOf(src);
    if (lightboxIndex < 0) lightboxIndex = 0;
    lightboxImg.src = lightboxImages[lightboxIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }
  function lightboxStep(dir) {
    if (!lightboxImages.length) return;
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    if (lightboxImg) lightboxImg.src = lightboxImages[lightboxIndex];
  }

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.dataset.lightbox || el.querySelector('img')?.src || el.src;
      const all = [...document.querySelectorAll('[data-lightbox]')].map(
        (n) => n.dataset.lightbox || n.querySelector('img')?.src
      ).filter(Boolean);
      openLightbox(src, all);
    });
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev?.addEventListener('click', () => lightboxStep(-1));
  lightboxNext?.addEventListener('click', () => lightboxStep(1));
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxStep(-1);
    if (e.key === 'ArrowRight') lightboxStep(1);
  });

  /* News search */
  const newsSearch = document.getElementById('newsSearch');
  if (newsSearch) {
    newsSearch.addEventListener('input', () => {
      const q = newsSearch.value.toLowerCase().trim();
      document.querySelectorAll('[data-searchable]').forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = !q || text.includes(q) ? '' : 'none';
      });
    });
  }

  /* Form handling */
  function handleFormSubmit(form, successMsg) {
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn?.textContent;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }
      setTimeout(() => {
        alert(successMsg || 'Thank you! Your message has been received. We will contact you shortly.');
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }, 800);
    });
  }
  handleFormSubmit(document.getElementById('contactForm'), 'Thank you for contacting SUCCESS SCHOOL! We will call you shortly.');
  handleFormSubmit(document.getElementById('admissionForm'), 'Your admission enquiry has been submitted! SUCCESS SCHOOL admissions team will contact you soon. Call 9849898863 for immediate assistance.');

  /* Active nav link */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
