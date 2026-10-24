(() => {
  const cardLinks = document.querySelectorAll('.links a[title]');
  if (!cardLinks.length || typeof HTMLDialogElement === 'undefined') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'link-info-dialog';
  dialog.id = 'link-info-dialog';
  dialog.setAttribute('aria-labelledby', 'link-info-heading');
  dialog.setAttribute('aria-describedby', 'link-info-description');

  const header = document.createElement('div');
  header.className = 'link-info-dialog__header';

  const heading = document.createElement('h2');
  heading.id = 'link-info-heading';
  heading.textContent = 'リンクの説明';

  const closeButton = document.createElement('button');
  closeButton.className = 'link-info-dialog__close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', '閉じる');
  closeButton.textContent = '×';

  const description = document.createElement('p');
  description.id = 'link-info-description';

  header.append(heading, closeButton);
  dialog.append(header, description);
  document.body.append(dialog);

  let activeInfoButton = null;

  cardLinks.forEach((link) => {
    const text = link.querySelector('.link-title')?.textContent.trim()
      || link.textContent.trim();
    const button = document.createElement('button');
    button.className = 'link-info-button';
    button.type = 'button';
    button.textContent = 'i';
    button.setAttribute('aria-label', `${text}の説明を表示`);
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      description.textContent = link.getAttribute('title').trim();
      activeInfoButton = button;
      button.setAttribute('aria-expanded', 'true');
      dialog.showModal();
      closeButton.focus();
    });

    link.parentElement.append(button);
  });

  closeButton.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    if (!activeInfoButton) return;
    activeInfoButton.setAttribute('aria-expanded', 'false');
    activeInfoButton.focus();
    activeInfoButton = null;
  });
})();
