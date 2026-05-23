// ===== STARTUPFORGE MAIN JS =====

// --- Matrix Rain ---
function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()[]{}<>/\\|;:.,?!アイウエオカキクケコ';
  const fontSize = 13;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = Array(cols).fill(1);
  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px Share Tech Mono, monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(draw, 60);
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// --- Preloader ---
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.5s';
      setTimeout(() => preloader.remove(), 500);
    }
  }, 2200);
  initMatrix();
});

// --- Navbar scroll effect ---
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// --- Mobile nav toggle ---
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));

  // Animate on scroll
  const animElems = document.querySelectorAll('.animate-in');
  const animObserver = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        animObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  animElems.forEach(el => animObserver.observe(el));

  // Demand bars animation
  const demandBars = document.querySelectorAll('.demand-fill');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const val = el.getAttribute('data-width');
        el.style.width = val + '%';
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  demandBars.forEach(b => barObserver.observe(b));

  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  const cObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        cObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObserver.observe(c));

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.filter-group');
      group.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      const grid = document.querySelector(tab.closest('.filter-group').getAttribute('data-target'));
      if (grid) {
        grid.querySelectorAll('[data-category]').forEach(card => {
          const show = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = show ? '' : 'none';
        });
      }
    });
  });

  // Search functionality
  const searchInputs = document.querySelectorAll('.scheme-search');
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      const grid = document.getElementById(input.getAttribute('data-target'));
      if (!grid) return;
      grid.querySelectorAll('.scheme-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  });
});

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  function update(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = eased * target;
    el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// --- Typewriter effect ---
function typeWriter(el, text, speed = 40) {
  let i = 0;
  el.textContent = '';
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile nav
    const navLinks = document.getElementById('nav-links');
    if (navLinks) navLinks.classList.remove('mobile-open');
  });
});