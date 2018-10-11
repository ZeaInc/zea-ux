import ParameterContainer from './ParameterContainer';
import visualiveUxFactory from './VisualiveUxFactory';

class TreeItemInspector {
  constructor(treeItem, domElement, undoRedoManager) {
    this.parameterContainer = new ParameterContainer(treeItem, domElement, undoRedoManager);
  }

  destroy() {
    this.parameterContainer.destroy();
  }
}

visualiveUxFactory.registerInpector(
  TreeItemInspector,
  p => p instanceof Visualive.TreeItem
);
