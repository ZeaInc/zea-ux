import { BooleanParameter } from '@zeainc/zea-engine'
import CreateLineTool from './CreateLineTool'
import CreateFreehandLineChange from './Change/CreateFreehandLineChange'

/**
 * Class representing a create freehand line tool.
 * @extends CreateLineTool
 */
class CreateFreehandLineTool extends CreateLineTool {
  /**
   * Create a create freehand line tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData)

    this.mp = this.addParameter(new BooleanParameter('Modulate Thickness By Stroke Speed', false))
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
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
   * The createMove method.
   * @param {any} pt - The pt param.
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
   * The createRelease method.
   * @param {any} pt - The pt param.
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
