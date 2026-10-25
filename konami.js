(() => {
  if (typeof HTMLDialogElement === 'undefined') return;

  const isEn = document.documentElement.lang === 'en';
  const STEP = 56;
  const ARROWS = ['U', 'U', 'D', 'D', 'L', 'R', 'L', 'R'];
  const FULL = [...ARROWS, 'B', 'A'];
  const KEYS = {
    ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R',
    b: 'B', B: 'B', a: 'A', A: 'A',
  };

  let buffer = [];
  let pad = null;
  let padTimer = 0;

  const endsWith = (list) =>
    buffer.length >= list.length &&
    list.every((token, i) => buffer[buffer.length - list.length + i] === token);

  const hidePad = () => {
    clearTimeout(padTimer);
    if (pad) pad.hidden = true;
  };

  const showMessage = () => {
    hidePad();
    buffer = [];
    const dialog = document.createElement('dialog');
    dialog.className = 'link-info-dialog';
    dialog.setAttribute('aria-labelledby', 'konami-heading');
    const header = document.createElement('div');
    header.className = 'link-info-dialog__header';
    const heading = document.createElement('h2');
    heading.id = 'konami-heading';
    heading.textContent = isEn ? 'Command accepted!' : 'コマンド成功！';
    const close = document.createElement('button');
    close.className = 'link-info-dialog__close';
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', isEn ? 'Close' : '閉じる');
    const text = document.createElement('p');
    text.textContent = isEn
      ? 'You found the secret. Have a 1UP!'
      : 'ひみつを見つけてくれて、ありがとう。1UP！';
    header.append(heading, close);
    dialog.append(header, text);
    document.body.append(dialog);
    const dispose = () => dialog.remove();
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', dispose);
    dialog.showModal();
    close.blur();
  };

  const buildPad = () => {
    pad = document.createElement('div');
    pad.className = 'konami-pad';
    pad.hidden = true;
    ['B', 'A'].forEach((name) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = name;
      button.setAttribute('aria-label', name);
      button.addEventListener('click', () => push(name));
      pad.append(button);
    });
    document.body.append(pad);
  };

  const showPad = () => {
    if (!pad) buildPad();
    pad.hidden = false;
    clearTimeout(padTimer);
    padTimer = setTimeout(hidePad, 15000);
  };

  const push = (token) => {
    buffer.push(token);
    if (buffer.length > FULL.length) buffer.shift();
    if (endsWith(FULL)) showMessage();
    else if (endsWith(ARROWS)) showPad();
  };

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
    const token = KEYS[event.key];
    if (token) push(token);
  });

  let ox = 0;
  let oy = 0;
  let tracking = false;

  const begin = (x, y) => {
    ox = x;
    oy = y;
    tracking = true;
  };

  const move = (x, y) => {
    if (!tracking) return;
    const dx = x - ox;
    const dy = y - oy;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const distance = horizontal ? Math.abs(dx) : Math.abs(dy);
    const steps = Math.floor(distance / STEP);
    if (!steps) return;
    const sign = (horizontal ? dx : dy) > 0 ? 1 : -1;
    const token = horizontal ? (sign > 0 ? 'R' : 'L') : (sign > 0 ? 'D' : 'U');
    for (let i = 0; i < steps; i += 1) push(token);
    if (horizontal) ox += sign * steps * STEP;
    else oy += sign * steps * STEP;
    if (horizontal) oy = y;
    else ox = x;
  };

  document.addEventListener('mousedown', (event) => {
    if (event.button === 0 && !event.target.closest?.('.konami-pad')) begin(event.clientX, event.clientY);
  });
  document.addEventListener('mousemove', (event) => move(event.clientX, event.clientY));
  document.addEventListener('mouseup', () => { tracking = false; });

  const touchOptions = { passive: true };
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1 || event.target.closest?.('.konami-pad')) return;
    begin(event.touches[0].clientX, event.touches[0].clientY);
  }, touchOptions);
  document.addEventListener('touchmove', (event) => {
    if (event.touches.length === 1) move(event.touches[0].clientX, event.touches[0].clientY);
  }, touchOptions);
  document.addEventListener('touchend', () => { tracking = false; }, touchOptions);
  document.addEventListener('touchcancel', () => { tracking = false; }, touchOptions);
})();
