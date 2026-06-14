document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    toggleBtn.innerHTML = `<i data-lucide="${currentTheme === 'dark' ? 'sun' : 'moon'}"></i>`;
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  initializePortfolio();
  initThemeToggle();
  initCarousels();
  initMobileMenu();
});

function initializePortfolio() {
  // ── Terminal typing animation ──
  const cmds = [
    'open_to_opportunities --kolkata --bangalore',
    'available_for_hire',
    'lets_build_something',
    'php artisan migrate',
    'npm run dev',
  ];
  let ci = 0, ch = 0, del = false;
  const el = document.getElementById('typed-text');

  function type() {
    if (!el) return;
    const cur = cmds[ci];
    if (!del) {
      el.textContent = cur.slice(0, ++ch);
      if (ch === cur.length) {
        del = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = cur.slice(0, --ch);
      if (ch === 0) {
        del = false;
        ci = (ci + 1) % cmds.length;
      }
    }
    setTimeout(type, del ? 35 : 65);
  }

  if (el) {
    type();
  }

  // ── CTA email handler ──
  const ctaInput = document.getElementById('cta-email');
  const ctaButton = document.querySelector('.cta-btn');
  const errorEl = document.getElementById('cta-error');
  const successEl = document.getElementById('cta-success');
  let feedbackTimeout = null;

  function handleCTA() {
    if (!ctaInput) return;
    const val = ctaInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset error/success visibility
    if (errorEl) errorEl.classList.remove('visible');
    if (successEl) successEl.classList.remove('visible');
    if (feedbackTimeout) clearTimeout(feedbackTimeout);

    if (!emailRegex.test(val)) {
      if (errorEl) {
        errorEl.classList.add('visible');
        feedbackTimeout = setTimeout(() => {
          errorEl.classList.remove('visible');
        }, 4000);
      }
      return;
    }

    // Success state: show message, clear input, trigger mailto
    if (successEl) {
      successEl.classList.add('visible');
      feedbackTimeout = setTimeout(() => {
        successEl.classList.remove('visible');
      }, 4000);
    }

    const subject = "Project Inquiry or Job Opportunity";
    // Note: mailto: bodies are plain-text only
    const body = "Hi Aman,\r\n\r\nI'm interested in discussing opportunities with you. Here's my email for reference: " + val + "\r\n\r\nPlease get in touch with me.\r\n\r\nThanks!\r\n\r\n— Sent via your portfolio website";
    const mailtoUrl = "mailto:aman.sinha.connect@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    window.location.href = mailtoUrl;
    ctaInput.value = '';
  }

  if (ctaButton) {
    ctaButton.addEventListener('click', handleCTA);
  }

  // Clear validation when typing
  if (ctaInput) {
    ctaInput.addEventListener('input', () => {
      if (errorEl) errorEl.classList.remove('visible');
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Navigation shadow effect on scroll ──
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(14, 12, 30, 0.08)' : 'none';
    });
  }

  // ── How We Work scroll animation observer ──
  const processRow = document.querySelector('.process-row');
  if (processRow) {
    animateSequentialSteps(processRow, '.process-step', 400, 0.3);
  }

  // ── Stats counter scroll animation observer ──
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          obs.disconnect();
          const statBigs = statsGrid.querySelectorAll('.stat-big');
          statBigs.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const numVal = el.querySelector('.num-val');
            if (!isNaN(target) && numVal) {
              animateValue(numVal, 0, target, 2000);
            }
          });
        }
      });
    }, {
      threshold: 0.35
    });
    observer.observe(statsGrid);
  }
}

// ── Helper: requestAnimationFrame count animation with ease-out curve ──
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOut = progress * (2 - progress);
    const currentVal = Math.floor(easeOut * (end - start) + start);
    obj.textContent = currentVal;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}

// ── Helper: sequential scroll-triggered observer loops ──
function animateSequentialSteps(triggerElement, stepSelector, staggerDelay, threshold = 0.3) {
  if (!triggerElement) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        obs.disconnect();
        const items = triggerElement.querySelectorAll(stepSelector);
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animate');
            setTimeout(() => {
              item.classList.add('animate-complete');
            }, 1000);
          }, index * staggerDelay);
        });
      }
    });
  }, {
    threshold: threshold
  });
  observer.observe(triggerElement);
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  function updateToggleIcon(theme) {
    const icon = toggleBtn.querySelector('i, svg');
    if (!icon) return;

    const newIconName = theme === 'dark' ? 'sun' : 'moon';
    toggleBtn.innerHTML = `<i data-lucide="${newIconName}"></i>`;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
  });
}

// ===== Carousel Logic =====
function initCarousels() {
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach(container => {
    const track = container.querySelector('.carousel-track');
    const viewport = container.querySelector('.carousel-viewport');
    const prevBtn = container.querySelector('.carousel-arrow.prev');
    const nextBtn = container.querySelector('.carousel-arrow.next');
    const dotsContainer = container.querySelector('.carousel-dots');
    
    if (!track || !viewport) return;

    const cards = Array.from(track.children);
    if (cards.length === 0) return;

    // Helper to get step distance (card width + gap)
    function getScrollStep() {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      return cardWidth + gap;
    }

    // Dynamically build pagination dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      cards.forEach((card, idx) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.setAttribute('aria-current', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => {
          const step = getScrollStep();
          track.scrollTo({
            left: idx * step,
            behavior: 'smooth'
          });
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    // Synchronize dots, arrows, and viewport fades on scroll
    function updateControls() {
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const step = getScrollStep();
      
      // Disable boundary arrows
      if (prevBtn) prevBtn.disabled = scrollLeft <= 5;
      if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 5;

      // Toggle boundary edge fade mask classes on viewport
      if (scrollLeft <= 5) {
        viewport.classList.add('is-start');
      } else {
        viewport.classList.remove('is-start');
      }

      if (scrollLeft >= maxScroll - 5) {
        viewport.classList.add('is-end');
      } else {
        viewport.classList.remove('is-end');
      }

      // Update dots highlighted slide states
      if (dots.length > 0) {
        const activeIndex = Math.min(
          Math.max(Math.round(scrollLeft / step), 0),
          cards.length - 1
        );
        dots.forEach((dot, idx) => {
          if (idx === activeIndex) {
            dot.classList.add('active');
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.classList.remove('active');
            dot.setAttribute('aria-current', 'false');
          }
        });
      }
    }

    // Optimized scroll listener
    let isScrolling;
    track.addEventListener('scroll', () => {
      window.cancelAnimationFrame(isScrolling);
      isScrolling = window.requestAnimationFrame(updateControls);
    });

    // Click actions for arrows
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const step = getScrollStep();
        track.scrollBy({
          left: -step,
          behavior: 'smooth'
        });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const step = getScrollStep();
        track.scrollBy({
          left: step,
          behavior: 'smooth'
        });
      });
    }

    // Run initial calculations
    updateControls();
    
    // Handle screen resizes dynamically
    window.addEventListener('resize', updateControls);

    // ===== Auto-Scroll Mechanism =====
    let autoScrollTimer = null;
    const autoScrollInterval = 4000; // 4 seconds

    function startAutoScroll() {
      stopAutoScroll();
      autoScrollTimer = setInterval(() => {
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const step = getScrollStep();

        if (scrollLeft >= maxScroll - 5) {
          // Loop back to start
          track.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Slide to next card
          track.scrollBy({
            left: step,
            behavior: 'smooth'
          });
        }
      }, autoScrollInterval);
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    // Only auto-scroll when in view
    let inView = false;
    const viewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        inView = entry.isIntersecting;
        if (inView) {
          startAutoScroll();
        } else {
          stopAutoScroll();
        }
      });
    }, { threshold: 0.1 });

    viewObserver.observe(container);

    // Pause auto-scroll on hover
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', () => {
      if (inView) startAutoScroll();
    });

    // Pause auto-scroll on touch/drag
    track.addEventListener('touchstart', stopAutoScroll);
    track.addEventListener('touchend', () => {
      if (inView) startAutoScroll();
    });

    // Reset timer on manual navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (inView) startAutoScroll();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (inView) startAutoScroll();
      });
    }
    if (dotsContainer) {
      dotsContainer.addEventListener('click', () => {
        if (inView) startAutoScroll();
      });
    }
  });
}

// ===== Mobile Bottom Sheet Menu =====
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const overlay = document.getElementById('mobile-menu-overlay');
  const sheet = document.getElementById('mobile-menu-sheet');
  const body = document.body;

  if (!menuToggle || !sheet || !overlay || !menuClose) return;

  function openMenu() {
    overlay.classList.add('is-open');
    sheet.classList.add('is-open');
    body.style.overflow = 'hidden';
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    overlay.classList.remove('is-open');
    sheet.classList.remove('is-open');
    body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu when clicking navigation links or the CTA
  const sheetLinks = sheet.querySelectorAll('.sheet-links a, .sheet-cta');
  sheetLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key press
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sheet.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Initialize new icons inside mobile bottom-sheet menu
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}


