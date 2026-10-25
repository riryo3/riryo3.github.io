(() => {
  document.querySelectorAll('.links a').forEach((link) => {
    const icon = link.querySelector('.link-icon');
    const content = link.querySelector('.link-content');
    if (!icon || !content) return;

    let startX = 0;
    let dx = 0;
    let max = 0;
    let gap = 0;
    let dragging = false;
    let moved = false;
    let frame = 0;

    const setOffset = (x) => {
      dx = Math.max(0, Math.min(max, x));
      icon.style.transform = `translateX(${dx}px)`;
      content.style.clipPath = `inset(0 0 0 ${Math.max(0, dx - gap)}px)`;
    };

    const slideBack = () => {
      const from = dx;
      const began = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - began) / 450);
        setOffset(from * (1 - (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    link.addEventListener('dragstart', (event) => event.preventDefault());

    icon.addEventListener('pointerdown', (event) => {
      cancelAnimationFrame(frame);
      dragging = true;
      moved = false;
      startX = event.clientX - dx;
      gap = content.offsetLeft - (icon.offsetLeft + icon.offsetWidth);
      max = link.clientWidth - icon.offsetLeft - icon.offsetWidth - 8;
      icon.setPointerCapture(event.pointerId);
    });

    icon.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      if (Math.abs(event.clientX - startX - dx) > 4 || dx > 4) moved = true;
      setOffset(event.clientX - startX);
    });

    const release = () => {
      if (!dragging) return;
      dragging = false;
      slideBack();
    };
    icon.addEventListener('pointerup', release);
    icon.addEventListener('pointercancel', release);

    link.addEventListener('click', (event) => {
      if (moved) event.preventDefault();
      moved = false;
    });

    window.addEventListener('pageshow', () => {
      cancelAnimationFrame(frame);
      dragging = false;
      moved = false;
      setOffset(0);
    });
  });
})();
