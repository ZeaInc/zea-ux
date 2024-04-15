import { NumberParameter, TreeItem, Vec3, Xfo, XRControllerEvent, ZeaPointerEvent } from '@zeainc/zea-engine'
import CreateGeomTool from './CreateGeomTool'
import CreateLineChange from './Change/CreateLineChange'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'
import CreateGeomChange from './Change/CreateGeomChange'

/**
 * Tool for creating a line tool.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateLineTool extends CreateGeomTool {
  lineThickness = new NumberParameter('LineThickness', 0.01, [0, 0.1])
  change: CreateGeomChange
  length: number
  xfo: Xfo
  /**
   * Create a create line tool.
   * @param appData - The appData value.
   */
  constructor(appData: AppData, parentItem: TreeItem) {
    super(appData, parentItem)
    this.addParameter(this.lineThickness) // 1cm.
  }

  /**
   * Starts line geometry creation.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo): void {
    const color = this.colorParam.value
    const lineThickness = this.lineThickness.value
    this.change = new CreateLineChange(this.parentItem, xfo, color, lineThickness)
    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo.inverse()
    this.stage = 1
    this.length = 0.0
  }

  /**
   * Updates line structural data.
   *
   * @param pt - The pt param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    const offset = this.xfo.transformVec3(pt)
    this.length = offset.length()
    this.change.update({ p1: offset })
  }

  /**
   * Finishes Line geometry creation.
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.length == 0) {
      UndoRedoManager.getInstance().cancel()
    }
    // After completion, make it selectable.
    this.change.geomItem.setSelectable(true)
    this.stage = 0
    this.emit('actionFinished')
  }

  /**
   * The onXRControllerButtonDown method.
   *
   * @param event - The event param.
   */
  onXRControllerButtonDown(event: XRControllerEvent): void {
    super.onXRControllerButtonDown(event)
  }
}

export default CreateLineTool
export { CreateLineTool }
