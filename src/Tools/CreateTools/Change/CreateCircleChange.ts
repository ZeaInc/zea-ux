import { Color, GeomItem, Material, Circle, Xfo, TreeItem, LinesMaterial } from '@zeainc/zea-engine'
import { UndoRedoManager } from '../../../UndoRedo/index'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create circle change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateCircleChange extends CreateGeomChange {
  circle: Circle = new Circle(0, 64)
  /**
   * Creates an instance of CreateCircleChange.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo) {
    super('CreateCircle')

    this.createGeoItem()

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  protected createGeoItem() {
    const material = new LinesMaterial('circle')
    material.getParameter('BaseColor').value = new Color(0.7, 0.2, 0.2)

    this.geomItem = new GeomItem('Circle', this.circle, material)
  }

  /**
   * Updates circle with the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
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

  /**
   * Updates circle with the specified JSON
   *
   * @param j - The j param.
   */
  updateFromJSON(j: Record<any, any>): void {
    console.log('CreateCircleChange:', j)
    if (j.radius) this.circle.radiusParam.value = j.radius
  }
}

UndoRedoManager.registerChange('CreateCircleChange', CreateCircleChange)

export default CreateCircleChange
export { CreateCircleChange }
