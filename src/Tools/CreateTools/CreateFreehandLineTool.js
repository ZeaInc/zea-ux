import { BooleanParameter } from '@zeainc/zea-engine'
import CreateLineTool from './CreateLineTool'
import CreateFreehandLineChange from './Change/CreateFreehandLineChange'
import { UndoRedoManager } from '../../UndoRedo/index'

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
   *
   *
   * @memberof CreateFreehandLineTool
   */
  activateTool() {
    super.activateTool()
    this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'
  }

  /**
   * Starts the creation of a free hand line.
   *
   * @param {Xfo} xfo - The xfo param.
   * @param {TreeItem} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    const color = this.lineColor.getValue()
    const lineThickness = this.lineThickness.getValue()

    this.change = new CreateFreehandLineChange(parentItem, xfo, color, lineThickness)
    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo
    this.invXfo = xfo.inverse()
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
    const p = this.invXfo.transformVec3(pt)
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
      UndoRedoManager.getInstance().undo(false)
    }

    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateFreehandLineTool
export { CreateFreehandLineTool }
