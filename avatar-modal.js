(() => {
  const trigger = document.querySelector('.avatar-button');
  const dialog = document.querySelector('.profile-image-dialog');
  if (!trigger || !dialog || typeof dialog.showModal !== 'function') return;

  const closeButton = dialog.querySelector('.profile-image-dialog__close');
  let usedKeyboard = false;
  trigger.addEventListener('click', (event) => {
    usedKeyboard = event.detail === 0;
    if (!dialog.open) dialog.showModal();
    if (usedKeyboard) closeButton.focus();
    else closeButton.blur();
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => { if (usedKeyboard) trigger.focus(); });
})();
