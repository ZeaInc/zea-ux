import CreateConeChange from './Change/CreateConeChange'
import { CreateGeomTool } from './CreateGeomTool'
import { UndoRedoManager } from '../../UndoRedo/index'

/**
 * Tool for creating a Cone geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateConeTool extends CreateGeomTool {
  /**
   * Create a create cone tool.
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    super(appData)
  }

  /**
   * Starts the creation of the geometry.
   *
   * @param {Xfo} xfo - The xfo param.
   */
  createStart(xfo) {
    this.xfo = xfo
    this.change = new CreateConeChange(this.parentItem, xfo)
    UndoRedoManager.getInstance().addChange(this.change)

    this.stage = 1
    this._radius = 0.0
    this._height = 0.0
  }

  /**
   * Updates Cone geometry structural properties.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    const vec = pt.subtract(this.xfo.tr)
    if (this.stage == 1) {
      // TODO: Rotate the cone so the base is aligned with the vector towards the controller
      this._radius = vec.length()
      this.change.update({ radius: this._radius })
    } else {
      this._height = vec.dot(this.xfo.ori.getZaxis())
      this.change.update({ height: this._height })
    }
  }

  /**
   * Finishes the creation of the Cone.
   *
   * @param {Vec3} pt - The pt param.
   */
  createRelease(pt) {
    if (this._radius == 0 || this._height == 0) {
      UndoRedoManager.getInstance().undo(false)
      this.stage = 0
      this.emit('actionFinished')
    }
    if (this.stage == 1) {
      this.stage = 2
    } else if (this.stage == 2) {
      this.stage = 0
      this.emit('actionFinished')
    }
  }
}

export default CreateConeTool
export { CreateConeTool }
