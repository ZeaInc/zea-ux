import {
  Color,
  GeomItem,
  LinesMaterial,
  Lines,
  Vec3,
  Vec3Attribute,
  TreeItem,
  Xfo,
  Material,
  FatLinesMaterial,
} from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'
import { CustomGeom } from '../CustomGeom'

/**
 * Class representing a create line change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateLineChange extends CreateGeomChange {
  line: Lines
  /**
   * Create a create line change.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   * @param color - The color value.
   * @param thickness - The thickness value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color, public thickness: number = 0.0) {
    super('Create Line', parentItem, xfo, color)
    if (this.parentItem) {
      this.createGeomItem()
    }
  }

  protected createGeomItem() {
    this.line = new Lines()
    this.line.setNumVertices(2)
    this.line.setNumSegments(1)
    const positions = <Vec3Attribute>this.line.getVertexAttribute('positions')
    positions.setValue(0, new Vec3())
    this.line.setSegmentVertexIndices(0, 0, 1)

    let material: Material
    if (this.thickness > 0) {
      const fatLinesMaterial = new FatLinesMaterial('Line')
      fatLinesMaterial.baseColorParam.value = this.color
      fatLinesMaterial.lineThicknessParam.value = this.thickness
      material = fatLinesMaterial
    } else {
      const linesMaterial = new LinesMaterial('Line')
      linesMaterial.baseColorParam.value = this.color
      material = linesMaterial
    }
    this.geomItem = new CustomGeom('Line', this.line, material, this.xfo)
    this.geomItem.pickableParam.value = false // At the conclusion of creation, we set selectable to true.
    if (this.parentItem) {
      this.parentItem.addChild(this.geomItem)
    }
  }

  /**
   * Updates Line using the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    if (updateData.p1) {
      this.line.positions.setValue(1, updateData.p1)
      this.line.setBoundingBoxDirty()
      this.line.emit('geomDataChanged')
    }

    this.emit('updated', updateData)
  }

  /**
   * Restores line geometry using a JSON object.
   *
   * @param j - The j param.
   * @param context - The context param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
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
