import CreateGeomTool from './CreateGeomTool'
import CreateRectChange from './Change/CreateRectChange'
import { UndoRedoManager } from '../../UndoRedo/index'

/**
 * Tool for creating a rectangle geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateRectTool extends CreateGeomTool {
  /**
   * Create a create rect tool.
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    super(appData)
  }

  /**
   * Starts the creation of a rectangle geometry.
   *
   * @param {Xfo} xfo - The xfo param.
   * @param {TreeItem} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateRectChange(parentItem, xfo)
    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo
    this.invXfo = xfo.inverse()
    this.stage = 1
    this._size = 0.0
  }

  /**
   * Updated the rectangle geometry structural properties.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    if (this.stage == 1) {
      const delta = this.invXfo.transformVec3(pt)

      ;(this._size = Math.abs(delta.x)), Math.abs(delta.y)

      // const delta = pt.subtract(this.xfo.tr)
      this.change.update({
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5)),
      })
    } else {
      const vec = this.invXfo.transformVec3(pt)
      this.change.update({ height: vec.y })
    }
  }

  /**
   * Finishes the creation of a rectangle geometry.
   *
   * @param {Vec3} pt - The pt param.
   * @param {GLViewport} viewport - The viewport param.
   */
  createRelease(pt, viewport) {
    if (this._size == 0) {
      UndoRedoManager.getInstance().undo(false)
    }
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateRectTool
export { CreateRectTool }
