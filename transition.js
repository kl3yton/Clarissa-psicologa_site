const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('is-open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('is-open');
  });
});

document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('is-open');
  }
});

// FAQ accordion
document.querySelectorAll('.faq__pergunta').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    // fecha todos
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    // abre o clicado se estava fechado
    if (!isOpen) item.classList.add('open');
  });
});

// Carousel - Por que escolher
(function () {
  const track = document.querySelector('.porque__track');
  const cards = document.querySelectorAll('.porque__card');
  const dots  = document.querySelectorAll('.porque__dot');
  if (!track || !cards.length) return;

  let current = 0;
  let timer   = null;
  let paused  = false;
  let resumeTimer = null;

  function getVisible() {
    return window.innerWidth <= 1020 ? 1 : 2;
  }

  function goTo(index) {
    const visible = getVisible();
    const max = cards.length - visible;
    current = Math.max(0, Math.min(index, max));
    const cardW = cards[0].getBoundingClientRect().width;
    const gap   = 24;
    track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() {
    const visible = getVisible();
    const max = cards.length - visible;
    goTo(current >= max ? 0 : current + 1);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => { if (!paused) next(); }, 3000);
  }

  function pauseAndResume() {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; }, 3000);
  }

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(+dot.dataset.index);
      pauseAndResume();
    });
  });

  // Touch / drag
  let startX = 0;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    pauseAndResume();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : goTo(current - 1);
  });

  // Scroll na página pausa
  window.addEventListener('scroll', pauseAndResume, { passive: true });

  // Aba em segundo plano
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
  });

  // Resize recalcula posição
  window.addEventListener('resize', () => goTo(current));

  goTo(0);
  startAuto();
})();