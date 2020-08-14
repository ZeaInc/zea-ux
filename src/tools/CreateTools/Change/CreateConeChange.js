import { GeomItem, Material, Cone } from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create cone change.
 * @extends CreateGeomChange
 */
class CreateConeChange extends CreateGeomChange {
  /**
   * Create a create cone change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Cone')

    const cone = new Cone(0.0, 0.0)
    const material = new Material('Sphere')
    this.geomItem = new GeomItem('Sphere')
    this.geomItem.setGeometry(cone)
    this.geomItem.setMaterial(material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.radius) this.geomItem.getGeometry().setRadius(updateData.radius)
    if (updateData.height) this.geomItem.getGeometry().setHeight(updateData.height)
    this.emit('updated', updateData)
  }
}
UndoRedoManager.registerChange('CreateCircleChange', CreateCircleChange)

export default CreateConeChange
export { CreateConeChange }
