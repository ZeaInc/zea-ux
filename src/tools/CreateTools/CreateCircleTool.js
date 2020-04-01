import { Color, GeomItem, Material, Circle } from '@zeainc/zea-engine'
import UndoRedoManager from '../../undoredo/UndoRedoManager.js'
import { CreateGeomChange, CreateGeomTool } from './CreateGeomTool.js'

/**
 * Class representing a create circle change.
 * @extends CreateGeomChange
 */
class CreateCircleChange extends CreateGeomChange {
  /**
   * Create a create circle change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
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
    this.updated.emit(updateData)
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

/**
 * Class representing a create circle tool.
 * @extends CreateGeomTool
 */
class CreateCircleTool extends CreateGeomTool {
  /**
   * Create a create circle tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData)
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateCircleChange(parentItem, xfo)
    this.appData.undoRedoManager.addChange(this.change)

    this.xfo = xfo
    this.stage = 1
    this.radius = 0.0
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    this.radius = pt.distanceTo(this.xfo.tr)
    this.change.update({ radius: this.radius })
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {
    if (this.radius == 0) {
      this.appData.undoRedoManager.undo(false)
    }
    this.change = null
    this.stage = 0
    this.actionFinished.emit()
  }
}

export { CreateCircleTool }
