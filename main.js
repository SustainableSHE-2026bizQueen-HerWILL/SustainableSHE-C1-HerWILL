/* =============================================
   SUSTAINABLE SHE — Main JavaScript
   Language toggle, mobile nav, scroll top
   ============================================= */

// ---- Language Management ----
const LANG_KEY = 'she_lang';

function getLang() {
  return localStorage.getItem(LANG_KEY) || 'en';
}

function applyLang(lang) {
  const body = document.body;
  if (lang === 'ar') {
    body.classList.remove('ltr');
    body.classList.add('rtl');
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    body.classList.remove('rtl');
    body.classList.add('ltr');
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  }
  // Update toggle button label
  const toggle = document.getElementById('langToggle');
  if (toggle) toggle.textContent = lang === 'ar' ? 'EN' : 'عربي';

  const mobileToggle = document.getElementById('mobileLangToggle');
  if (mobileToggle) mobileToggle.textContent = lang === 'ar' ? 'EN' : 'عربي';

  localStorage.setItem(LANG_KEY, lang);
}

function toggleLang() {
  const current = getLang();
  applyLang(current === 'en' ? 'ar' : 'en');
}

// ---- Mobile Menu ----
function openMobileMenu() {
  const menu = document.getElementById('mobileNav');
  if (menu) {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileNav');
  if (menu) {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ---- Scroll Top ----
function handleScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  if (window.scrollY > 400) {
    btn.classList.add('show');
  } else {
    btn.classList.remove('show');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Cohort Card Renderer ----
function getInitials(name) {
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function renderCohortGrid() {
  const grid = document.getElementById('cohortGrid');
  if (!grid || typeof entrepreneurs === 'undefined') return;

  const lang = getLang();
  renderCards(entrepreneurs, grid, lang);
}

function renderCards(data, container, lang) {
  container.innerHTML = '';
  data.forEach(e => {
    const name    = lang === 'ar' ? e.nameAr    : e.nameEn;
    const project = lang === 'ar' ? e.projectAr : e.projectEn;
    const tagline = lang === 'ar' ? e.taglineAr : e.taglineEn;
    const loc     = lang === 'ar' ? e.locationAr : e.location;

    let links = '';
    if (e.wa) {
      const waLabel = lang === 'ar' ? 'واتساب' : 'WhatsApp';
      links += `<a href="https://wa.me/${e.wa}" target="_blank" rel="noopener" class="soc-link wa">📱 ${waLabel}</a>`;
    }
    if (e.ig) {
      links += `<a href="https://instagram.com/${e.ig}" target="_blank" rel="noopener" class="soc-link ig">📷 Instagram</a>`;
    }
    if (e.fb) {
      links += `<a href="https://facebook.com/${e.fb}" target="_blank" rel="noopener" class="soc-link fb">📘 Facebook</a>`;
    }

    container.innerHTML += `
      <div class="entrepreneur-card">
        <div class="ent-head">
          <div class="ent-initials">${getInitials(e.nameEn)}</div>
          <div class="ent-name">${name}</div>
          <div class="ent-project">${project}</div>
        </div>
        <div class="ent-body">
          <p class="ent-tagline">${tagline}</p>
          <p class="ent-location">📍 ${loc}</p>
          <div class="ent-links">${links}</div>
        </div>
      </div>`;
  });

  const count = document.getElementById('cardCount');
  if (count) {
    count.textContent = lang === 'ar'
      ? `عرض ${data.length} رائدة أعمال`
      : `Showing ${data.length} entrepreneur${data.length !== 1 ? 's' : ''}`;
  }
}

// ---- Search Filter (cohort page) ----
function initSearch() {
  const box = document.getElementById('searchBox');
  if (!box || typeof entrepreneurs === 'undefined') return;

  box.addEventListener('input', () => {
    const q    = box.value.toLowerCase().trim();
    const lang = getLang();
    const filtered = q
      ? entrepreneurs.filter(e =>
          e.nameEn.toLowerCase().includes(q) ||
          e.nameAr.toLowerCase().includes(q) ||
          e.projectEn.toLowerCase().includes(q) ||
          e.projectAr.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.locationAr.includes(q) ||
          e.taglineEn.toLowerCase().includes(q)
        )
      : entrepreneurs;

    const grid = document.getElementById('cohortGrid');
    if (grid) renderCards(filtered, grid, lang);
  });
}

// ---- Active Nav Link ----
function markActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === current || (current === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

// ---- Intersection Observer — subtle fade in ----
function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card-fade').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved or default language
  applyLang(getLang());

  // Language toggle buttons
  document.getElementById('langToggle')?.addEventListener('click', toggleLang);
  document.getElementById('mobileLangToggle')?.addEventListener('click', () => {
    toggleLang();
    closeMobileMenu();
  });

  // Mobile menu
  document.getElementById('hamburger')?.addEventListener('click', openMobileMenu);
  document.getElementById('mobileNavClose')?.addEventListener('click', closeMobileMenu);

  // Close mobile menu when nav link clicked
  document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Scroll top button
  window.addEventListener('scroll', handleScrollTop);
  document.getElementById('scrollTop')?.addEventListener('click', scrollToTop);

  // Mark active page in nav
  markActiveNav();

  // Cohort page
  if (typeof entrepreneurs !== 'undefined') {
    renderCohortGrid();
    initSearch();
  }

  // Fade animations
  initFadeIn();
});

// Re-render cohort cards when language changes (override applyLang)
const _applyLang = applyLang;
window.applyLang = function(lang) {
  _applyLang(lang);
  if (typeof entrepreneurs !== 'undefined') {
    const grid = document.getElementById('cohortGrid');
    if (grid) renderCards(entrepreneurs, grid, lang);
  }
};
