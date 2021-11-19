import { NumberParameter } from '@zeainc/zea-engine'
import CreateGeomTool from './CreateGeomTool'
import CreateLineChange from './Change/CreateLineChange'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/temp'

/**
 * Tool for creating a line tool.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateLineTool extends CreateGeomTool {
  lineThickness
  change
  length
  xfo
  /**
   * Create a create line tool.
   * @param {object} appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)

    this.lineThickness = this.addParameter(new NumberParameter('LineThickness', 0.01, [0, 0.1])) // 1cm.
  }

  /**
   * Starts line geometry creation.
   *
   * @param {Xfo} xfo - The xfo param.
   */
  createStart(xfo) {
    const color = this.colorParam.getValue()
    const lineThickness = this.lineThickness.getValue()
    this.change = new CreateLineChange(this.parentItem, xfo, color, lineThickness)
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

  /**
   * The onVRControllerButtonDown method.
   *
   * @param {object} event - The event param.
   */
  onVRControllerButtonDown(event) {
    if (this.stage == 0) {
      const stageScale = event.viewport.__stageScale
      this.lineThickness.setValue(stageScale * 0.003)
    }
    super.onVRControllerButtonDown(event)
  }
}

export default CreateLineTool
export { CreateLineTool }
