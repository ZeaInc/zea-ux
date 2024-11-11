import { GeomItem, Material, Cone, TreeItem, Xfo, Color, SimpleSurfaceMaterial } from '@zeainc/zea-engine'
import { UndoRedoManager } from '../../../UndoRedo/index'
import CreateGeomChange from './CreateGeomChange'
import { CustomGeom } from '../CustomGeom'

/**
 * Class representing a create cone change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateConeChange extends CreateGeomChange {
  cone: Cone
  /**
   * Create a create cone change.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color) {
    super('Create Cone', parentItem, xfo, color)
    if (this.parentItem) {
      this.createGeomItem()
    }
  }

  protected createGeomItem() {
    this.cone = new Cone(0.0, 0.0)
    const material = new SimpleSurfaceMaterial('Cone')
    material.baseColorParam.value = this.color
    this.geomItem = new CustomGeom('Cone', this.cone, material, this.xfo)
    this.geomItem.setSelectable(false) // At the conclusion of creation, we set selectable to true.
    if (this.parentItem) {
      this.parentItem.addChild(this.geomItem)
    }
  }

  /**
   * Updates cone with the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    if (updateData.radius) this.cone.radiusParam.value = updateData.radius
    if (updateData.height) this.cone.heightParam.value = updateData.height

    this.emit('updated', updateData)
  }
}

UndoRedoManager.registerChange('CreateConeChange', CreateConeChange)

export default CreateConeChange
export { CreateConeChange }
