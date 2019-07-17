import visualiveUxFactory from './VisualiveUxFactory.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';


class TreeItemElement {
  constructor(treeItem, parentDomElement, appData, expanded = false) {
    this.treeItem = treeItem;
    this.parentDomElement = parentDomElement;
    this.appData = appData;

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


    this.toggleVisibilityBtn.addEventListener('click', () => {
      const visibleParam = this.treeItem.getParameter('Visible');
      const change = new ParameterValueChange(visibleParam, !visibleParam.getValue());
      this.appData.undoRedoManager.addChange(change);
    });



    const updateVisibility = () => {
      const visible = this.treeItem.getVisible();
      visible
        ? this.li.classList.remove('TreeNodesListItem--isHidden')
        : this.li.classList.add('TreeNodesListItem--isHidden');
    }
    this.treeItem.visibilityChanged.connect(updateVisibility);
    updateVisibility();



    // Title element.
    this.titleElement = document.createElement('span');
    this.titleElement.className = 'TreeNodesListItem__Title';
    this.titleElement.textContent = treeItem.getName();
    const updateName = () => {
      this.titleElement.textContent = treeItem.getName();
    }
    this.treeItem.nameChanged.connect(updateVisibility);
    
    this.li.appendChild(this.titleElement);

    const selectedParam = this.treeItem.getParameter('Selected');

    this.titleElement.addEventListener('click', (e) => {
      appData.selectionManager.toggleItemSelection(this.treeItem, !e.ctrlKey);
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

    this.treeItem.childRemoved.connect((childItem, index) => {
      this.childElements[index].destroy();
      this.childElements.splice(index, 1);
    });

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
        this.appData,
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

  destroy() {
    this.parentDomElement.removeChild(this.li);
  }
}

visualiveUxFactory.registerTreeItemElement(
  TreeItemElement,
  p => p instanceof Visualive.TreeItem
);

class GeomItemElement extends TreeItemElement {
  constructor(treeItem, parentDomElement, appData, expanded = false) {
    super(treeItem, parentDomElement, appData, expanded);

    // this.addComponent('material')
    // this.addComponent('geometry')
  }
}

visualiveUxFactory.registerTreeItemElement(
  GeomItemElement,
  p => p instanceof Visualive.GeomItem
);

class SceneTreeView {
  constructor(rootTreeItem, appData) {
    this.appData = appData;

    this.ul = document.createElement('ul');
    this.ul.className = 'TreeNodesList TreeNodesList--root';


    this.rootElement = new TreeItemElement(rootTreeItem, this.ul, appData, true);
  }

  getDomElement() {
    return this.container;
  }


  mount(parentElement) {
    this.parentDomElement = parentElement;
    this.parentDomElement.appendChild(this.ul);
  }

  unMount(parentElement) {
    this.parentDomElement.removeChild(this.ul);
  }
}

export {
  SceneTreeView
} ;
