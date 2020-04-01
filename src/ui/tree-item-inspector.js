import { BaseItem } from '@zeainc/zea-engine'
import ParameterContainer from './parameter-container.js'
import uxFactory from './UxFactory.js'
import NameWidget from './parameter-widgets/NameWidget.js'

/** Class representing a tree item inspector. */
export default class TreeItemInspector {
  /**
   * Create a tree item inspector.
   * @param {any} treeItem - The treeItem value.
   * @param {any} domElement - The domElement value.
   * @param {any} appData - The appData value.
   */
  constructor(treeItem, domElement, appData) {
    const ul = document.createElement('ul')
    ul.className = 'list pa0 pr3'
    const linameWidget = document.createElement('li')
    const liparameterContainer = document.createElement('li')
    domElement.appendChild(ul)
    ul.appendChild(linameWidget)
    ul.appendChild(liparameterContainer)
    this.nameWidget = new NameWidget(treeItem, linameWidget, appData)
    this.parameterContainer = new ParameterContainer(
      treeItem,
      liparameterContainer,
      appData
    )
  }

  /**
   * The destroy method.
   */
  destroy() {
    this.parameterContainer.destroy()
  }
}

uxFactory.registerInpector(TreeItemInspector, (p) => p instanceof BaseItem)
