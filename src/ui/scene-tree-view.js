class TreeItemElement {
  constructor(parentElement, treeItem, expanded = false) {
    this.parentElement = parentElement;
    this.treeItem = treeItem;

    this.li = document.createElement('li');
    this.li.innerHTML = treeItem.getName();

    // this.li.className = 'flex-outer';
    this.parentElement.appendChild(this.li);

    this.ul = document.createElement('ul');
    this.ul.className = 'flex-outer';
    this.li.appendChild(this.ul);

    this.childElements = [];
    this._expanded = false;
    const children = this.treeItem.getChildren();
    if (children.length > 0) {
      this.expandBtn = document.createElement('button');
      this.li.appendChild(this.expandBtn);
      this.expandBtn.addEventListener('click', () => {
        if (this._expanded) this.collapse();
        else this.expand();
      });

      if (expanded) {
        this.expand();
      } else {
        this.expand.innerHTML = '+';
      }
    }

    this.treeItem.childAdded.connect((childItem, index) => {});
    this.treeItem.childRemoved.connect((childItem, index) => {});
  }

  expand() {
    if (!this._expanded) {
      const children = this.treeItem.getChildren();
      for (let child of children) {
        const childTreeItem = new TreeItemElement(this.ul, child);
        this.childElements.push(childTreeItem);
      }
      this._expanded = true;
      this.expandBtn.innerHTML = '-';
    }
  }

  collapse() {
    this.expandBtn.innerHTML = '+';
    this._expanded = false;
  }
}

class SceneTreeView {
  constructor(parentElement, rootTreeItem) {
    console.log('SceneTreeView');
    this.parentElement = parentElement;
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.parentElement.appendChild(this.container);

    this.ul = document.createElement('ul');
    this.ul.className = 'flex-outer';
    this.container.appendChild(this.ul);

    this.rootElement = new TreeItemElement(this.ul, rootTreeItem, true);
  }

  getDomElement() {
    return this.container;
  }
}
