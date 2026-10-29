import './style.css';

/* Theme toggle */
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

/* Search */
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

/* Quick tags */
document.querySelectorAll('.tag').forEach((tag) => {
  tag.addEventListener('click', () => {
    const text = tag.dataset.query || tag.textContent.trim();
    if (campusSearch) {
      campusSearch.value = text;
      campusSearch.focus();
      runSearch(text);
    }
  });
});

/* Nav shadow */
const nav = document.querySelector('nav');
function updateNav() {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* Scroll reveals */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* Subtle hero particles */
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
    const count = Math.min(40, Math.floor((w * h) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.12,
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
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}

/* Smooth anchors */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#' || id === '#explore') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});