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

/* Nav shadow */
const nav = document.querySelector('nav');
function updateNav() {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* Keep the numbered wayfinding stops in sync with the current section */
const routeLinks = [...document.querySelectorAll('.route-link')];
const routeObserver = new IntersectionObserver(
  (entries) => {
    const current = entries.find((entry) => entry.isIntersecting);
    if (!current) return;

    routeLinks.forEach((link) => {
      if (link.hash === `#${current.target.id}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  },
  { rootMargin: '-38% 0px -52% 0px', threshold: 0 }
);
document.querySelectorAll('#home, #features, #about').forEach((section) => routeObserver.observe(section));

/* Scroll reveals */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.matches('.pixel-reveal')) animatePixels(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* Pixel assembly for key headings as they enter the viewport */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animatePixels(heading) {
  if (reducedMotion) return;

  const bounds = heading.getBoundingClientRect();
  const pixelLayer = document.createElement('span');
  pixelLayer.className = 'pixel-layer';
  pixelLayer.setAttribute('aria-hidden', 'true');

  const count = Math.min(72, Math.max(32, Math.round(bounds.width * bounds.height / 1900)));
  for (let index = 0; index < count; index += 1) {
    const pixel = document.createElement('span');
    const endX = Math.random() * 100;
    const endY = Math.random() * 100;
    pixel.className = 'pixel';
    pixel.style.setProperty('--x', `${endX}%`);
    pixel.style.setProperty('--y', `${endY}%`);
    pixel.style.setProperty('--start-x', `${(Math.random() - 0.5) * 180}px`);
    pixel.style.setProperty('--start-y', `${(Math.random() - 0.5) * 100}px`);
    pixel.style.setProperty('--delay', `${Math.random() * 360}ms`);
    pixelLayer.append(pixel);
  }

  heading.append(pixelLayer);
  window.setTimeout(() => pixelLayer.remove(), 1250);
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
