/* ─── LANGUAGE ─── */
const langBtn = document.getElementById('langBtn');
let currentLang = 'fa';

function setLang(lang) {
  currentLang = lang;
  const html = document.documentElement;
  const body = document.body;

  if (lang === 'en') {
    html.lang = 'en';
    html.dir = 'ltr';
    body.classList.add('en');
    body.classList.remove('fa');
    langBtn.textContent = 'FA';
  } else {
    html.lang = 'fa';
    html.dir = 'rtl';
    body.classList.add('fa');
    body.classList.remove('en');
    langBtn.textContent = 'EN';
  }

  // update all data-fa / data-en text nodes
  document.querySelectorAll('[data-fa]').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
    el.textContent = lang === 'en' ? el.dataset.en : el.dataset.fa;
  });

  // select options
  document.querySelectorAll('select option[data-fa]').forEach(opt => {
    opt.textContent = lang === 'en' ? opt.dataset.en : opt.dataset.fa;
  });

  // placeholders
  document.querySelectorAll('[data-fa-placeholder]').forEach(el => {
    el.placeholder = lang === 'en' ? el.dataset.enPlaceholder : el.dataset.faPlaceholder;
  });

  localStorage.setItem('wn-lang', lang);
}

langBtn.addEventListener('click', () => setLang(currentLang === 'fa' ? 'en' : 'fa'));

// restore saved language
const savedLang = localStorage.getItem('wn-lang');
if (savedLang) setLang(savedLang);
else setLang('fa');

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── MOBILE MENU ─── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ─── PARTICLES ─── */
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 28;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 1;
  const hue = Math.random() > 0.5 ? '263' : '189'; // purple or cyan
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    --dur: ${Math.random() * 8 + 5}s;
    --delay: ${Math.random() * 8}s;
    background: hsl(${hue}, 80%, 70%);
  `;
  particlesContainer.appendChild(p);
}

/* ─── PARALLAX ─── */
const heroBg = document.getElementById('heroBg');
const parallaxInner = document.getElementById('parallaxInner');
const parallaxBanner = document.getElementById('parallaxBanner');

function updateParallax() {
  const scrollY = window.scrollY;

  // hero bg subtle move
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
  }

  // parallax banner
  if (parallaxBanner && parallaxInner) {
    const rect = parallaxBanner.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom > 0 && rect.top < viewH) {
      const progress = (viewH - rect.top) / (viewH + rect.height);
      parallaxInner.style.transform = `translateY(${(progress - 0.5) * 80}px)`;
    }
  }
}

window.addEventListener('scroll', updateParallax, { passive: true });

/* ─── REVEAL ON SCROLL ─── */
const allRevealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

allRevealEls.forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animateCount(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stats');
let statsAnimated = false;

if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        animateCount(el, target);
      });
    }
  }, { threshold: 0.4 });
  statsObserver.observe(statsSection);
}

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── IDEA FORM ─── */
const ideaForm = document.getElementById('ideaForm');
const formSuccess = document.getElementById('formSuccess');

if (ideaForm) {
  ideaForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = ideaForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // simulate async send (replace with real fetch to your backend/Formspree)
    setTimeout(() => {
      formSuccess.classList.add('show');
      ideaForm.querySelectorAll('input, textarea, select').forEach(el => {
        el.value = '';
      });
      ideaForm.querySelectorAll('input[type="radio"]').forEach(el => {
        el.checked = false;
      });
      btn.disabled = false;
      btn.style.opacity = '1';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 800);
  });
}

/* ─── SEO SCORE RING + BARS ─── */
const seoSection = document.getElementById('seo');
let seoAnimated = false;

if (seoSection) {
  const seoObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !seoAnimated) {
      seoAnimated = true;

      // animate ring (circumference = 2π×52 ≈ 327)
      const ringFill = document.querySelector('.seo-ring-fill');
      const scoreNumEl = document.querySelector('.seo-score-num');
      const TARGET_SCORE = 94;
      const CIRC = 327;

      if (ringFill) {
        setTimeout(() => {
          ringFill.style.strokeDashoffset = CIRC * (1 - TARGET_SCORE / 100);
        }, 200);
      }
      if (scoreNumEl) animateCount(scoreNumEl, TARGET_SCORE, 1600);

      // animate progress bars
      document.querySelectorAll('.seo-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 300);
      });
    }
  }, { threshold: 0.3 });
  seoObserver.observe(seoSection);
}

/* ─── TILT EFFECT ON CARDS (desktop) ─── */
if (!window.matchMedia('(pointer: coarse)').matches) {
  document.querySelectorAll('.card, .why-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── CURSOR GLOW (desktop only) ─── */
if (window.innerWidth > 1024 && !window.matchMedia('(pointer: coarse)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left .12s ease, top .12s ease;
    left: -999px; top: -999px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
