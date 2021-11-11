import CreateGeomTool from './CreateGeomTool'
import CreateSphereChange from './Change/CreateSphereChange'
import { UndoRedoManager } from '../../UndoRedo/index'

/**
 * Tool for creating Sphere geometries.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateSphereTool extends CreateGeomTool {
  /**
   * Create a create sphere tool.
   *
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    super(appData)
  }

  /**
   * Starts the creation of the sphere geometry.
   *
   * @param {Xfo} xfo - The xfo param.
   */
  createStart(xfo) {
    this.change = new CreateSphereChange(this.parentItem, xfo, this.colorParam.getValue())

    // During construction, make it note selectable.
    this.change.geomItem.setSelectable(false)

    UndoRedoManager.getInstance().addChange(this.change)
    this.xfo = xfo
    this.stage = 1
    this.radius = 0.0
  }

  /**
   * Updates the sphere geometry structural properties.
   *
   * @param {vec3} pt - The pt param.
   */
  createMove(pt) {
    this.radius = pt.distanceTo(this.xfo.tr)
    this.change.update({ radius: this.radius })
  }

  /**
   * Finishes the creation of the sphere geometry.
   *
   * @param {Vec3} pt - The pt param.
   */
  createRelease(pt) {
    if (this.radius == 0) {
      UndoRedoManager.getInstance().cancel()
    }
    // After completion, make it selectable.
    this.change.geomItem.setSelectable(true)
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateSphereTool
export { CreateSphereTool }
