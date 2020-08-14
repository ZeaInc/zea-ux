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
   */
  constructor(parentItem, xfo) {
    super('Create Sphere', parentItem)

    this.sphere = new Sphere(0, 64, 32)
    const material = new Material('Sphere', 'SimpleSurfaceShader')
    this.geomItem = new GeomItem('Sphere')
    this.geomItem.setGeometry(this.sphere)
    this.geomItem.setMaterial(material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates sphere geometry using the specified data.
   *
   * @param {object} updateData - The updateData param.
   */
  update(updateData) {
    this.sphere.radius = updateData.radius
    this.emit('updated', updateData)
  }

  /**
   * Serializes sphere geometry as a JSON object.
   *
   * @return {object} The return value.
   */
  toJSON() {
    const j = super.toJSON()
    j.radius = this.geomItem.getGeometry().radius
    return j
  }

  /**
   * Updates sphere geometry using a JSON object.
   *
   * @param {object} j - The j param.
   */
  changeFromJSON(j) {
    if (j.radius) this.geomItem.getGeometry().radius = j.radius
  }
}

UndoRedoManager.registerChange('CreateSphereChange', CreateSphereChange)

export default CreateSphereChange
export { CreateSphereChange }
