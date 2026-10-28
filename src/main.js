import './style.css';

const campusSearch = document.querySelector('#campus-search');
const searchStatus = document.querySelector('#search-status');
const searchableItems = [...document.querySelectorAll('[data-searchable]')];

campusSearch?.addEventListener('input', () => {
  const query = campusSearch.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  searchableItems.forEach((item) => {
    const matches = item.textContent.toLocaleLowerCase().includes(query);
    item.hidden = !matches;
    visibleCount += Number(matches);
  });

  if (searchStatus) {
    searchStatus.textContent = query
      ? `${visibleCount} matching ${visibleCount === 1 ? 'result' : 'results'}`
      : '';
  }
});

const themeToggle = document.querySelector('#theme-toggle');

themeToggle?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);

  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
});

if (themeToggle) {
  const theme = document.documentElement.dataset.theme;
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
}
