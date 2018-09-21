class TreeItemElement {
  constructor(treeItem, parentElement, expanded = false) {
    this.parentElement = parentElement;
    this.treeItem = treeItem;

    this.li = document.createElement('li');
    this.li.className = 'TreeNodesListItem';

    this.expandBtn = document.createElement('button');
    this.expandBtn.className = 'TreeNodesListItem__Toggle';
    this.li.appendChild(this.expandBtn);

    this.titleElement = document.createElement('span');
    this.titleElement.className = 'TreeNodesListItem__Title';
    this.titleElement.textContent = treeItem.getName();
    this.li.appendChild(this.titleElement);

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
      console.log('Child added', index);
    });
    this.treeItem.childRemoved.connect((childItem, index) => {});
  }

  expand() {
    this._expanded = true;
    this.ul.classList.remove('TreeNodesList--collapsed');
    this.expandBtn.innerHTML =
      '<i class="material-icons md-24">arrow_drop_down</i>';

    if (!this.childrenAlreadyCreated) {
      const children = this.treeItem.getChildren();
      for (let child of children) {
        const childTreeItem = new TreeItemElement(child, this.ul);
        this.childElements.push(childTreeItem);
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
