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
  const track   = document.querySelector('.porque__track');
  const cards   = document.querySelectorAll('.porque__card');
  const dots    = document.querySelectorAll('.porque__dot');
  const prevBtn = document.querySelector('.porque__arrow--prev');
  const nextBtn = document.querySelector('.porque__arrow--next');
  if (!track || !cards.length) return;

  let current = 0;
  let timer = null;
  let paused = false;
  let resumeTimer = null;
  let syncing = false;

  function getVisible() {
    return window.innerWidth <= 1020 ? 1 : 2;
  }

  function getStep() {
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function maxIndex() {
    return Math.max(0, cards.length - getVisible());
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    syncing = true;
    track.scrollTo({ left: current * getStep(), behavior: 'smooth' });
    updateDots();
    setTimeout(() => { syncing = false; }, 500);
  }

  function next() {
    goTo(current >= maxIndex() ? 0 : current + 1);
  }

  function prev() {
    goTo(current <= 0 ? maxIndex() : current - 1);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => { if (!paused) next(); }, 3000);
  }

  function pauseAndResume() {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; }, 4000);
  }

  // Setas (desktop)
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); pauseAndResume(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); pauseAndResume(); });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(+dot.dataset.index);
      pauseAndResume();
    });
  });

  // Swipe nativo (mobile) - sincroniza os dots com a posição do scroll
  let scrollTimeout = null;
  track.addEventListener('scroll', () => {
    pauseAndResume();
    if (syncing) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const step = getStep();
      current = Math.round(track.scrollLeft / step);
      current = Math.max(0, Math.min(current, maxIndex()));
      updateDots();
    }, 100);
  }, { passive: true });

  // Aba em segundo plano
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
  });

  // Resize recalcula posição
  window.addEventListener('resize', () => goTo(current));

  goTo(0);
  startAuto();
})();