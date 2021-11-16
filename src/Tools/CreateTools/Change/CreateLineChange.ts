import { Color, GeomItem, LinesMaterial, FatLinesMaterial, Lines, Vec3 } from '@zeainc/zea-engine'
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
  /**
   * Create a create line change.
   *
   * @param {TreeItem} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   * @param {Color} color - The color value.
   * @param {number} thickness - The thickness value.
   */
  constructor(parentItem, xfo, color, thickness = 0.001) {
    super('Create Line')

    this.line = new Lines(0.0)
    this.line.setNumVertices(2)
    this.line.setNumSegments(1)
    this.line.getVertexAttribute('positions').setValue(0, new Vec3())
    this.line.setSegmentVertexIndices(0, 0, 1)

    const material = new FatLinesMaterial('Line')
    if (color) {
      material.baseColorParam.value = color
    }
    if (material.lineThicknessParam) {
      material.lineThicknessParam.value = thickness
    }
    this.geomItem = new GeomItem('Line', this.line, material)

    if (thickness) {
      this.line.lineThickness = thickness
    }

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates Line using the specified data.
   *
   * @param {object} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.p1) {
      console.log(updateData.p1.toString())
      this.line.getVertexAttribute('positions').getValueRef(1).setFromOther(updateData.p1)
      this.line.setBoundingBoxDirty()
      this.line.emit('geomDataChanged')
    }

    this.emit('updated', updateData)
  }

  /**
   * Restores line geometry using a JSON object.
   *
   * @param {object} j - The j param.
   * @param {object} context - The context param.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context)
    if (j.color) {
      const color = new Color()
      color.fromJSON(j.color)
      material.getParameter('BaseColor').setValue(color)
    }

    if (j.thickness) {
      this.line.lineThickness = j.thickness
    }
  }
}

UndoRedoManager.registerChange('CreateLineChange', CreateLineChange)

export default CreateLineChange
export { CreateLineChange }
