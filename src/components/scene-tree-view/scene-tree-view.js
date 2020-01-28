/**
 * Tree item view.
 *
 */
class SceneTreeView extends HTMLElement {
  /**
   * Constructor.
   *
   */
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    // Create container tags
    this.treeContainer = document.createElement('div');
    shadowRoot.appendChild(this.treeContainer);

    // Init root tree item
    this.treeItemView = document.createElement('tree-item-view');
  }

  /**
   * Set tree item.
   * @param {object} treeItem Tree item.
   * @param {object} appData App data.
   */
  setTreeItem(treeItem, appData) {
    this.treeItemView.setTreeItem(treeItem);
    this.treeContainer.appendChild(this.treeItemView);
  }
}

customElements.define('scene-tree-view', SceneTreeView);

export default SceneTreeView;
