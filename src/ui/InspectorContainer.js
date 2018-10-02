import visualiveUxFactory from './VisualiveUxFactory';

class InspectorContainer {
  constructor(domElement) {
    this.domElement = domElement;
  }

  inspect(baseItem) {
    if (this.inspector) {
      this.inspector.destroy();
    }

    this.inspector = visualiveUxFactory.constructInspector(
      baseItem,
      this.domElement
    );
  }
}

export default InspectorContainer;
