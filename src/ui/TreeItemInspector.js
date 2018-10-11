import ParameterContainer from './ParameterContainer';
import visualiveUxFactory from './VisualiveUxFactory';
import StringWidget from './parameter-widgets/StringWidget';

class NameParam {
  constructor(treeItem) {
    this._treeItem = treeItem;
    this.valueChanged = treeItem.nameChanged;
  }

  getName() {
  	return "Name"
  }

  getValue() {
    return this._treeItem.getName();
  }

  setValue(name) {
    return this._treeItem.setName(name);
  }
}

class TreeItemInspector {
  constructor(treeItem, domElement, undoRedoManager) {
  	// this.nameWidget = new StringWidget(new NameParam(treeItem), domElement, undoRedoManager);
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
