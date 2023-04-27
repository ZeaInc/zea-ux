import { Color, Rect, LinesMaterial, GeomItem, TreeItem, Xfo } from '@zeainc/zea-engine'
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
  rect: Rect = new Rect(0, 0)
  /**
   * Create a create rect change.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo) {
    super('CreateRect')

    const material = new LinesMaterial('circle')
    material.getParameter('BaseColor').value = new Color(0.7, 0.2, 0.2)
    this.geomItem = new GeomItem('Rect', this.rect, material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates rectangle with the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    if (updateData.baseSize) {
      this.rect.sizeXParam.value = updateData.baseSize[0]
      this.rect.sizeYParam.value = updateData.baseSize[1]
    }
    if (updateData.tr) {
      const xfo = this.geomItem.localXfoParam.getValue()
      xfo.tr.fromJSON(updateData.tr)
      this.geomItem.localXfoParam.value = xfo
    }

    this.emit('updated', updateData)
  }
}

UndoRedoManager.registerChange('CreateRectChange', CreateRectChange)

export default CreateRectChange
export { CreateRectChange }
