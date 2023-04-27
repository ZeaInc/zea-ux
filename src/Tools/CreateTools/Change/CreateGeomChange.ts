import { Xfo, Color, GeomItem, TreeItem } from '@zeainc/zea-engine'
import Change from '../../../UndoRedo/Change'

/**
 * Class representing a create geom change.
 *
 * @extends Change
 */
class CreateGeomChange extends Change {
  parentItem: TreeItem
  geomItem: GeomItem
  childIndex: number
  /**
   * Create a create circle change.
   * @param name - The name value.
   */
  constructor(name: string, parentItem: TreeItem, xfo: Xfo) {
    super(name)
    this.parentItem = parentItem

    this.createGeoItem()

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  protected createGeoItem() {
    throw 'This method must be implemented by each specialzed change class.'
  }

  /**
   * The setParentAndXfo method.
   * @param parentItem - The parentItem param.
   * @param xfo - The xfo param.
   */
  protected setParentAndXfo(parentItem: TreeItem, xfo: Xfo): void {
    this.parentItem = parentItem
    const name = this.parentItem.generateUniqueName(this.geomItem.getName())
    this.geomItem.setName(name)
    this.geomItem.globalXfoParam.value = xfo
    this.parentItem.addChild(this.geomItem)
  }

  /**
   * Removes recently created geometry from its parent.
   */
  undo(): void {
    this.parentItem.removeChild(this.parentItem.getChildIndex(this.geomItem))
  }

  /**
   * Restores recently created geometry and adds it to the specified parent tree item.
   */
  redo(): void {
    this.parentItem.addChild(this.geomItem, false, false)
  }

  /**
   * Serializes the change as a JSON object.
   *
   * @param context - The context value
   * @return - The serialized change
   */
  toJSON(context?: Record<any, any>): Record<any, any> {
    const j: Record<any, any> = super.toJSON(context)
    j.parentItemPath = this.parentItem.getPath()
    j.geomItemName = this.geomItem.getName()
    j.geomItemXfo = this.geomItem.localXfoParam.getValue()

    const material = this.geomItem.getParameter('Material').getValue()
    j.color = material.getParameter('BaseColor').getValue()
    return j
  }

  /**
   * Restores geometry from using the specified JSON
   *
   * @param j - The j param.
   * @param context - The appData param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
    const sceneRoot = context.appData.scene.getRoot()
    this.parentItem = sceneRoot.resolvePath(j.parentItemPath, 1)
    this.geomItem.setName(this.parentItem.generateUniqueName(j.geomItemName))
    const xfo = new Xfo()
    xfo.fromJSON(j.geomItemXfo)
    this.geomItem.localXfoParam.value = xfo
    this.childIndex = this.parentItem.getChildIndex(this.parentItem.addChild(this.geomItem, false))

    if (j.color) {
      const color = new Color(0.7, 0.2, 0.2)
      color.fromJSON(j.color)
      const material = this.geomItem.getParameter('Material').getValue()
      material.getParameter('BaseColor').value = color
    }
  }

  // updateFromJSON(j) {
  //   if (this.__newValue.fromJSON)
  //     this.__newValue.fromJSON(j.value);
  //   else
  //     this.__newValue = j.value;
  // }

  /**
   * Removes geometry item reference from change change.
   */
  destroy(): void {
    // this.geomItem.removeRef(this) // remove the tmp ref.
  }
}

export default CreateGeomChange
export { CreateGeomChange }
