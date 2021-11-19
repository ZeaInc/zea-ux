import CreateCircleChange from './Change/CreateCircleChange'
import CreateGeomTool from './CreateGeomTool'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/temp'
import { TreeItem, Xfo } from '@zeainc/zea-engine'

/**
 * Tool for creating a circle geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateCircleTool extends CreateGeomTool {
  appData: AppData
  change: CreateCircleChange
  parentItem: TreeItem
  xfo: Xfo
  stage: number
  radius: number
  /**
   * Create a create circle tool.
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
    this.change = new CreateCircleChange(this.parentItem, xfo)
    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo
    this.stage = 1
    this.radius = 0.0
  }

  /**
   * Updates Circle geometry radius.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    this.radius = pt.distanceTo(this.xfo.tr)
    this.change.update({ radius: this.radius })
    this.appData.renderer.forceRender()
  }

  /**
   * Finishes geometry creation.
   *
   * @param {Vec3} pt - The pt param.
   */
  createRelease(pt) {
    if (this.radius == 0) {
      UndoRedoManager.getInstance().cancel()
    }

    this.change = null
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateCircleTool
export { CreateCircleTool }
