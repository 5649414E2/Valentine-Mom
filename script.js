/* ============================================================
   MOM'S VALENTINE'S WEBSITE — SHARED JAVASCRIPT
   Floating petals, warm hearts, fade-in, navigation
   ============================================================ */

// ── Floating Petal Canvas ─────────────────────────────────
function initPetals() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let petals = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Warm palette — cream, rose, amber dots to suggest floating petals/dust
  const COLORS = [
    'rgba(212, 136, 154,',  // rose-soft
    'rgba(193, 127,  58,',  // amber
    'rgba(240, 208, 160,',  // amber-pale
    'rgba(242, 205, 213,',  // rose-pale
    'rgba(228, 200, 175,',  // linen
  ];

  function spawnPetal() {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = 2 + Math.random() * 5;
    return {
      x:     Math.random() * W,
      y:     -20,
      size,
      color: c,
      alpha: 0.15 + Math.random() * 0.45,
      speedY: 0.4 + Math.random() * 0.9,
      speedX: (Math.random() - 0.5) * 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.008 + Math.random() * 0.015,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.alpha;

    // Draw a soft oval petal shape
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();
    ctx.restore();
  }

  // Seed initial petals spread throughout screen
  resize();
  for (let i = 0; i < 40; i++) {
    const p = spawnPetal();
    p.y = Math.random() * H;
    petals.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Spawn new petals at top
    if (petals.length < 60 && Math.random() < 0.04) {
      petals.push(spawnPetal());
    }

    petals = petals.filter(p => p.y < H + 30);

    petals.forEach(p => {
      p.y += p.speedY;
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.4;
      p.rotation += p.rotSpeed;
      drawPetal(p);
    });

    requestAnimationFrame(animate);
  }

  animate();
  window.addEventListener('resize', resize);
}

// ── Floating Hearts ───────────────────────────────────────
const HEART_CHARS = ['♥', '❤', '💕', '💗', '🌸', '✿', '❀'];
const HEART_COLORS = ['#b56576', '#c17f3a', '#d4889a', '#d9a05a', '#e8a0a8'];

function createHeart(container, forced = false) {
  const el = document.createElement('span');
  el.classList.add('heart');
  el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];

  const size  = 0.7 + Math.random() * 1.2;
  const left  = Math.random() * 100;
  const dur   = 10 + Math.random() * 14;
  const delay = forced ? Math.random() * 3 : Math.random() * 10;
  const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];

  el.style.cssText = `
    left: ${left}%;
    font-size: ${size}rem;
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
    color: ${color};
    filter: drop-shadow(0 0 3px ${color}66);
  `;

  container.appendChild(el);
  setTimeout(() => el.remove(), (dur + delay) * 1000);
}

function initHearts(multiplier = 1) {
  const container = document.querySelector('.hearts-container');
  if (!container) return;

  for (let i = 0; i < Math.round(8 * multiplier); i++) createHeart(container, true);

  setInterval(() => {
    createHeart(container);
    if (Math.random() > 0.65) createHeart(container);
  }, Math.round(2500 / multiplier));
}

// ── Scroll Fade-In ────────────────────────────────────────
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ── Active Nav ────────────────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Page Transitions ──────────────────────────────────────
function initPageTransition() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;
  setTimeout(() => overlay.classList.remove('active'), 80);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => window.location.href = href, 550);
      });
    }
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initHearts();
  initFadeIn();
  setActiveNav();
  initPageTransition();
});
