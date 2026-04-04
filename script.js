'use strict';
/* ════════════════════════════════════════════════
   MIQNAF – Complete Interactive JavaScript v3
   ════════════════════════════════════════════════ */

/* ── Doctor Dataset ── */
const doctors = [
  { id: 0, name: 'Dr. Harshil Shah',  specialty: 'Chest Physician',   city: 'Mumbai', image: 'images/dr-harshil.png' },
  { id: 1, name: 'Dr. Pankaj Bang',   specialty: 'Pulmonologist',      city: 'Mumbai', image: 'images/dr-pankaj.png'  },
  { id: 2, name: 'Dr. Satyey Tayde',  specialty: 'Internal Medicine', city: 'Mumbai', image: 'images/dr-satyey.png'  }
];

/* ════════════════════════════════════════════════
   0. SMOOTH SCROLL ENGINE  (Lenis-style)
════════════════════════════════════════════════ */
const smoothScroll = new SmoothScroll({ lerp: 0.078 });

/* ════════════════════════════════════════════════
   1. NAVBAR
════════════════════════════════════════════════ */
const navbar       = document.getElementById('navbar');
const navHamburger = document.getElementById('navHamburger');
const navLinksEl   = document.getElementById('navLinks');

window.addEventListener('scroll', onScroll, { passive: true });
navHamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('menu-open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinksEl.classList.remove('menu-open'));
});

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}

function updateActiveNav() {
  const sections = [
    { id: 'hero',     navId: 'nav-home'     },
    { id: 'clinical', navId: 'nav-clinical' },
    { id: 'about',    navId: 'nav-about'    }
  ];
  const offset = 130;
  let current = 'nav-home';
  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el && window.scrollY >= el.offsetTop - offset) current = s.navId;
  });
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const active = document.getElementById(current);
  if (active) active.classList.add('active');
}

/* ════════════════════════════════════════════════
   2. SMOOTH SCROLL for anchor links
════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    navLinksEl.classList.remove('menu-open');
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      smoothScroll.scrollTo(target, { offset: 80 });
    }
  });
});

/* ════════════════════════════════════════════════
   3. PATIENT SECTION REVEAL  (full-width stacked)
════════════════════════════════════════════════ */
const patientSections = document.querySelectorAll('.patient-section');

const psObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('ps-visible');
      psObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

patientSections.forEach(sec => psObserver.observe(sec));

/* ════════════════════════════════════════════════
   4. FILTER DROPDOWNS (Clinical)
════════════════════════════════════════════════ */
function setupDropdown(wrapperId, triggerId, listId, onSelect) {
  const wrapper = document.getElementById(wrapperId);
  const trigger = document.getElementById(triggerId);
  const list    = document.getElementById(listId);
  if (!wrapper || !trigger || !list) return;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.fdd.open').forEach(d => {
      if (d.id !== wrapperId) d.classList.remove('open');
    });
    wrapper.classList.toggle('open');
    trigger.setAttribute('aria-expanded', wrapper.classList.contains('open'));
  });

  list.querySelectorAll('.fdd-opt').forEach((opt, i) => {
    opt.addEventListener('click', () => {
      list.querySelectorAll('.fdd-opt').forEach(o => o.classList.remove('active', 'selected'));
      opt.classList.add('active');
      trigger.querySelector('span').textContent = opt.textContent.trim();
      wrapper.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      onSelect(i, opt.textContent.trim());
    });
  });
}

document.addEventListener('click', () => {
  document.querySelectorAll('.fdd.open').forEach(d => d.classList.remove('open'));
});

let activeDocIdx = 0;
setupDropdown('fdd-doctor', 'fdd-doctor-trigger', 'fdd-doctor-list', (idx) => {
  updateDoctor(idx);
  activeDocIdx = idx;
});
setupDropdown('fdd-city', 'fdd-city-trigger', 'fdd-city-list', () => {});

function updateDoctor(idx) {
  const doc    = doctors[idx] || doctors[0];
  const name   = document.getElementById('docName');
  const spec   = document.getElementById('docSpec');
  const poster = document.getElementById('videoPoster');

  poster.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  poster.style.opacity = '0';
  poster.style.transform = 'scale(0.96)';

  if (name) name.textContent = doc.name;
  if (spec) spec.textContent = doc.specialty;

  setTimeout(() => {
    if (poster) {
      poster.src = doc.image;
      poster.alt = `${doc.name} – testimonial video`;
      poster.style.opacity   = '1';
      poster.style.transform = 'scale(1)';
    }
  }, 380);
}

/* ════════════════════════════════════════════════
   5. PLAY BUTTON
════════════════════════════════════════════════ */
const playBtn = document.getElementById('playBtn');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    toast(`Playing testimonial by ${doctors[activeDocIdx].name}`);
  });
}

function toast(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position:     'fixed',
    bottom:       '28px',
    right:        '28px',
    background:   '#002D62',
    color:        '#fff',
    padding:      '13px 22px',
    borderRadius: '10px',
    fontFamily:   'AcuminVar, Helvetica, sans-serif',
    fontSize:     '0.9rem',
    fontWeight:   '600',
    boxShadow:    '0 8px 32px rgba(0,0,0,0.2)',
    zIndex:       '9999',
    opacity:      '0',
    transform:    'translateY(14px)',
    transition:   'opacity 0.4s ease, transform 0.4s ease'
  });
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity   = '1';
    el.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(14px)';
    setTimeout(() => el.remove(), 400);
  }, 3200);
}

/* ════════════════════════════════════════════════
   6. INTERSECTION OBSERVER – Elegant Reveal
════════════════════════════════════════════════ */
document.querySelectorAll('.stat-card').forEach((el, i) => {
  el.style.setProperty('--delay', `${i * 0.15}s`);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

/* ════════════════════════════════════════════════
   7. TIMELINE POLE REVEAL
════════════════════════════════════════════════ */
const tlPoles = document.querySelectorAll('.tl-pole, .tl-gap');
tlPoles.forEach(el => {
  const delay = parseInt(el.dataset.delay || 0, 10);
  el.style.transitionDelay = `${delay}ms`;
});

const tlObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

tlPoles.forEach(el => tlObserver.observe(el));

/* ════════════════════════════════════════════════
   8. GAUGE ANIMATIONS
════════════════════════════════════════════════ */
const canvasGauges = [
  { id: 'gc0', valId: 'gv0', pct: 0.80, target: 8,  countUp: true  },
  { id: 'gc1', valId: 'gv1', pct: 0.97, target: 97, countUp: true  },
  { id: 'gc2', valId: null,  pct: 0.75, target: 3,  countUp: false }
];

function drawGaugeCanvas(canvas, fillPct) {
  const dpr  = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 180;
  if (!canvas._init) {
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';
    canvas._init = true;
  }
  const ctx   = canvas.getContext('2d');
  const cx    = canvas.width  / 2;
  const cy    = canvas.height / 2;
  const r     = (size / 2 - 16) * dpr;
  const lw    = 14 * dpr;
  const color = canvas.dataset.color || '#002D62';
  const sA    = (150 * Math.PI) / 180;
  const eA    = ((150 + 240) * Math.PI) / 180;
  const fA    = ((150 + 240 * fillPct) * Math.PI) / 180;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(cx, cy, r, sA, eA);
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth   = lw;
  ctx.lineCap     = 'round';
  ctx.stroke();

  if (fillPct > 0.005) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, sA, fA);
    ctx.strokeStyle = color;
    ctx.lineWidth   = lw;
    ctx.lineCap     = 'round';
    ctx.stroke();
  }
}

canvasGauges.forEach(g => {
  const el = document.getElementById(g.id);
  if (el) drawGaugeCanvas(el, 0);
});

let gaugesAnimated = false;
const gaugeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !gaugesAnimated) {
      gaugesAnimated = true;
      gaugeObserver.disconnect();
      runCanvasGauges();
    }
  });
}, { threshold: 0.05 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) gaugeObserver.observe(statsRow);

function runCanvasGauges() {
  canvasGauges.forEach((g, i) => {
    const canvas = document.getElementById(g.id);
    const valEl  = g.valId ? document.getElementById(g.valId) : null;
    if (!canvas) return;
    const duration = 2200;
    setTimeout(() => {
      const t0 = Date.now();
      (function tick() {
        const prog = Math.min((Date.now() - t0) / duration, 1);
        const ease = prog === 1 ? 1 : 1 - Math.pow(2, -10 * prog);
        drawGaugeCanvas(canvas, ease * g.pct);
        if (valEl && g.countUp) valEl.textContent = Math.round(ease * g.target);
        if (prog < 1) requestAnimationFrame(tick);
        else if (valEl && g.countUp) valEl.textContent = g.target;
      })();
    }, i * 350 + 100);
  });
}

/* ════════════════════════════════════════════════
   9. HERO PARALLAX — gentle, lerped
════════════════════════════════════════════════ */
const heroVisual = document.querySelector('.hero-visual');
let targetX = 0, targetY = 0, curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  if (!heroVisual) return;
  targetX = ((e.clientX / window.innerWidth)  - 0.5) * 10;
  targetY = ((e.clientY / window.innerHeight) - 0.5) * 6;
});

function animParallax() {
  curX += (targetX - curX) * 0.055;
  curY += (targetY - curY) * 0.055;
  if (heroVisual) {
    heroVisual.style.transform = `translate(${curX}px, ${curY}px)`;
  }
  requestAnimationFrame(animParallax);
}
animParallax();

/* ════════════════════════════════════════════════
   10. HERO ENTRANCE ANIMATIONS
════════════════════════════════════════════════ */
function animateIn(selector, delay, duration = 0.9) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.cssText += `opacity:0; transform:translateY(24px); transition:opacity ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`;
  setTimeout(() => {
    el.style.opacity   = '1';
    el.style.transform = 'translateY(0)';
  }, 120);
}

animateIn('.hero-badge',       0.2,  0.7);
animateIn('.hero-headline',    0.45, 1.0);
animateIn('.hero-brand-block', 0.9,  0.85);
animateIn('.trust-strip',      1.2,  0.8);
animateIn('.hero-capsule-float', 0.15, 1.0);
