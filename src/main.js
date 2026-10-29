import './style.css';

/* ═══════════════════════════════════════════
   Theme toggle
═══════════════════════════════════════════ */
const themeToggle = document.querySelector('#theme-toggle');

function setThemeLabel(theme) {
  if (!themeToggle) return;
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
}

themeToggle?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  setThemeLabel(theme);
});

if (themeToggle) {
  setThemeLabel(document.documentElement.dataset.theme);
}

/* ═══════════════════════════════════════════
   Accent color picker
═══════════════════════════════════════════ */
const colorThemeToggle = document.querySelector('#color-theme-toggle');
const colorThemeMenu = document.querySelector('#color-theme-menu');
const colorThemeSwatches = document.querySelectorAll('[data-color-theme]');
const validBrandThemes = new Set([
  '#d21d25',
  '#6ad457',
  '#18d0f5',
  '#771cb8',
  '#960262',
  '#96022c',
  '#ff48a5',
]);
const darkTextBrandThemes = new Set(['#6ad457', '#18d0f5', '#ff48a5']);

function setBrandTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--brand-accent', theme);
  if (darkTextBrandThemes.has(theme)) {
    root.dataset.accentContrast = 'dark';
  } else {
    delete root.dataset.accentContrast;
  }
  localStorage.setItem('brandColor', theme);
  colorThemeSwatches.forEach((swatch) => {
    swatch.setAttribute('aria-pressed', String(swatch.dataset.colorTheme === theme));
  });
}

if (colorThemeToggle && colorThemeMenu) {
  const savedBrandColor = localStorage.getItem('brandColor');
  const savedBrandTheme = savedBrandColor === 'gradient' ? '#ff48a5' : savedBrandColor;
  setBrandTheme(savedBrandTheme && validBrandThemes.has(savedBrandTheme) ? savedBrandTheme : '#d21d25');

  colorThemeToggle.addEventListener('click', () => {
    const isExpanded = colorThemeToggle.getAttribute('aria-expanded') === 'true';
    colorThemeToggle.setAttribute('aria-expanded', String(!isExpanded));
    colorThemeMenu.hidden = isExpanded;
  });

  colorThemeSwatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const theme = swatch.dataset.colorTheme;
      if (theme && validBrandThemes.has(theme)) {
        setBrandTheme(theme);
        colorThemeMenu.hidden = true;
        colorThemeToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!colorThemeMenu.contains(event.target) && !colorThemeToggle.contains(event.target)) {
      colorThemeMenu.hidden = true;
      colorThemeToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !colorThemeMenu.hidden) {
      colorThemeMenu.hidden = true;
      colorThemeToggle.setAttribute('aria-expanded', 'false');
      colorThemeToggle.focus();
    }
  });
}

/* ═══════════════════════════════════════════
   Search
═══════════════════════════════════════════ */
const campusSearch = document.querySelector('#campus-search');
const searchStatus = document.querySelector('#search-status');
const searchableItems = [...document.querySelectorAll('[data-searchable]')];

function runSearch(query) {
  const q = query.trim().toLocaleLowerCase();
  let visibleCount = 0;

  searchableItems.forEach((item) => {
    const matches = !q || item.textContent.toLocaleLowerCase().includes(q);
    item.hidden = !matches;
    visibleCount += Number(matches);
  });

  if (searchStatus) {
    searchStatus.textContent = q
      ? `${visibleCount} matching ${visibleCount === 1 ? 'result' : 'results'}`
      : '';
  }
}

campusSearch?.addEventListener('input', () => runSearch(campusSearch.value));

/* Quick tags → fill search */
document.querySelectorAll('.tag-pill').forEach((tag) => {
  tag.addEventListener('click', () => {
    const text = tag.dataset.query || tag.textContent.replace(/^[^\w]+/, '').trim();
    if (campusSearch) {
      campusSearch.value = text;
      campusSearch.focus();
      runSearch(text);
      campusSearch.closest('.search-ring')?.classList.add('ring-pulse');
      setTimeout(() => campusSearch.closest('.search-ring')?.classList.remove('ring-pulse'), 400);
    }
  });
});

/* ═══════════════════════════════════════════
   Scroll progress bar
═══════════════════════════════════════════ */
const progressBar = document.querySelector('#scroll-progress');

function updateProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ═══════════════════════════════════════════
   Nav shrink on scroll
═══════════════════════════════════════════ */
const nav = document.querySelector('nav');

function updateNav() {
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ═══════════════════════════════════════════
   Intersection Observer reveals
═══════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   Magnetic buttons
═══════════════════════════════════════════ */
document.querySelectorAll('.magnetic').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

/* ═══════════════════════════════════════════
   Hero particles (canvas)
═══════════════════════════════════════════ */
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.45 + 0.15,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 200, ${p.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255, 180, 160, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });
}

/* ═══════════════════════════════════════════
   Smooth anchor scroll offset for sticky nav
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#' || id === '#explore') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});