import ParameterContainer from './ParameterContainer';
import visualiveUxFactory from './VisualiveUxFactory';

class TreeItemInspector {
  constructor(treeItem, domElement) {
    this.parameterContainer = new ParameterContainer(treeItem, domElement);
  }

  destroy() {
    this.parameterContainer.destroy();
  }
}

visualiveUxFactory.registerInpector(
  TreeItemInspector,
  p => p instanceof Visualive.TreeItem
);
