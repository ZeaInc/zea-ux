import visualiveUxFactory from './VisualiveUxFactory.js';
import undoRedoManager from '../undoredo/UndoRedoManager.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

class TreeItemElement {
  constructor(treeItem, parentDomElement, undoRedoManager, expanded = false) {
    this.treeItem = treeItem;
    this.parentDomElement = parentDomElement;
    this.undoRedoManager = undoRedoManager;

    this.li = document.createElement('li');
    this.li.className = 'TreeNodesListItem';

    this.expandBtn = document.createElement('button');
    this.expandBtn.className = 'TreeNodesListItem__ToggleExpanded';
    this.li.appendChild(this.expandBtn);

    // Visibility toggle.
    this.toggleVisibilityBtn = document.createElement('button');
    this.toggleVisibilityBtn.className = 'TreeNodesListItem__ToggleVisibility';
    this.li.appendChild(this.toggleVisibilityBtn);
    this.toggleVisibilityBtn.innerHTML =
      '<i class="material-icons md-15">visibility</i>';

    const visibleParam = this.treeItem.getParameter('Visible');

    this.toggleVisibilityBtn.addEventListener('click', () => {
      const change = new ParameterValueChange(visibleParam);
      change.setValue(!visibleParam.getValue());
      undoRedoManager.addChange(change);
    });

    const updateVisibility = () => {
      const visible = visibleParam.getValue();
      visible
        ? this.li.classList.remove('TreeNodesListItem--isHidden')
        : this.li.classList.add('TreeNodesListItem--isHidden');
    }
    visibleParam.valueChanged.connect(updateVisibility);
    updateVisibility();



    // Title element.
    this.titleElement = document.createElement('span');
    this.titleElement.className = 'TreeNodesListItem__Title';
    this.titleElement.textContent = treeItem.getName();
    this.li.appendChild(this.titleElement);

    const selectedParam = this.treeItem.getParameter('Selected');

    this.titleElement.addEventListener('click', () => {
      const change = new ParameterValueChange(selectedParam);
      change.setValue(!selectedParam.getValue());
      undoRedoManager.addChange(change);
    });

    const updateSelected = ()=>{
      const selected = selectedParam.getValue();
      selected
        ? this.li.classList.add('TreeNodesListItem--isSelected')
        : this.li.classList.remove('TreeNodesListItem--isSelected');
    }
    selectedParam.valueChanged.connect(updateSelected);
    updateSelected()

    this.parentDomElement.appendChild(this.li);

    this.ul = document.createElement('ul');
    this.ul.className = 'TreeNodesList';
    this.li.appendChild(this.ul);

    this.childElements = [];
    this._expanded = false;

    if (expanded) {
      this.expand();
    } else {
      const children = this.treeItem.getChildren();
      if (children.length > 0)
        this.collapse();
    }

    this.expandBtn.addEventListener('click', () => {
      if (this.treeItem.numChildren() > 0) {
        this._expanded ? this.collapse() : this.expand();
      }
    });

    this.treeItem.childAdded.connect((childItem, index) => {
      this.addChild(childItem);
    });

    this.treeItem.childRemoved.connect((childItem, index) => {});
  }

  addComponent(component) {

    if(!this.subul) {
      this.subul = document.createElement('ul');
      // this.subul.className = 'TreeNodesList';
      this.titleElement.appendChild(this.subul);
    }

    // Title element.
    const li = document.createElement('li');
    li.className = 'TreeNodesListItem';
    const nameElement = document.createElement('span');
    nameElement.className = 'TreeNodesListItem__Title';
    nameElement.textContent = component;
    li.appendChild(nameElement);
    this.subul.appendChild(li);
  }

  addChild(treeItem, expanded = false) {
    if(this._expanded) {
      const childTreeItem = visualiveUxFactory.constructTreeItemElement(
        treeItem,
        this.ul,
        this.undoRedoManager,
        expanded
      );
      this.childElements.push(childTreeItem);
    }
    else {
      this.collapse();
    }
  }

  expand() {
    this._expanded = true;
    this.ul.classList.remove('TreeNodesList--collapsed');
    this.expandBtn.innerHTML =
      '<i class="material-icons md-24">arrow_drop_down</i>';

    if (!this.childrenAlreadyCreated) {
      const children = this.treeItem.getChildren();
      for (let child of children) {
        this.addChild(child);
      }
      this.childrenAlreadyCreated = true;
    }
  }

  collapse() {
    this.ul.classList.add('TreeNodesList--collapsed');
    this.expandBtn.innerHTML =
      '<i class="material-icons md-24">arrow_right</i>';
    this._expanded = false;
  }
}

visualiveUxFactory.registerTreeItemElement(
  TreeItemElement,
  p => p instanceof Visualive.TreeItem
);

class GeomItemElement extends TreeItemElement {
  constructor(treeItem, parentDomElement, undoRedoManager, expanded = false) {
    super(treeItem, parentDomElement, undoRedoManager, expanded);

    // this.addComponent('material')
    // this.addComponent('geometry')
  }
}

visualiveUxFactory.registerTreeItemElement(
  GeomItemElement,
  p => p instanceof Visualive.GeomItem
);

class SceneTreeView {
  constructor(parentDomElement, rootTreeItem, undoRedoManager) {
    this.parentDomElement = parentDomElement;
    this.undoRedoManager = undoRedoManager;

    this.ul = document.createElement('ul');
    this.ul.className = 'TreeNodesList TreeNodesList--root';

    this.parentDomElement.appendChild(this.ul);

    this.rootElement = new TreeItemElement(rootTreeItem, this.ul, undoRedoManager, true);
  }

  getDomElement() {
    return this.container;
  }
}

export default SceneTreeView;
