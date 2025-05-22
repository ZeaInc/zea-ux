import { Color, Rect, LinesMaterial, GeomItem, TreeItem, Xfo } from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'
import { CustomGeom } from '../CustomGeom'

/**
 * Class representing a create rect change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateRectChange extends CreateGeomChange {
  rect: Rect
  /**
   * Create a create rect change.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color) {
    super('CreateRect', parentItem, xfo, color)
    if (this.parentItem) {
      this.createGeomItem()
    }
  }

  protected createGeomItem() {
    this.rect = new Rect(0, 0)
    const material = new LinesMaterial('circle')
    material.baseColorParam.value = this.color
    this.geomItem = new CustomGeom('Rect', this.rect, material)
    this.geomItem.pickableParam.value = false // At the conclusion of creation, we set selectable to true.
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
      const xfo = this.geomItem.localXfoParam.value
      xfo.tr.fromJSON(updateData.tr)
      this.geomItem.localXfoParam.value = xfo
    }

    this.emit('updated', updateData)
  }
}

UndoRedoManager.registerChange('CreateRectChange', CreateRectChange)

export default CreateRectChange
export { CreateRectChange }
