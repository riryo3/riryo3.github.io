(() => {
  const trigger = document.querySelector('.avatar-button');
  const dialog = document.querySelector('.profile-image-dialog');
  if (!trigger || !dialog || typeof dialog.showModal !== 'function') return;

  const closeButton = dialog.querySelector('.profile-image-dialog__close');
  trigger.addEventListener('click', () => {
    if (!dialog.open) dialog.showModal();
    closeButton.focus();
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => trigger.focus());
})();
