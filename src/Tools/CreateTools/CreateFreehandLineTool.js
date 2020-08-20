import { BooleanParameter } from '@zeainc/zea-engine'
import CreateLineTool from './CreateLineTool'
import CreateFreehandLineChange from './Change/CreateFreehandLineChange'

/**
 * Tool for creating a free hand line.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateLineTool
 */
class CreateFreehandLineTool extends CreateLineTool {
  /**
   * Create a create freehand line tool.
   *
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    super(appData)

    this.mp = this.addParameter(new BooleanParameter('Modulate Thickness By Stroke Speed', false))
  }

  /**
   * Starts the creation of a free hand line.
   *
   * @param {Xfo} xfo - The xfo param.
   * @param {TreeItem} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    const color = this.cp.getValue()
    const lineThickness = this.tp.getValue()
    this.change = new CreateFreehandLineChange(parentItem, xfo, color, lineThickness)
    this.appData.undoRedoManager.addChange(this.change)

    this.xfo = xfo
    this.invxfo = xfo.inverse()
    this.stage = 1
    this.prevP = xfo.tr
    this.length = 0
  }

  /**
   * Updates the free hand line data.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    const p = this.invxfo.transformVec3(pt)
    const delta = p.subtract(this.prevP).length()
    if (delta > 0.001) {
      this.change.update({
        point: p,
      })
    }

    this.length += delta
    this.prevP = p
  }

  /**
   * Finishes free hand line creation
   *
   * @param {Vec3} pt - The pt param.
   */
  createRelease(pt) {
    if (this.length == 0) {
      this.appData.undoRedoManager.undo(false)
    }
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateFreehandLineTool
export { CreateFreehandLineTool }
