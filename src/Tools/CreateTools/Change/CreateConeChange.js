import { GeomItem, Material, Cone } from '@zeainc/zea-engine'
import { UndoRedoManager } from '../../../UndoRedo/index'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create cone change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateConeChange extends CreateGeomChange {
  /**
   * Create a create cone change.
   *
   * @param {TreeItem} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Cone')

    const cone = new Cone(0.0, 0.0)
    const material = new Material('Sphere', 'SimpleSurfaceShader')
    this.geomItem = new GeomItem('Sphere', cone, material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates cone with the specified data.
   *
   * @param {object} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.radius)
      this.geomItem.getParameter('Geometry').getValue().getParameter('Radius').setValue(updateData.radius)
    if (updateData.height)
      this.geomItem.getParameter('Geometry').getValue().getParameter('Height').setValue(updateData.height)

    this.emit('updated', updateData)
  }
}

UndoRedoManager.registerChange('CreateConeChange', CreateConeChange)

export default CreateConeChange
export { CreateConeChange }
