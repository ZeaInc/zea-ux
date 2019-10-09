import uxFactory from './UxFactory.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/** Class representing a tree item element. */
class TreeItemElement {
  /**
   * Create a tree item element.
   * @param {any} treeItem - The treeItem value.
   * @param {any} parentDomElement - The parentDomElement value.
   * @param {any} appData - The appData value.
   * @param {boolean} expanded - The expanded value.
   */
  constructor(treeItem, parentDomElement, appData, expanded = false) {
    this.treeItem = treeItem;
    this.parentDomElement = parentDomElement;
    this.appData = appData;

    this.li = document.createElement('li');
    this.li.className = 'TreeNodesListItem';

    this.expandBtn = document.createElement('button');
    this.expandBtn.className = 'TreeNodesListItem__ToggleExpanded';
    this.li.appendChild(this.expandBtn);

    if (treeItem instanceof ZeaEngine.TreeItem) {
      // Visibility toggle.
      this.toggleVisibilityBtn = document.createElement('button');
      this.toggleVisibilityBtn.className = 'TreeNodesListItem__ToggleVisibility';
      this.li.appendChild(this.toggleVisibilityBtn);
      this.toggleVisibilityBtn.innerHTML =
        '<i class="material-icons md-15">visibility</i>';

      this.toggleVisibilityBtn.addEventListener('click', () => {
        const visibleParam = this.treeItem.getParameter('Visible');
        const change = new ParameterValueChange(
          visibleParam,
          !visibleParam.getValue()
        );
        this.appData.undoRedoManager.addChange(change);
      });

      const updateVisibility = () => {
        const visible = this.treeItem.getVisible();
        visible
          ? this.li.classList.remove('TreeNodesListItem--isHidden')
          : this.li.classList.add('TreeNodesListItem--isHidden');
      };
      this.treeItem.visibilityChanged.connect(updateVisibility);
      updateVisibility();
    }

    // Title element.
    this.titleElement = document.createElement('span');
    this.titleElement.className = 'TreeNodesListItem__Title';
    this.titleElement.textContent = treeItem.getName();
    const updateName = () => {
      this.titleElement.textContent = treeItem.getName();
    };
    this.treeItem.nameChanged.connect(updateName);

    this.li.appendChild(this.titleElement);

    this.titleElement.addEventListener('click', e => {
      if (appData.selectionManager.pickingModeActive()) {
        appData.selectionManager.pick(this.treeItem);
        return;
      }

      appData.selectionManager.toggleItemSelection(this.treeItem, !e.ctrlKey);
    });

    const updateSelected = () => {
      const selected = this.treeItem.getSelected();
      selected
        ? this.li.classList.add('TreeNodesListItem--isSelected')
        : this.li.classList.remove('TreeNodesListItem--isSelected');
    };
    this.treeItem.selectedChanged.connect(updateSelected);
    updateSelected();

    if (treeItem instanceof ZeaEngine.TreeItem) {
      const updateHighlight = () => {
        const hilighted = this.treeItem.isHighlighted();
        hilighted
          ? this.li.classList.add('TreeNodesListItem--isHighlighted')
          : this.li.classList.remove('TreeNodesListItem--isHighlighted');
        if (hilighted) {
          this.titleElement.style[
            'border-color'
          ] = this.treeItem.getHighlight().toHex();
        }
      };
      this.treeItem.highlightChanged.connect(updateHighlight);
      updateHighlight();
    }
    
    this.parentDomElement.appendChild(this.li);

    this.ul = document.createElement('ul');
    this.ul.className = 'TreeNodesList';
    this.li.appendChild(this.ul);

    this.childElements = [];
    this._expanded = false;

    if (treeItem instanceof ZeaEngine.TreeItem) {
      if (expanded) {
        this.expand();
      } else {
        const children = this.treeItem.getChildren();
        if (children.length > 0) this.collapse();
      }

      this.expandBtn.addEventListener('click', () => {
        if (this.treeItem.getNumChildren() > 0) {
          this._expanded ? this.collapse() : this.expand();
        }
      });

      this.treeItem.childAdded.connect(childItem => {
        if (!childItem.testFlag(ZeaEngine.ItemFlags.INVISIBLE))
          this.addChild(childItem);
      });

      this.treeItem.childRemoved.connect(index => {
        if (this._expanded) {
          this.childElements[index].destroy();
          this.childElements.splice(index, 1);
        }
      });
    }
  }

  /**
   * The addComponent method.
   * @param {any} component - The component param.
   */
  addComponent(component) {
    if (!this.subul) {
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

  /**
   * The addChild method.
   * @param {any} treeItem - The treeItem param.
   * @param {boolean} expanded - The expanded param.
   */
  addChild(treeItem, expanded = false) {
    if (this._expanded) {
      const childTreeItem = uxFactory.constructTreeItemElement(
        treeItem,
        this.ul,
        this.appData,
        expanded
      );
      this.childElements.push(childTreeItem);
    } else {
      this.collapse();
    }
  }

  /**
   * The expand method.
   */
  expand() {
    this._expanded = true;
    this.ul.classList.remove('TreeNodesList--collapsed');
    this.expandBtn.innerHTML =
      '<i class="material-icons md-24">arrow_drop_down</i>';

    if (!this.childrenAlreadyCreated) {
      const children = this.treeItem.getChildren();
      for (const childItem of children) {
        if (!childItem.testFlag(ZeaEngine.ItemFlags.INVISIBLE))
          this.addChild(childItem);
      }
      this.childrenAlreadyCreated = true;
    }
  }

  /**
   * The collapse method.
   */
  collapse() {
    this.ul.classList.add('TreeNodesList--collapsed');
    this.expandBtn.innerHTML =
      '<i class="material-icons md-24">arrow_right</i>';
    this._expanded = false;
  }

  /**
   * The destroy method.
   */
  destroy() {
    this.parentDomElement.removeChild(this.li);
  }
}

uxFactory.registerTreeItemElement(
  TreeItemElement,
  p => p instanceof ZeaEngine.BaseItem
);

/**
 * Class representing a geom item element.
 * @extends TreeItemElement
 */
class GeomItemElement extends TreeItemElement {
  /**
   * Create a geom item element.
   * @param {any} treeItem - The treeItem value.
   * @param {any} parentDomElement - The parentDomElement value.
   * @param {any} appData - The appData value.
   * @param {boolean} expanded - The expanded value.
   */
  constructor(treeItem, parentDomElement, appData, expanded = false) {
    super(treeItem, parentDomElement, appData, expanded);

    // this.addComponent('material')
    // this.addComponent('geometry')
  }
}

uxFactory.registerTreeItemElement(
  GeomItemElement,
  p => p instanceof ZeaEngine.GeomItem
);

/** Class representing a scene tree view. */
class SceneTreeView {
  /**
   * Create a scene tree view.
   * @param {any} rootTreeItem - The rootTreeItem value.
   * @param {any} appData - The appData value.
   */
  constructor(rootTreeItem, appData) {
    this.appData = appData;

    this.ul = document.createElement('ul');
    this.ul.className = 'TreeNodesList TreeNodesList--root';

    this.rootElement = new TreeItemElement(
      rootTreeItem,
      this.ul,
      appData,
      true
    );
  }

  /**
   * The getDomElement method.
   * @return {any} The return value.
   */
  getDomElement() {
    return this.container;
  }

  /**
   * The mount method.
   * @param {any} parentElement - The parentElement param.
   */
  mount(parentElement) {
    this.parentDomElement = parentElement;
    this.parentDomElement.appendChild(this.ul);
  }

  /**
   * The unMount method.
   * @param {any} parentElement - The parentElement param.
   */
  unMount(parentElement) {
    this.parentDomElement.removeChild(this.ul);
  }
}

export { SceneTreeView };
