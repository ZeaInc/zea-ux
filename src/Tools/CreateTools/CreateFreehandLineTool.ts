import {
  BooleanParameter,
  TreeItem,
  Vec2,
  Vec3,
  XRPoseEvent,
  Xfo,
  ZeaMouseEvent,
  ZeaPointerEvent,
  ZeaTouchEvent,
} from '@zeainc/zea-engine'
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
  private invXfo: Xfo
  private prevPointerPos: Vec2

  drawLineOnSurface = true

  /**
   * Create a create freehand line tool.
   *
   * @param appData - The appData value.
   */
  constructor(appData: AppData, parentItem: TreeItem) {
    super(appData, parentItem)
  }

  screenPosToXfo(event: ZeaMouseEvent | ZeaTouchEvent): Xfo {
    return super.screenPosToXfo(event, this.drawLineOnSurface)
  }

  /**
   * Starts the creation of a free hand line.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo, event: ZeaPointerEvent): void {
    const color = this.colorParam.value
    const lineThickness = this.lineThickness.value

    this.change = new CreateFreehandLineChange(this.parentItem, xfo, color, lineThickness)
    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo
    this.invXfo = xfo.inverse()
    this.stage = 1
    this.prevPointerPos = event.pointerPos
    this.length = 0
  }

  /**
   * Updates the free hand line data.
   *
   * @param pt - The pt param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    const pointerPos = event.pointerPos

    const p = this.invXfo.transformVec3(pt)
    const delta = pointerPos.distanceTo(this.prevPointerPos)
    // Add a point only if the distance is greater than 5 pixels.
    // This is to avoid adding too many points when the mouse is moved slowly.
    if (delta > 5) {
      this.change.update({
        point: p,
      })

      this.length += delta
      this.prevPointerPos = pointerPos
    }
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

    // After completion, make it selectable.
    this.change.geomItem.pickableParam.value = true

    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateFreehandLineTool
export { CreateFreehandLineTool }
