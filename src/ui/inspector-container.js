import uxFactory from './UxFactory.js';

/** Class representing an inspector container. */
class InspectorContainer {
  /**
   * Create an inspector container.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    this.appData = appData;

    if (this.appData.selectionManager.leadSelection) {
      this.inspect(this.appData.selectionManager.leadSelection);
    }
    this._selChangedId = this.appData.selectionManager.leadSelectionChanged.connect(
      selectedTreeItem => {
        // console.log(
        //   'leadSelectionChange:',
        //   selectedTreeItem ? selectedTreeItem.getName() : 'None'
        // );
        // TODO:
        this.inspect(selectedTreeItem);
      }
    );
  }

  /**
   * The inspect method.
   * @param {any} inspectedItem - The inspectedItem param.
   */
  inspect(inspectedItem) {
    this.inspectedItem = inspectedItem;
    if (!this.domElement) return;

    if (this.inspector) {
      this.inspector.destroy();
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
    this.domElement = parentElement;
    this.domElement.innerHTML = '';
    if (this.inspectedItem) this.inspect(this.inspectedItem);
  }

  /**
   * The unMount method.
   */
  unMount() {
    this.appData.selectionManager.leadSelectionChanged.disconnectId(
      this._selChangedId
    );
    this.domElement.innerHTML = '';
  }
}

export { InspectorContainer };
