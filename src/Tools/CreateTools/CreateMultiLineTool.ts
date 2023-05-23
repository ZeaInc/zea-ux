import { GLViewport, Vec3, Xfo, XRControllerEvent, ZeaMouseEvent, ZeaPointerEvent } from '@zeainc/zea-engine'
import CreateGeomTool from './CreateGeomTool'
import CreateMultiLineChange from './Change/CreateMultiLineChange'
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

let keyPressHandler: (event: KeyboardEvent) => void

class CreateMultiLineTool extends CreateGeomTool {
  change: CreateGeomChange
  length: number
  inverseXfo: Xfo
  vertices: Vec3[] = []
  distanceToSnap = 20 * window.devicePixelRatio
  pointerVertex: Vec3 = new Vec3()
  tailVertex: Vec3 = new Vec3()
  lastClickTime = 0
  lastClickPt = new Vec3()
  doubleClickTime = 300
  doubleClickMaxDistance = 10 * window.devicePixelRatio

  /**
   * Create a create line tool.
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)
  }

  /**
   * Starts line geometry creation.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo): void {
    if (this.stage == 1) return

    this.change = new CreateMultiLineChange(this.parentItem, xfo)
    UndoRedoManager.getInstance().addChange(this.change)

    this.inverseXfo = xfo.inverse()
    this.stage = 1
    this.length = 0.0

    keyPressHandler = this.handleKeyPress.bind(this)
    document.addEventListener('keyup', keyPressHandler)
  }

  /**
   * Updates line structural data.
   *
   * @param pt - The pt param.
   * @param event - The event param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    if (event instanceof ZeaMouseEvent && event.altKey) return

    this.pointerVertex = this.inverseXfo.transformVec3(pt)

    // Disable snapping if the ctrlKey is not pressed.
    if (this.shouldClosePolygon(event) && event instanceof ZeaMouseEvent && !event.ctrlKey) {
      this.tailVertex = this.vertices[0] // same as first
    } else if (event instanceof ZeaMouseEvent && event.shiftKey) {
      this.tailVertex = this.snapToClosestAxis(this.pointerVertex)
    } else {
      this.tailVertex = this.pointerVertex
    }

    this.change.update({
      shouldFinish: false,
      vertices: [...this.vertices, this.tailVertex],
    })
  }

  snapToClosestAxis(vertex: Vec3) {
    if (this.vertices.length == 0) {
      return vertex
    } else {
      const prevVertex = this.vertices[this.vertices.length - 1] // same as first

      const xsnap = vertex.clone()
      xsnap.x = prevVertex.x

      const ysnap = vertex.clone()
      ysnap.y = prevVertex.y

      const xysnap = vertex.subtract(prevVertex)
      const value = (Math.abs(xysnap.x) + Math.abs(xysnap.y)) * 0.5
      if (xysnap.x < 0) {
        xysnap.x = -value
      } else {
        xysnap.x = value
      }
      if (xysnap.y < 0) {
        xysnap.y = -value
      } else {
        xysnap.y = value
      }
      xysnap.addInPlace(prevVertex)

      const xsnapDist = vertex.distanceTo(xsnap)
      const ysnapDist = vertex.distanceTo(ysnap)
      const xysnapDist = vertex.distanceTo(xysnap)

      if (xsnapDist < ysnapDist && xsnapDist < xysnapDist) {
        return xsnap
      }
      if (ysnapDist < xsnapDist && ysnapDist < xysnapDist) {
        return ysnap
      }
      return xysnap
    }
  }

  /**
   * Add vertex or finish Line geometry creation.
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    let shouldFinish = false

    if (this.shouldClosePolygon(event)) {
      shouldFinish = true
    }

    const viewport = event.viewport as GLViewport
    const screenPt = viewport.calcScreenPosFromWorldPos(pt)
    const lastScreenPt = viewport.calcScreenPosFromWorldPos(this.lastClickPt)

    const isDoubleClick =
      screenPt.distanceTo(lastScreenPt) < this.doubleClickMaxDistance &&
      Date.now() - this.lastClickTime < this.doubleClickTime

    if (isDoubleClick) {
      shouldFinish = true
      event.stopPropagation()

      //@ts-ignore
      event.preventDefault()
    } else {
      // Add vertex only if not a double click
      this.vertices.push(this.tailVertex)
    }

    this.lastClickTime = Date.now()
    this.lastClickPt = pt

    this.change.update({
      shouldFinish,
      vertices: [...this.vertices, this.tailVertex],
    })

    if (shouldFinish) {
      this.emit('actionFinished')
      this.resetTool()
    }
  }

  protected shouldClosePolygon(event: ZeaPointerEvent) {
    // const viewPos = event.pointerRay.start
    const viewport = event.viewport as GLViewport

    let shouldClosePolygon = false
    if (this.vertices.length > 2) {
      const vertices0_2d = viewport.calcScreenPosFromWorldPos(this.vertices[0])
      const pointerVertex_2d = viewport.calcScreenPosFromWorldPos(this.pointerVertex)
      const distanceToFirst = pointerVertex_2d.distanceTo(vertices0_2d)

      if (distanceToFirst < this.distanceToSnap) {
        shouldClosePolygon = true
      }
    }
    return shouldClosePolygon
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key == 'Escape') {
      UndoRedoManager.getInstance().cancel()
      this.resetTool()
      this.emit('actionFinished')
    } else if (event.key == 'Enter') {
      // Finish the line
      this.change.update({
        shouldFinish: true,
        vertices: [...this.vertices, this.tailVertex],
      })
      this.resetTool()
      this.emit('actionFinished')
    } else if (event.key == 'Backspace') {
      this.vertices.pop()
      this.change.update({
        shouldFinish: false,
        vertices: this.vertices,
      })
    }
  }

  resetTool() {
    this.stage = 0
    this.vertices = []
    this.pointerVertex = new Vec3()
    this.tailVertex = new Vec3()
    document.removeEventListener('keyup', keyPressHandler)
  }

  /**
   * The onVRControllerButtonDown method.
   *
   * @param event - The event param.
   */
  onVRControllerButtonDown(event: XRControllerEvent): void {
    //
  }
}

export default CreateMultiLineTool
export { CreateMultiLineTool }
