import { GeomItem, Circle, Xfo, TreeItem, LinesMaterial, Color } from '@zeainc/zea-engine'
import { UndoRedoManager } from '../../../UndoRedo/index'
import CreateGeomChange from './CreateGeomChange'
import { CustomGeom } from '../CustomGeom'

/**
 * Class representing a create circle change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateCircleChange extends CreateGeomChange {
  circle: Circle
  /**
   * Creates an instance of CreateCircleChange.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color) {
    super('CreateCircle', parentItem, xfo, color)

    if (this.parentItem) {
      this.createGeomItem()
    }
  }

  protected createGeomItem() {
    this.circle = new Circle(0, 64)
    const material = new LinesMaterial('circle')
    this.geomItem = new CustomGeom('Circle', this.circle, material, this.xfo)
    this.geomItem.setSelectable(false) // At the conclusion of creation, we set selectable to true.
    if (this.parentItem) {
      this.parentItem.addChild(this.geomItem)
    }
  }

  /**
   * Updates circle with the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    this.geomItem.globalXfoParam.value = updateData.xfo
    this.circle.radiusParam.value = updateData.radius
    this.emit('updated', updateData)
  }

  /**
   * Serializes change as a JSON object.
   *
   * @return - The return value.
   */
  toJSON(): Record<any, any> {
    const j: Record<any, any> = super.toJSON()
    j.radius = this.circle.radiusParam.value
    return j
  }
}

UndoRedoManager.registerChange('CreateCircleChange', CreateCircleChange)

export default CreateCircleChange
export { CreateCircleChange }
