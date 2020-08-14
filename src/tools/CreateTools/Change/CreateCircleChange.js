import { Color, GeomItem, Material, Circle } from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create circle change.
 *
 * @extends CreateGeomChange
 */
class CreateCircleChange extends CreateGeomChange {
  /**
   * Create a create circle change.
   * @param {any} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Circle', parentItem)

    this.circle = new Circle(0, 64)
    this.circle.lineThickness = 0.05
    // const material = new Material('circle', 'LinesShader');
    const material = new Material('circle', 'FatLinesShader')
    material.getParameter('Color').setValue(new Color(0.7, 0.2, 0.2))
    this.geomItem = new GeomItem('Circle')
    this.geomItem.setGeometry(this.circle)
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
    this.circle.getParameter('Radius').setValue(updateData.radius)
    this.emit('updated', updateData)
  }

  /**
   * The toJSON method.
   * @return {any} The return value.
   */
  toJSON() {
    const j = super.toJSON()
    j.radius = this.circle.getParameter('Radius').getValue()
    return j
  }

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    console.log('CreateCircleChange:', j)
    if (j.radius) this.circle.getParameter('Radius').setValue(j.radius)
  }
}
UndoRedoManager.registerChange('CreateCircleChange', CreateCircleChange)

export default CreateCircleChange
export { CreateCircleChange }
