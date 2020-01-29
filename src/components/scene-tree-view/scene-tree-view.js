/**
 * Scene tree view.
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
    
    //////////////////////
    // Force loading of @font-face so the main page desn't have to.
    // this is to work around a limitation in Chrome, where @font-face
    // Are not loaded in the shadow dom and must be loaded in the page.
    // See here: https://github.com/mdn/interactive-examples/issues/887

    const fontFaceSheet1 = new CSSStyleSheet();
    fontFaceSheet1.replaceSync(`@font-face {
      font-family: "Material Icons";
      font-style: normal;
      font-weight: 400;
      src: url('https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2') format('woff');
    }`);
    
    const fontFaceSheet2 = new CSSStyleSheet();
    fontFaceSheet2.replaceSync(`@font-face {
      font-family: "Material Icons Outlined";
      font-style: normal;
      font-weight: 400;
      src: url('https://fonts.gstatic.com/s/materialiconsoutlined/v14/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUce.woff2') format('woff');
    }`);

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontFaceSheet1, fontFaceSheet2];
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
