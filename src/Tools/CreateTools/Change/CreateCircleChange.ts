import { Color, GeomItem, Material, Circle } from '@zeainc/zea-engine'
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
  // TODO: add lineThickness to circle or parent class
  circle: any= new Circle(0, 64)
  geomItem
  /**
   * Creates an instance of CreateCircleChange.
   *
   * @param {TreeItem} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('CreateCircle')

    this.circle.lineThickness = 0.05

    const material = new Material('circle', 'FatLinesShader')
    material.getParameter('BaseColor').setValue(new Color(0.7, 0.2, 0.2))

    this.geomItem = new GeomItem('Circle', this.circle, material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates circle with the specified data.
   *
   * @param {object} updateData - The updateData param.
   */
  update(updateData) {
    this.circle.radiusParam.value = updateData.radius
    this.emit('updated', updateData)
  }

  /**
   * Serializes change as a JSON object.
   *
   * @return {Record<any, any>} - The return value.
   */
  toJSON() {
    const j: Record<any, any> = super.toJSON()
    j.radius = this.circle.radiusParam.value
    return j
  }

  /**
   * Updates circle with the specified JSON
   *
   * @param {object} j - The j param.
   */
  updateFromJSON(j) {
    console.log('CreateCircleChange:', j)
    if (j.radius) this.circle.getParameter('Radius').setValue(j.radius)
  }
}

UndoRedoManager.registerChange('CreateCircleChange', CreateCircleChange)

export default CreateCircleChange
export { CreateCircleChange }