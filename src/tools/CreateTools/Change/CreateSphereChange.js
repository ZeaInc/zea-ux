import { GeomItem, Material, Sphere } from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create sphere change.
 * @extends CreateGeomChange
 */
class CreateSphereChange extends CreateGeomChange {
  /**
   * Create a create sphere change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
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
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    this.sphere.radius = updateData.radius
    this.emit('updated', updateData)
  }

  /**
   * The toJSON method.
   * @return {any} The return value.
   */
  toJSON() {
    const j = super.toJSON()
    j.radius = this.geomItem.getGeometry().radius
    return j
  }

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    if (j.radius) this.geomItem.getGeometry().radius = j.radius
  }
}
UndoRedoManager.registerChange('CreateSphereChange', CreateSphereChange)

export default CreateSphereChange
export { CreateSphereChange }
