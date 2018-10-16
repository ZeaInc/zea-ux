import visualiveUxFactory from './VisualiveUxFactory.js';

class InspectorContainer {
  constructor(domElement, appData) {
    this.domElement = domElement;
    this.domElement.innerHTML = '';
    this.appData = appData;
    this._selChangedId = this.appData.selectionManager.leadSelectionChanged.connect(selectedTreeItem => {
      // console.log(
      //   'leadSelectionChange:',
      //   selectedTreeItem ? selectedTreeItem.getName() : 'None'
      // );
      // TODO:
      this.inspect(selectedTreeItem);
    });
  }

  inspect(baseItem) {
    if (this.inspector) {
      this.inspector.destroy();
      this.domElement.innerHTML = '';
    }
    if(baseItem) {
      this.inspector = visualiveUxFactory.constructInspector(
        baseItem,
        this.domElement,
        this.appData.undoRedoManager
      );
    }
  }

  unMount(){
    this.appData.selectionManager.leadSelectionChanged.disconnectID(this._selChangedId);
    this.domElement.innerHTML = '';
  }
}

export default InspectorContainer;
