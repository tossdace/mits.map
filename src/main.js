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

/* Accent color picker */
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

/* Academic Team directory filters */
const facultySearch = document.querySelector('#faculty-search');
const departmentFilter = document.querySelector('#department-filter');
const facultyGroups = [...document.querySelectorAll('[data-faculty-group]')];
const facultyResultsStatus = document.querySelector('#faculty-results-status');
const facultyEmptyState = document.querySelector('#faculty-empty');

function filterFaculty() {
  const query = facultySearch?.value.trim().toLocaleLowerCase() || '';
  const department = departmentFilter?.value || '';
  let visibleCount = 0;

  facultyGroups.forEach((group) => {
    const departmentMatches = !department || group.dataset.facultyGroup === department;
    const members = [...group.querySelectorAll('[data-faculty-member]')];
    let groupCount = 0;

    members.forEach((member) => {
      const matches = departmentMatches && member.textContent.toLocaleLowerCase().includes(query);
      member.hidden = !matches;
      groupCount += Number(matches);
    });

    group.hidden = groupCount === 0;
    visibleCount += groupCount;
  });

  if (facultyResultsStatus) {
    facultyResultsStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'listing' : 'listings'}`;
  }
  if (facultyEmptyState) facultyEmptyState.hidden = visibleCount > 0;
}

facultySearch?.addEventListener('input', filterFaculty);
departmentFilter?.addEventListener('change', filterFaculty);

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
document.querySelectorAll('#home, #explore, #features, #student-support').forEach((section) => routeObserver.observe(section));

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
