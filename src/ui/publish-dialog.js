/** Class representing a publish dialog. */
class PublishDialog {
  /**
   * Create a publish dialog.
   */
  constructor() {
    this.__publishDialogHolder = document.createElement('div');
    this.__publishDialogHolder.className = 'publish-dialog-bg';
    this.__publishDialogHolder.addEventListener('mousedown', e => {
      if (e.target == this.__publishDialogHolder) this.hide();
    });
    const dialog = document.createElement('div');
    dialog.className = 'publish-dialog';

    const urlParams = new URLSearchParams(window.location.search);

    const args = new URLSearchParams();
    urlParams.forEach(function(value, key) {
      if (!key.startsWith('room-id')) {
        args.set(key, value);
      }
    });
    args.set('published', true);

    const published = false;
    const publishURL = `${window.location.origin}?${args.toString()}`;

    // ///////////////////////////////
    // Public Setting
    const isPublicDiv = document.createElement('div');
    isPublicDiv.className = 'publicToggle';
    isPublicDiv.className = 'publish-dialog-toggle';

    const isPublicCheckbox = document.createElement('input');
    isPublicCheckbox.setAttribute('type', 'checkbox');
    isPublicCheckbox.setAttribute('is', 'isPublicCheckbox');

    isPublicCheckbox.value = publishURL;
    isPublicCheckbox.addEventListener('change', e => {
      embedCodeTextarea.disabled = !isPublicCheckbox.checked;
      linkTextarea.disabled = !isPublicCheckbox.checked;
    });
    isPublicDiv.appendChild(isPublicCheckbox);

    const isPublicCheckboxLabel = document.createElement('label');
    isPublicCheckboxLabel.className = 'publish-dialog-label';
    isPublicCheckboxLabel.setAttribute('type', 'checkbox');
    isPublicCheckboxLabel.setAttribute('for', 'isPublicCheckbox');
    isPublicCheckboxLabel.textContent = 'Is Published';

    isPublicDiv.appendChild(isPublicCheckboxLabel);
    dialog.appendChild(isPublicDiv);

    // ///////////////////////////////
    // link

    const linkTextarea = document.createElement('textarea');
    linkTextarea.className = 'embedcode';
    linkTextarea.className = 'publish-dialog-link';
    linkTextarea.setAttribute('rows', 2);
    linkTextarea.setAttribute('cols', 30);
    linkTextarea.setAttribute('readonly', 'readonly');

    linkTextarea.value = publishURL;
    linkTextarea.disabled = !published;
    dialog.appendChild(linkTextarea);

    // ///////////////////////////////
    // embedcode

    const embedCodeTextarea = document.createElement('textarea');
    embedCodeTextarea.className = 'embedcode';
    embedCodeTextarea.className = 'publish-dialog-embedcode';
    embedCodeTextarea.setAttribute('rows', 5);
    embedCodeTextarea.setAttribute('cols', 30);
    embedCodeTextarea.setAttribute('readonly', 'readonly');
    embedCodeTextarea.disabled = !published;

    embedCodeTextarea.value = `<iframe src="${publishURL}" width="640" height="360" frameborder="0" allow="webvr;webxr;fullscreen" allowfullscreen></iframe>`;
    dialog.appendChild(embedCodeTextarea);

    this.__publishDialogHolder.appendChild(dialog);
    document.body.appendChild(this.__publishDialogHolder);
    this.visible = false;
  }

  /**
   * The show method.
   */
  show() {
    this.__publishDialogHolder.style.display = 'block';
    this.visible = true;
  }

  /**
   * The hide method.
   */
  hide() {
    this.__publishDialogHolder.style.display = 'none';
    this.visible = false;
  }
}

export { PublishDialog };
