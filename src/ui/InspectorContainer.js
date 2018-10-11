import visualiveUxFactory from './VisualiveUxFactory.js';

class InspectorContainer {
  constructor(domElement, undoRedoManager) {
    this.domElement = domElement;
    this.domElement.innerHTML = '';
    this.undoRedoManager = undoRedoManager;
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
        this.undoRedoManager
      );
    }
  }
}

export default InspectorContainer;
