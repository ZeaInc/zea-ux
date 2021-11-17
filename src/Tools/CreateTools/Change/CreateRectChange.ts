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
  // TODO: add lineThickness to rect
  rect: Rect = new Rect(0, 0)
  /**
   * Create a create rect change.
   *
   * @param {TreeItem} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('CreateRect')

    const material = new Material('circle', 'FatLinesShader')
    material.getParameter('BaseColor').setValue(new Color(0.7, 0.2, 0.2))
    this.geomItem = new GeomItem('Rect', this.rect, material)

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
      this.rect.getParameter('X').setValue(updateData.baseSize[0])
      this.rect.getParameter('Y').setValue(updateData.baseSize[1])
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
