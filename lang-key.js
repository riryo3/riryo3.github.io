(() => {
  const isEn = document.documentElement.lang === 'en';
  const page = location.pathname.split('/').pop();
  const file = page && page.endsWith('.html') ? page : '';
  const target = isEn ? `../${file}` : `en/${file}`;

  document.addEventListener('keydown', (event) => {
    if (event.key !== '9' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest('input, textarea, select, [contenteditable]')) return;
    location.href = target;
  });

  const link = document.querySelector('.lang-key');
  const knob = link && link.querySelector('.lang-key__num');
  if (!knob) return;

  link.addEventListener('dragstart', (event) => event.preventDefault());

  let startX = 0;
  let dx = 0;
  let max = 0;
  let dragging = false;
  let moved = false;

  const setOffset = (x) => {
    dx = Math.max(0, Math.min(max, x));
    link.style.setProperty('--slide', `${dx}px`);
    link.style.setProperty('--progress', max ? dx / max : 0);
  };

  knob.addEventListener('pointerdown', (event) => {
    dragging = true;
    moved = false;
    startX = event.clientX;
    max = link.clientWidth - knob.offsetWidth - 8;
    link.classList.add('is-sliding');
    knob.setPointerCapture(event.pointerId);
  });

  knob.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    if (Math.abs(event.clientX - startX) > 4) moved = true;
    setOffset(event.clientX - startX);
  });

  const release = () => {
    if (!dragging) return;
    dragging = false;
    link.classList.remove('is-sliding');
    if (moved && dx >= max * 0.85) {
      setOffset(max);
      link.classList.add('is-leaving');
      setTimeout(() => {
        resetInstantly();
        location.href = target;
      }, 180);
    } else {
      setOffset(0);
    }
  };
  knob.addEventListener('pointerup', release);
  knob.addEventListener('pointercancel', release);

  const resetInstantly = () => {
    dragging = false;
    moved = false;
    link.classList.add('is-sliding');
    setOffset(0);
    link.offsetWidth;
    link.classList.remove('is-sliding');
  };
  window.addEventListener('pagehide', resetInstantly);
  window.addEventListener('pageshow', () => {
    resetInstantly();
    link.classList.remove('is-leaving');
  });

  link.addEventListener('click', (event) => {
    if (moved) event.preventDefault();
    moved = false;
  });
})();
