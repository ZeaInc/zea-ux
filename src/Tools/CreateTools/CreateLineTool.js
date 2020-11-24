import { NumberParameter } from '@zeainc/zea-engine'
import CreateGeomTool from './CreateGeomTool'
import CreateLineChange from './Change/CreateLineChange'
import { UndoRedoManager } from '../../UndoRedo/index'

/**
 * Tool for creating a line tool.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateLineTool extends CreateGeomTool {
  /**
   * Create a create line tool.
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    super(appData)

    this.lineThickness = this.addParameter(new NumberParameter('LineThickness', 0.06, [0, 0.1])) // 1cm.
  }

  /**
   * Starts line geometry creation.
   *
   * @param {Xfo} xfo - The xfo param.
   */
  createStart(xfo) {
    this.change = new CreateLineChange(this.parentItem, xfo)
    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo.inverse()
    this.stage = 1
    this.length = 0.0
  }

  /**
   * Updates line structural data.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    const offset = this.xfo.transformVec3(pt)
    this.length = offset.length()
    this.change.update({ p1: offset })
  }

  /**
   * Finishes Line geometry creation.
   *
   * @param {Vec3} pt - The pt param.
   */
  createRelease(pt) {
    if (this.length == 0) {
      UndoRedoManager.getInstance().cancel()
    }
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateLineTool
export { CreateLineTool }
