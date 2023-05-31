import { Color, GeomItem, Material, Sphere, TreeItem, Xfo } from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create sphere change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateSphereChange extends CreateGeomChange {
  sphere: Sphere
  /**
   * Create a create sphere change.
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   * @param color - The color of the sphere to create.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color) {
    super('CreateSphere', parentItem, xfo)
  }

  protected createGeoItem() {
    this.sphere = new Sphere(0, 24, 12)
    const material = new Material('Sphere', 'SimpleSurfaceShader')
    this.geomItem = new GeomItem('Sphere', this.sphere, material)
    this.geomItem.setSelectable(false) // At the conclusion of creation, we set selectable to true.
  }

  /**
   * Updates sphere geometry using the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    this.geomItem.globalXfoParam.value = updateData.xfo
    this.sphere.radiusParam.value = updateData.radius

    this.emit('updated', updateData)
  }

  /**
   * Serializes sphere geometry as a JSON object.
   *
   * @return {object} The return value.
   */
  toJSON(): Record<any, any> {
    const j = super.toJSON()
    j.radius = this.sphere.radiusParam.getValue()
    return j
  }

  /**
   * Updates sphere geometry using a JSON object.
   *
   * @param j - The j param.
   */
  updateFromJSON(j: Record<any, any>): void {
    if (j.radius) this.sphere.radiusParam.value = j.radius
  }
}

UndoRedoManager.registerChange('CreateSphereChange', CreateSphereChange)

export default CreateSphereChange
export { CreateSphereChange }
