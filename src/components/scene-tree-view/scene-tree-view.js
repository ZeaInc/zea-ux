class SceneTreeView extends HTMLElement {
  css = ``;
  treeItemView;
  constructor() {
    super();

    var shadowRoot = this.attachShadow({ mode: 'open' });

    // Add component CSS
    const styleTag = document.createElement('style');
    styleTag.appendChild(document.createTextNode(this.css));
    shadowRoot.appendChild(styleTag);

    // Create container tags
    this.treeContainer = document.createElement('div');

    //
    shadowRoot.appendChild(this.treeContainer);
    this.treeItemView = document.createElement('tree-item-view');
  }

  setTreeItem(treeItem, appData) {
    this.treeItemView.setTreeItem(treeItem);
    this.treeContainer.appendChild(this.treeItemView);
  }
}

customElements.define('scene-tree-view', SceneTreeView);
