import { Cuboid, SimpleSurfaceMaterial, GeomItem, TreeItem, Xfo, Color } from '@zeainc/zea-engine'
import { UndoRedoManager } from '../../../UndoRedo/index'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create cuboid change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateCuboidChange extends CreateGeomChange {
  cuboid: Cuboid
  /**
   * Create a create cuboid change.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo) {
    super('CreateCuboid', parentItem, xfo)
  }

  protected createGeoItem() {
    this.cuboid = new Cuboid(0, 0, 0, true)
    const material = new SimpleSurfaceMaterial('Cone')
    this.geomItem = new GeomItem('Cuboid', this.cuboid, material)
  }

  /**
   * Updates cuboid using the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    if (updateData.baseSize) {
      this.cuboid.sizeXParam.value = updateData.baseSize[0]
      this.cuboid.sizeYParam.value = updateData.baseSize[1]
    }
    if (updateData.tr) {
      const xfo = this.geomItem.localXfoParam.getValue()
      xfo.tr.fromJSON(updateData.tr)
      this.geomItem.localXfoParam.value = xfo
    }
    if (updateData.height) {
      this.cuboid.sizeZParam.value = updateData.height
    }
    this.emit('updated', updateData)
  }
}

UndoRedoManager.registerChange('CreateCuboidChange', CreateCuboidChange)

export default CreateCuboidChange
export { CreateCuboidChange }
