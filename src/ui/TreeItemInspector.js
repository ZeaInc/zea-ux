import ParameterContainer from './ParameterContainer.js';
import visualiveUxFactory from './VisualiveUxFactory.js';
import StringWidget from './parameter-widgets/StringWidget.js';

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

export default class TreeItemInspector {
  constructor(treeItem, domElement, undoRedoManager) {

    const ul = document.createElement('ul');
    ul.className = 'list pa0'
    const linameWidget = document.createElement('li');
    const liparameterContainer = document.createElement('li');
    domElement.appendChild(ul);
    ul.appendChild(linameWidget);
    ul.appendChild(liparameterContainer);
  	this.nameWidget = new StringWidget(new NameParam(treeItem), linameWidget, undoRedoManager);
    this.parameterContainer = new ParameterContainer(treeItem, liparameterContainer, undoRedoManager);
  }

  destroy() {
    this.parameterContainer.destroy();
  }
}

visualiveUxFactory.registerInpector(
  TreeItemInspector,
  p => p instanceof Visualive.TreeItem
);
