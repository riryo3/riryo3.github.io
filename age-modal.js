(() => {
  const footer = document.querySelector('footer');
  if (!footer || typeof HTMLDialogElement === 'undefined') return;

  const isEn = document.documentElement.lang === 'en';
  const born = Date.UTC(2026, 9, 22, 7, 45);
  const days = Math.max(0, Math.floor((Date.now() - born) / 86400000));

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'footer-age';
  trigger.textContent = footer.textContent.trim();
  trigger.setAttribute('aria-haspopup', 'dialog');
  footer.textContent = '';
  footer.append(trigger);

  const dialog = document.createElement('dialog');
  dialog.className = 'link-info-dialog';
  dialog.setAttribute('aria-labelledby', 'age-heading');

  const header = document.createElement('div');
  header.className = 'link-info-dialog__header';

  const heading = document.createElement('h2');
  heading.id = 'age-heading';
  heading.textContent = isEn ? 'Age of this page' : 'このページの年齢';

  const closeButton = document.createElement('button');
  closeButton.className = 'link-info-dialog__close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', isEn ? 'Close' : '閉じる');
  closeButton.textContent = '×';

  const message = document.createElement('p');
  message.textContent = isEn
    ? `This page is ${days} ${days === 1 ? 'day' : 'days'} old.`
    : `このページができて、${days}日が経ちました。`;

  header.append(heading, closeButton);
  dialog.append(header, message);
  document.body.append(dialog);

  let usedKeyboard = false;

  trigger.addEventListener('click', (event) => {
    usedKeyboard = event.detail === 0;
    dialog.showModal();
    if (usedKeyboard) closeButton.focus();
    else closeButton.blur();
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (usedKeyboard) trigger.focus();
  });
})();
