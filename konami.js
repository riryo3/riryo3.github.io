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
    dialog.className = isEn ? 'link-info-dialog nes' : 'link-info-dialog famicom';
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
    pad.className = isEn ? 'konami-pad nes' : 'konami-pad famicom';
    pad.hidden = true;
    ['B', 'A'].forEach((name) => {
      const key = document.createElement('div');
      key.className = 'konami-key';
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', name);
      const label = document.createElement('span');
      label.className = 'konami-key__label';
      label.textContent = name;
      label.setAttribute('aria-hidden', 'true');
      key.append(label);
      button.addEventListener('click', () => push(name));
      key.append(button);
      pad.append(key);
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

  let tracking = false;
  const axisX = { o: 0, ext: 0, dir: 0 };
  const axisY = { o: 0, ext: 0, dir: 0 };

  const reset = (axis, v) => {
    axis.o = v;
    axis.ext = v;
    axis.dir = 0;
  };

  const follow = (axis, v) => {
    if (axis.dir === 0) {
      if (Math.abs(v - axis.o) >= 12) {
        axis.dir = Math.sign(v - axis.o);
        axis.ext = v;
      }
    } else if ((v - axis.ext) * axis.dir > 0) {
      axis.ext = v;
    } else if (Math.abs(v - axis.ext) >= 24) {
      axis.o = axis.ext;
      axis.dir = -axis.dir;
      axis.ext = v;
    }
  };

  const begin = (x, y) => {
    reset(axisX, x);
    reset(axisY, y);
    tracking = true;
  };

  const move = (x, y) => {
    if (!tracking) return;
    follow(axisX, x);
    follow(axisY, y);
    const dx = x - axisX.o;
    const dy = y - axisY.o;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const axis = horizontal ? axisX : axisY;
    const delta = horizontal ? dx : dy;
    const steps = Math.floor(Math.abs(delta) / STEP);
    if (!steps) return;
    const sign = delta > 0 ? 1 : -1;
    const token = horizontal ? (sign > 0 ? 'R' : 'L') : (sign > 0 ? 'D' : 'U');
    for (let i = 0; i < steps; i += 1) push(token);
    axis.o += sign * steps * STEP;
    axis.ext = Math.max(axis.ext * sign, axis.o * sign) * sign;
    reset(horizontal ? axisY : axisX, horizontal ? y : x);
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
