/* ============================================================
   PORTFOLIO — Mouhamed Sall
   Loader, barre de progression, curseur personnalisé,
   menu mobile, scroll spy, compteurs animés, barres de
   compétences, filtres projets, formulaire.
   ============================================================ */
(function () {
  'use strict';

  const isDesktop = window.matchMedia('(pointer: fine)').matches;

  // ============================================================
  // 1. LOADER
  // ============================================================
  window.addEventListener('load', function () {
    setTimeout(function () {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 600);
  });

  // ============================================================
  // 2. BARRE DE PROGRESSION SCROLL
  // ============================================================
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }, { passive: true });

  // ============================================================
  // 3. CURSEUR PERSONNALISÉ
  // ============================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (isDesktop && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorDot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';
      cursorRing.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll('a, button, input, textarea, .skill-card, .project');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        cursorRing.classList.remove('hover');
      });
    });
  }

  // ============================================================
  // 4. HEADER — état au scroll
  // ============================================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ============================================================
  // 5. MENU MOBILE
  // ============================================================
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // 6. SCROLL SPY (navigation active)
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');

  if ('IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.nav === id);
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-72px 0px -50% 0px'
    });

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  // ============================================================
  // 7. REVEAL AU SCROLL
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const index = Array.from(revealElements).indexOf(entry.target);
          const delay = (index % 6) * 60;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ============================================================
  // 8. COMPTEURS ANIMÉS
  // ============================================================
  const counters = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function step(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.dataset.count; });
  }

  // ============================================================
  // 9. BARRES DE COMPÉTENCES
  // ============================================================
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          setTimeout(function () {
            entry.target.style.width = width + '%';
          }, 200);
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    skillBars.forEach(function (bar) { skillObserver.observe(bar); });
  } else {
    skillBars.forEach(function (bar) { bar.style.width = bar.dataset.width + '%'; });
  }

  // ============================================================
  // 10. FILTRES PROJETS
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projects.forEach(function (project) {
        const category = project.dataset.category;
        const matches = filter === 'all' || category === filter;
        project.classList.toggle('hidden', !matches);
      });
    });
  });

  // ============================================================
  // 11. FORMULAIRE DE CONTACT
  // ============================================================
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  function emailValide(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFeedback(text, type) {
    feedback.textContent = text;
    feedback.className = 'form-feedback ' + type;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nom = document.getElementById('nom').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!nom || !email || !message) {
        showFeedback('Merci de remplir les champs obligatoires.', 'erreur');
        return;
      }

      if (!emailValide(email)) {
        showFeedback('Veuillez saisir une adresse email valide.', 'erreur');
        return;
      }

      if (message.length < 10) {
        showFeedback('Votre message doit contenir au moins 10 caractères.', 'erreur');
        return;
      }

      showFeedback('Merci ' + nom + ', votre message a bien été pris en compte.', 'succes');
      form.reset();

      setTimeout(function () {
        feedback.textContent = '';
        feedback.className = 'form-feedback';
      }, 6000);
    });
  }

  // ============================================================
  // 12. BOUTON RETOUR EN HAUT
  // ============================================================
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // 13. SMOOTH SCROLL POUR ANCRES
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();