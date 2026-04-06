/* =============================================
   SUSTAINABLE SHE — Main JavaScript v1.1
   Language toggle, mobile nav, cards with photos
   ============================================= */

const LANG_KEY = 'she_lang';
function getLang() { return localStorage.getItem(LANG_KEY) || 'en'; }

function applyLang(lang) {
  const body = document.body;
  if (lang === 'ar') {
    body.classList.remove('ltr'); body.classList.add('rtl');
    document.documentElement.setAttribute('lang','ar');
    document.documentElement.setAttribute('dir','rtl');
  } else {
    body.classList.remove('rtl'); body.classList.add('ltr');
    document.documentElement.setAttribute('lang','en');
    document.documentElement.setAttribute('dir','ltr');
  }
  document.getElementById('langToggle')       && (document.getElementById('langToggle').textContent       = lang==='ar'?'EN':'عربي');
  document.getElementById('mobileLangToggle') && (document.getElementById('mobileLangToggle').textContent = lang==='ar'?'EN':'عربي');
  localStorage.setItem(LANG_KEY, lang);
}

function toggleLang() { applyLang(getLang()==='en'?'ar':'en'); }

function openMobileMenu()  { const m=document.getElementById('mobileNav'); if(m){m.classList.add('open');    document.body.style.overflow='hidden';} }
function closeMobileMenu() { const m=document.getElementById('mobileNav'); if(m){m.classList.remove('open'); document.body.style.overflow='';} }

function handleScrollTop() {
  const btn=document.getElementById('scrollTop');
  if(!btn)return;
  btn.classList.toggle('show', window.scrollY>400);
}

function getInitials(name) {
  const p=name.trim().split(' ');
  return p.length===1 ? p[0][0].toUpperCase() : (p[0][0]+p[1][0]).toUpperCase();
}

function renderCards(data, container, lang) {
  container.innerHTML='';
  data.forEach(e => {
    const name    = lang==='ar' ? e.nameAr    : e.nameEn;
    const project = lang==='ar' ? e.projectAr : e.projectEn;
    const tagline = lang==='ar' ? e.taglineAr : e.taglineEn;
    const loc     = lang==='ar' ? e.locationAr: e.location;

    const avatar = e.photo
      ? `<img src="${e.photo}" alt="${e.nameEn}" class="ent-photo" loading="lazy" />`
      : `<div class="ent-initials">${getInitials(e.nameEn)}</div>`;

    let links='';
    if(e.wa)  links+=`<a href="https://wa.me/${e.wa}"               target="_blank" rel="noopener" class="soc-link wa">📱 ${lang==='ar'?'واتساب':'WhatsApp'}</a>`;
    if(e.ig)  links+=`<a href="https://instagram.com/${e.ig}"       target="_blank" rel="noopener" class="soc-link ig">📷 Instagram</a>`;
    if(e.fb)  links+=`<a href="https://facebook.com/${e.fb}"        target="_blank" rel="noopener" class="soc-link fb">📘 Facebook</a>`;

    container.innerHTML+=`
      <div class="entrepreneur-card">
        <div class="ent-head">${avatar}<div class="ent-name">${name}</div><div class="ent-project">${project}</div></div>
        <div class="ent-body">
          <p class="ent-tagline">${tagline}</p>
          <p class="ent-location">📍 ${loc}</p>
          <div class="ent-links">${links}</div>
        </div>
      </div>`;
  });
  const count=document.getElementById('cardCount');
  if(count) count.textContent = lang==='ar'
    ? `عرض ${data.length} رائدة أعمال`
    : `Showing ${data.length} entrepreneur${data.length!==1?'s':''}`;
}

function renderCohortGrid() {
  const grid=document.getElementById('cohortGrid');
  if(!grid||typeof entrepreneurs==='undefined')return;
  renderCards(entrepreneurs, grid, getLang());
}

function initSearch() {
  const box=document.getElementById('searchBox');
  if(!box||typeof entrepreneurs==='undefined')return;
  box.addEventListener('input',()=>{
    const q=box.value.toLowerCase().trim();
    const lang=getLang();
    const f=q ? entrepreneurs.filter(e=>
      e.nameEn.toLowerCase().includes(q)||e.nameAr.includes(q)||
      e.projectEn.toLowerCase().includes(q)||e.projectAr.includes(q)||
      e.location.toLowerCase().includes(q)||e.locationAr.includes(q)
    ) : entrepreneurs;
    renderCards(f, document.getElementById('cohortGrid'), lang);
  });
}

function markActiveNav() {
  const cur=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-link').forEach(link=>{
    const h=link.getAttribute('href');
    if(h&&(h===cur||(cur===''&&h==='index.html'))) link.classList.add('active');
  });
}

function initFadeIn() {
  if(!('IntersectionObserver' in window))return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.style.opacity='1';
        en.target.style.transform='translateY(0)';
        obs.unobserve(en.target);
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('.card-fade').forEach(el=>{
    el.style.opacity='0'; el.style.transform='translateY(20px)';
    el.style.transition='opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  applyLang(getLang());
  document.getElementById('langToggle')       ?.addEventListener('click', toggleLang);
  document.getElementById('mobileLangToggle') ?.addEventListener('click', ()=>{toggleLang();closeMobileMenu();});
  document.getElementById('hamburger')        ?.addEventListener('click', openMobileMenu);
  document.getElementById('mobileNavClose')   ?.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('.mobile-nav .nav-link').forEach(l=>l.addEventListener('click',closeMobileMenu));
  window.addEventListener('scroll', handleScrollTop);
  document.getElementById('scrollTop')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  markActiveNav();
  if(typeof entrepreneurs!=='undefined'){ renderCohortGrid(); initSearch(); }
  initFadeIn();
});

// Re-render on lang change
const _orig=applyLang;
window.applyLang=function(lang){
  _orig(lang);
  if(typeof entrepreneurs!=='undefined'){
    const g=document.getElementById('cohortGrid');
    if(g) renderCards(entrepreneurs,g,lang);
  }
};
