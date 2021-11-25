import {
  Color,
  GeomItem,
  LinesMaterial,
  FatLinesMaterial,
  Lines,
  Vec3,
  Vec3Attribute,
  TreeItem,
  Xfo,
} from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create line change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateLineChange extends CreateGeomChange {
  line: Lines = new Lines()
  /**
   * Create a create line change.
   *
   * @param {TreeItem} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   * @param {Color} color - The color value.
   * @param {number} thickness - The thickness value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color, thickness = 0.001) {
    super('Create Line')

    this.line.setNumVertices(2)
    this.line.setNumSegments(1)
    const positions = <Vec3Attribute>this.line.getVertexAttribute('positions')
    positions.setValue(0, new Vec3())
    this.line.setSegmentVertexIndices(0, 0, 1)

    const material = new FatLinesMaterial('Line')
    if (color) {
      material.baseColorParam.value = color
    }
    if (material.lineThicknessParam) {
      material.lineThicknessParam.value = thickness
    }
    this.geomItem = new GeomItem('Line', this.line, material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates Line using the specified data.
   *
   * @param {object} updateData - The updateData param.
   */
  update(updateData: Record<any, any>) {
    if (updateData.p1) {
      this.line.positions.getValueRef(1).setFromOther(updateData.p1)
      this.line.setBoundingBoxDirty()
      this.line.emit('geomDataChanged')
    }

    this.emit('updated', updateData)
  }

  /**
   * Restores line geometry using a JSON object.
   *
   * @param {Record<any,any>} j - The j param.
   * @param {Record<any,any>} context - The context param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>) {
    super.fromJSON(j, context)
    if (j.color) {
      const color = new Color()
      color.fromJSON(j.color)
      const material = this.geomItem.materialParam.value
      material.getParameter('BaseColor').value = color
    }
  }
}

UndoRedoManager.registerChange('CreateLineChange', CreateLineChange)

export default CreateLineChange
export { CreateLineChange }
