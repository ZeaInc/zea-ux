import { Color, Rect, Material, GeomItem } from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create rect change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateRectChange extends CreateGeomChange {
  /**
   * Create a create rect change.
   *
   * @param {TreeItem} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Rect')

    this.rect = new Rect(0, 0)
    this.rect.lineThickness = 0.05
    // const material = new Material('rect', 'LinesShader');
    const material = new Material('circle', 'FatLinesShader')
    material.getParameter('Color').setValue(new Color(0.7, 0.2, 0.2))
    this.geomItem = new GeomItem('Rect')
    this.geomItem.setGeometry(this.rect)
    this.geomItem.setMaterial(material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates rectangle with the specified data.
   *
   * @param {object} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.baseSize) {
      this.rect.setSize(updateData.baseSize[0], updateData.baseSize[1])
    }
    if (updateData.tr) {
      const xfo = this.geomItem.getParameter('LocalXfo').getValue()
      xfo.tr.fromJSON(updateData.tr)
      this.geomItem.getParameter('LocalXfo').setValue(xfo)
    }

    this.emit('updated', updateData)
  }
}

UndoRedoManager.registerChange('CreateRectChange', CreateRectChange)

export default CreateRectChange
export { CreateRectChange }
