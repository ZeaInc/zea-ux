import { GeomItem, Material, Sphere } from '@zeainc/zea-engine'
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
  /**
   * Create a create sphere change.
   * @param {TreeItem} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   * @param {Color} color - The color of the sphere to create.
   */
  constructor(parentItem, xfo, color) {
    super('CreateSphere', parentItem)

    this.sphere = new Sphere(0, 24, 12)
    const material = new Material('Sphere', 'SimpleSurfaceShader')
    this.geomItem = new GeomItem('Sphere', this.sphere, material)
    this.geomItem.setSelectable(false)

    if (parentItem && xfo && color) {
      material.getParameter('BaseColor').setValue(color)
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates sphere geometry using the specified data.
   *
   * @param {object} updateData - The updateData param.
   */
  update(updateData) {
    this.sphere.radiusParam.value = updateData.radius

    this.emit('updated', updateData)
  }

  /**
   * Serializes sphere geometry as a JSON object.
   *
   * @return {object} The return value.
   */
  toJSON() {
    const j = super.toJSON()
    j.radius = this.sphere.radiusParam.getValue()
    return j
  }

  /**
   * Updates sphere geometry using a JSON object.
   *
   * @param {object} j - The j param.
   */
  updateFromJSON(j) {
    if (j.radius) this.sphere.radiusParam.value = j.radius
  }
}

UndoRedoManager.registerChange('CreateSphereChange', CreateSphereChange)

export default CreateSphereChange
export { CreateSphereChange }
