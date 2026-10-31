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

/* Student profile */
const profileFields = ['name', 'studentId', 'course', 'department', 'year', 'semester'];
const departmentsByCourse = {
  'B.Tech': [
    'Computer Science Engineering',
    'CSE (Artificial Intelligence)',
    'CSE (Cyber Security)',
    'AI and Data Science',
    'Civil Engineering',
    'Electrical and Electronics Engineering',
    'Electronics and Communication Engineering',
    'Electronics and Communication Engineering (VLSI)',
    'Mechanical Engineering',
  ],
  'M.Tech': ['AI and Data Science', 'Cyber Security'],
};
const loginForm = document.querySelector('#login-form');
const profileForm = document.querySelector('#profile-form');
const isProfileActive = localStorage.getItem('profile.active') === 'true';
const profileName = isProfileActive ? localStorage.getItem('profile.name')?.trim() || '' : '';
document.querySelectorAll('[data-profile-name]').forEach((element) => {
  element.textContent = profileName || 'Sign in';
});
document.querySelectorAll('[data-profile-initial]').forEach((element) => {
  element.textContent = [...(profileName || 'Sign in')][0]?.toLocaleUpperCase() || 'S';
});
document.querySelectorAll('[data-profile-link]').forEach((element) => {
  element.setAttribute('href', isProfileActive ? 'profile.html' : 'login.html');
  element.setAttribute('aria-label', isProfileActive ? 'Open user profile' : 'Sign in to your profile');
});

if (loginForm && isProfileActive) location.replace('profile.html');
if (profileForm && !isProfileActive) location.replace('login.html');

const profileSaveStatus = document.querySelector('#profile-save-status');
const profileError = document.querySelector('#profile-error');
const loginError = document.querySelector('#login-error');
const loginSaveStatus = document.querySelector('#login-save-status');
const profileEditButton = document.querySelector('#profile-edit-button');
const profileCancelButton = document.querySelector('#profile-cancel-button');
const profileView = document.querySelector('#profile-view');
const profileViewStatus = document.querySelector('#profile-view-status');
const notificationsToggle = document.querySelector('#notifications-toggle');
let pendingPhoto;

function showProfilePhoto(photo) {
  const image = document.querySelector('#profile-photo-view');
  const initial = document.querySelector('#profile-photo-view-initial');
  if (image && initial) {
    image.hidden = !photo;
    if (photo) image.src = photo;
    initial.hidden = true;
  }
}

function updateDepartmentOptions(form, selectedDepartment = '') {
  const courseField = form.elements.namedItem('course');
  const departmentField = form.elements.namedItem('department');
  const departmentContainer = departmentField?.closest('.profile-department-field');
  if (!courseField || !departmentField || !departmentContainer) return;

  const departments = departmentsByCourse[courseField.value] || [];
  const isMca = courseField.value === 'MCA';
  const hasSelectedDepartment = departments.includes(selectedDepartment);
  departmentField.replaceChildren(new Option(
    departments.length ? 'Select department' : isMca ? 'Not applicable for MCA' : 'Select course first',
    ''
  ));
  departments.forEach((department) => {
    departmentField.add(new Option(department, department));
  });

  departmentContainer.hidden = false;
  departmentField.disabled = isMca || departments.length === 0;
  departmentField.required = !isMca && departments.length > 0;
  departmentField.value = hasSelectedDepartment ? selectedDepartment : '';
}

function fillProfileForm(form) {
  profileFields.filter((fieldName) => fieldName !== 'department').forEach((fieldName) => {
    const field = form.elements.namedItem(fieldName);
    const value = localStorage.getItem(`profile.${fieldName}`) || '';
    if (field) field.value = value;
  });
  updateDepartmentOptions(form, localStorage.getItem('profile.department') || '');
  const photo = localStorage.getItem('profile.photo') || '';
  const image = form.querySelector('img');
  const initial = form.querySelector('.profile-photo-initial');
  if (image && initial) {
    image.hidden = !photo;
    if (photo) image.src = photo;
    initial.hidden = true;
  }
}

function renderProfileDetails() {
  const course = localStorage.getItem('profile.course')?.trim() || '';
  document.querySelectorAll('[data-profile-value]').forEach((element) => {
    const fieldName = element.dataset.profileValue;
    const value = fieldName === 'department' && course === 'MCA'
      ? ''
      : localStorage.getItem(`profile.${fieldName}`)?.trim() || '';
    element.textContent = value;
    const field = element.closest('div');
    if (field) field.hidden = !value;
  });
  showProfilePhoto(localStorage.getItem('profile.photo'));
}

function attachPhotoPicker(form, inputId, statusId) {
  const input = document.querySelector(`#${inputId}`);
  const status = document.querySelector(`#${statusId}`);
  const image = form.querySelector('img');
  const initial = form.querySelector('.profile-photo-initial');
  input?.addEventListener('change', () => {
    const [file] = input.files || [];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      if (status) status.textContent = 'Choose an image file.';
      input.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      if (status) status.textContent = 'Choose an image smaller than 1 MB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        if (status) status.textContent = 'Could not preview this image.';
        return;
      }
      pendingPhoto = reader.result;
      if (image) {
        image.src = pendingPhoto;
        image.hidden = false;
      }
      if (initial) initial.hidden = true;
      if (status) status.textContent = 'Photo will be saved in this browser when you save the profile.';
    });
    reader.addEventListener('error', () => {
      if (status) status.textContent = 'Could not read this image.';
    });
    reader.readAsDataURL(file);
  });
}

function saveProfile(form, activate) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  if (!name) return false;

  profileFields.forEach((fieldName) => {
    const value = String(formData.get(fieldName) || '').trim();
    if (value) localStorage.setItem(`profile.${fieldName}`, value);
    else localStorage.removeItem(`profile.${fieldName}`);
  });
  if (pendingPhoto) localStorage.setItem('profile.photo', pendingPhoto);
  if (activate) localStorage.setItem('profile.active', 'true');
  return true;
}

if (loginForm) {
  attachPhotoPicker(loginForm, 'login-photo-input', 'login-photo-status');
  loginForm.elements.namedItem('course')?.addEventListener('change', () => {
    updateDepartmentOptions(loginForm);
  });
  updateDepartmentOptions(loginForm);
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      if (saveProfile(loginForm, true)) location.assign('profile.html');
    } catch (error) {
      if (loginError) {
        loginError.textContent = `Could not save your profile: ${error.message}`;
        loginError.hidden = false;
      }
    }
  });
}

if (profileForm && isProfileActive) {
  fillProfileForm(profileForm);
  profileForm.elements.namedItem('course')?.addEventListener('change', () => {
    updateDepartmentOptions(profileForm);
  });
  renderProfileDetails();
  attachPhotoPicker(profileForm, 'profile-photo-input', 'profile-photo-status');

  profileEditButton?.addEventListener('click', () => {
    pendingPhoto = null;
    fillProfileForm(profileForm);
    if (profileViewStatus) profileViewStatus.textContent = '';
    if (profileView) profileView.hidden = true;
    profileForm.hidden = false;
    profileForm.querySelector('input[name="name"]')?.focus();
  });

  profileCancelButton?.addEventListener('click', () => {
    pendingPhoto = null;
    fillProfileForm(profileForm);
    profileForm.hidden = true;
    if (profileView) profileView.hidden = false;
    if (profileSaveStatus) profileSaveStatus.textContent = '';
  });

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      if (!saveProfile(profileForm, false)) return;
      renderProfileDetails();
      profileForm.hidden = true;
      if (profileView) profileView.hidden = false;
      if (profileViewStatus) profileViewStatus.textContent = 'Profile changes saved on this device.';
      if (profileError) profileError.hidden = true;
      pendingPhoto = null;
    } catch (error) {
      if (profileError) {
        profileError.textContent = `Could not save your profile: ${error.message}`;
        profileError.hidden = false;
      }
    }
  });

  if (notificationsToggle) {
    notificationsToggle.checked = localStorage.getItem('profile.notifications') === 'true';
    notificationsToggle.addEventListener('change', () => {
      try {
        localStorage.setItem('profile.notifications', String(notificationsToggle.checked));
        if (profileError) profileError.hidden = true;
      } catch (error) {
        if (profileError) {
          profileError.textContent = `Could not save notification preference: ${error.message}`;
          profileError.hidden = false;
        }
      }
    });
  }

  document.querySelector('#profile-logout-button')?.addEventListener('click', () => {
    localStorage.removeItem('profile.active');
    location.assign('login.html');
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

/* Search on classroom and lab directory pages */
const placeSearch = document.querySelector('#space-search');
const placeItems = [...document.querySelectorAll('[data-place]')];
const placeResultsStatus = document.querySelector('#space-results-status');
const placeEmptyState = document.querySelector('#space-empty');
const placeContent = document.querySelector('#space-content');
const placeLabel = placeContent?.dataset.placeLabel || 'result';

function filterPlaces() {
  const query = placeSearch?.value.trim().toLocaleLowerCase() || '';
  let visibleCount = 0;

  placeItems.forEach((item) => {
    const searchText = `${item.textContent} ${item.dataset.search || ''}`.toLocaleLowerCase();
    const matches = searchText.includes(query);
    item.hidden = !matches;
    visibleCount += Number(matches);
  });

  if (placeResultsStatus) {
    placeResultsStatus.textContent = visibleCount
      ? `Showing ${visibleCount} ${placeLabel}${visibleCount === 1 ? '' : 's'}`
      : `No ${placeLabel}s found`;
  }
  if (placeEmptyState) placeEmptyState.hidden = visibleCount > 0;
}

placeSearch?.addEventListener('input', filterPlaces);

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

/* Give each place finder a short animated entrance before showing its directory. */
const placeLoader = document.querySelector('#space-loader');

if (placeLoader && placeContent) {
  const showPlaces = () => {
    placeLoader.hidden = true;
    placeContent.hidden = false;
    placeContent.classList.add('is-ready');
  };

  if (reducedMotion) {
    showPlaces();
  } else {
    window.setTimeout(() => {
      placeLoader.classList.add('is-leaving');
      window.setTimeout(showPlaces, 380);
    }, 1050);
  }
}

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
