import { GeomItem, Material, Cone, TreeItem, Xfo, Color } from '@zeainc/zea-engine'
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
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color) {
    super('Create Cone')

    const cone = new Cone(0.0, 0.0)
    cone.heightParam.value = 0
    const material = new Material('Cone', 'SimpleSurfaceShader')
    this.geomItem = new GeomItem('Cone', cone, material)

    if (parentItem && xfo) {
      material.getParameter('BaseColor').value = color
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates cone with the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    if (updateData.radius) this.geomItem.getParameter('Geometry').getValue().radiusParam.value = updateData.radius
    if (updateData.height)
      this.geomItem.getParameter('Geometry').getValue().getParameter('Height').value = updateData.height

    this.emit('updated', updateData)
  }
}

UndoRedoManager.registerChange('CreateConeChange', CreateConeChange)

export default CreateConeChange
export { CreateConeChange }
