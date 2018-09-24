class TreeItemElement {
  constructor(treeItem, parentElement, expanded = false) {
    this.parentElement = parentElement;
    this.treeItem = treeItem;

    this.li = document.createElement('li');
    this.li.className = 'TreeNodesListItem';

    this.expandBtn = document.createElement('button');
    this.expandBtn.className = 'TreeNodesListItem__Toggle';
    this.li.appendChild(this.expandBtn);

    // Visibility toggle.
    this.toggleVisibilityBtn = document.createElement('button');
    this.toggleVisibilityBtn.className = 'TreeNodesListItem__ToggleVisibility';
    this.li.appendChild(this.toggleVisibilityBtn);
    this.toggleVisibilityBtn.innerHTML =
      '<i class="material-icons md-15">visibility</i>';

    this.toggleVisibilityBtn.addEventListener('click', () => {
      this.treeItem.setVisible(!this.treeItem.getVisible());
    });

    // Title element.
    this.titleElement = document.createElement('span');
    this.titleElement.className = 'TreeNodesListItem__Title';
    this.titleElement.textContent = treeItem.getName();
    this.li.appendChild(this.titleElement);

    this.titleElement.addEventListener('click', () => {
      this.treeItem.setSelected(!this.treeItem.getSelected());
    });

    this.parentElement.appendChild(this.li);

    this.ul = document.createElement('ul');
    this.ul.className = 'flex-outer TreeNodesList';
    this.li.appendChild(this.ul);

    this.childElements = [];
    this._expanded = false;
    const children = this.treeItem.getChildren();
    if (children.length) {
      this.expandBtn.addEventListener('click', () => {
        this._expanded ? this.collapse() : this.expand();
      });

      if (expanded) {
        this.expand();
      } else {
        this.expandBtn.innerHTML =
          '<i class="material-icons md-24">arrow_right</i>';
      }
    }

    this.treeItem.childAdded.connect((childItem, index) => {
      this.addChild(childItem, this.ul);
    });

    this.treeItem.childRemoved.connect((childItem, index) => {});

    this.treeItem.selectedChanged.connect(() => {
      const selected = this.treeItem.getSelected();
      selected
        ? this.li.classList.add('TreeNodesListItem--isSelected')
        : this.li.classList.remove('TreeNodesListItem--isSelected');
    });

    this.treeItem.visibilityChanged.connect(() => {
      const visible = this.treeItem.getVisible();
      console.info(visible);
      visible
        ? this.li.classList.remove('TreeNodesListItem--isHidden')
        : this.li.classList.add('TreeNodesListItem--isHidden');
    });
  }

  addChild(treeItem, parentElement, expanded = false) {
    const childTreeItem = new TreeItemElement(
      treeItem,
      parentElement,
      expanded
    );
    this.childElements.push(childTreeItem);
    this.expandBtn.innerHTML =
      '<i class="material-icons md-24">arrow_drop_down</i>';
    this.expandBtn.addEventListener('click', () => {
      this._expanded ? this.collapse() : this.expand();
    });

    if (expanded) {
      this.expand();
    } else {
      this.expandBtn.innerHTML =
        '<i class="material-icons md-24">arrow_right</i>';
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
        this.addChild(child, this.ul);
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

class SceneTreeView {
  constructor(parentElement, rootTreeItem) {
    this.parentElement = parentElement;
    this.container = document.createElement('div');
    this.container.className = 'container SceneTreeView';
    this.parentElement.appendChild(this.container);

    this.ul = document.createElement('ul');
    this.ul.className = 'flex-outer TreeNodesList TreeNodesList--root';
    this.container.appendChild(this.ul);

    this.rootElement = new TreeItemElement(rootTreeItem, this.ul, true);
  }

  getDomElement() {
    return this.container;
  }
}

export default SceneTreeView;
