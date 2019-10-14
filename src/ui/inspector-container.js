import uxFactory from './UxFactory.js';

/** Class representing an inspector container. */
class InspectorContainer {
  /**
   * Create an inspector container.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    this.appData = appData;
    this.pinned = false;
  }

  /**
   * The inspect method.
   * @param {any} inspectedItem - The inspectedItem param.
   */
  inspect(inspectedItem) {
    this.inspectedItem = inspectedItem;
    if (!this.domElement) return;

    if (this.inspector) {
      if (this.inspector.destroy) this.inspector.destroy();
      this.domElement.innerHTML = '';
    }
    if (this.inspectedItem) {
      this.inspector = uxFactory.constructInspector(
        inspectedItem,
        this.domElement,
        this.appData
      );
    }
  }

  /**
   * The mount method.
   * @param {any} parentElement - The parentElement param.
   */
  mount(parentElement) {
    this.parentElement = parentElement;

    const ul = document.createElement('ul');
    ul.className = 'list pa0 pr3';
    
    const liPin = document.createElement('li');

    const pinButton = document.createElement('input');
    pinButton.setAttribute('id', 'pinned');
    pinButton.setAttribute('type', 'checkbox');
    pinButton.setAttribute('tabindex', 0);
    pinButton.checked = this.pinned;
    pinButton.style.margin = '5px';

    pinButton.addEventListener('input', () => {
      this.pinned = pinButton.checked;
    });

    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', 'pinned');
    labelElem.appendChild(document.createTextNode('Pinned'));
    liPin.appendChild(labelElem);
    liPin.appendChild(pinButton);
    
    ul.appendChild(liPin);
    
    const liContents = document.createElement('li');
    this.domElement = document.createElement('div');
    liContents.appendChild(this.domElement);
    ul.appendChild(liContents);
    this.parentElement.appendChild(ul);

    // this.domElement = parentElement;
    this.domElement.innerHTML = '';
    if (this.inspectedItem) this.inspect(this.inspectedItem);

    const selectionManager = this.appData.selectionManager;
    this._selChangedId = selectionManager.leadSelectionChanged.connect(item => {
      if (!this.inspectedItem || !this.pinned) this.inspect(item);
    });
  }

  /**
   * The unMount method.
   */
  unMount() {
    this.appData.selectionManager.leadSelectionChanged.disconnectId(
      this._selChangedId
    );
    this.parentElement.innerHTML = '';
  }
}

export { InspectorContainer };
