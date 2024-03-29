import { BooleanParameter, Vec3, XRControllerEvent, Xfo, ZeaPointerEvent } from '@zeainc/zea-engine'
import CreateLineTool from './CreateLineTool'
import CreateFreehandLineChange from './Change/CreateFreehandLineChange'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'

/**
 * Tool for creating a free hand line.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateLineTool
 */
class CreateFreehandLineTool extends CreateLineTool {
  mp = new BooleanParameter('Modulate Thickness By Stroke Speed', false)

  invXfo: Xfo
  prevP: Vec3
  /**
   * Create a create freehand line tool.
   *
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)
    this.addParameter(this.mp)
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside the viewport, while tool is activated.
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    if (event.pointerType === 'xr') {
      this.onVRPoseChanged(event as XRControllerEvent)
    } else if (this.stage > 0) {
      const snapToSurfaceUnderPointer = true
      const xfo = this.screenPosToXfo(event, snapToSurfaceUnderPointer)
      this.createMove(xfo.tr, event)
      event.stopPropagation()
    }
  }

  /**
   * Starts the creation of a free hand line.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo, event: ZeaPointerEvent): void {
    const color = this.colorParam.getValue()
    const lineThickness = this.lineThickness.getValue()

    this.change = new CreateFreehandLineChange(this.parentItem, xfo)
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
   * @param pt - The pt param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    const p = this.invXfo.transformVec3(pt)
    const delta = p.subtract(this.prevP).length()
    this.change.update({
      point: p,
    })

    this.length += delta
    this.prevP = p
  }

  /**
   * Finishes free hand line creation
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.length == 0) {
      UndoRedoManager.getInstance().cancel()
    }

    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateFreehandLineTool
export { CreateFreehandLineTool }
