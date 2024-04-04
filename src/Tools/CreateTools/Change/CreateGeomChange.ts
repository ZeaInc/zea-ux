import { Xfo, Color, GeomItem, TreeItem } from '@zeainc/zea-engine'
import Change from '../../../UndoRedo/Change'
import { UndoRedoManager } from '../../..'

/**
 * Class representing a create geom change.
 *
 * @extends Change
 */
class CreateGeomChange extends Change {
  parentItem: TreeItem
  geomItem: GeomItem
  childIndex: number
  xfo = new Xfo()
  color = new Color(0.7, 0.2, 0.2)
  /**
   * Create a create circle change.
   * @param name - The name value.
   */
  constructor(name: string, parentItem: TreeItem, xfo: Xfo, color = new Color(0.7, 0.2, 0.2)) {
    super(name ? name : 'CreateGeomChange')

    if (parentItem) {
      this.parentItem = parentItem
    }
    if (xfo) {
      this.xfo = xfo
    }
    if (color) {
      this.color = color
    }
  }

  protected createGeomItem() {
    throw 'This method must be implemented by each specialzed change class.'
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
    j.geomItemXfo = this.geomItem.localXfoParam.value

    const material = this.geomItem.materialParam.value
    j.color = material.getParameter('BaseColor').value
    return j
  }

  /**
   * Restores geometry from using the specified JSON
   *
   * @param j - The j param.
   * @param context - The appData param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
    super.fromJSON(j, context)

    if (j.color) {
      this.color.fromJSON(j.color)
    }
    this.createGeomItem()

    const sceneRoot = context.appData.scene.getRoot()
    this.parentItem = sceneRoot.resolvePath(j.parentItemPath, 1)
    this.geomItem.setName(this.parentItem.generateUniqueName(j.geomItemName))
    const xfo = new Xfo()
    xfo.fromJSON(j.geomItemXfo)
    this.geomItem.localXfoParam.value = xfo
    this.childIndex = this.parentItem.getChildIndex(this.parentItem.addChild(this.geomItem, false))
  }

  /**
   * Removes geometry item reference from change change.
   */
  destroy(): void {
    // this.geomItem.removeRef(this) // remove the tmp ref.
  }
}

UndoRedoManager.registerChange('CreateGeomChange', CreateGeomChange)

export default CreateGeomChange
export { CreateGeomChange }
