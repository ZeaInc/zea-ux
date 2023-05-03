import { NumberParameter, Vec3, Xfo, XRControllerEvent, ZeaPointerEvent } from '@zeainc/zea-engine'
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

let keyPressHandler: EventListener

class CreateMultiLineTool extends CreateGeomTool {
  lineThickness = new NumberParameter('LineThickness', 0.01, [0, 0.1])
  change: CreateGeomChange
  length: number
  xfo: Xfo
  vertices: Vec3[] = []
  distanceToSnap = 0.3
  pointerVertex: Vec3 = new Vec3()
  tailVertex: Vec3 = new Vec3()
  lastClickTime = 0
  lastClickPt = new Vec3()
  doubleClickTime = 500
  doubleClickMaxDistance = 0.5

  /**
   * Create a create line tool.
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)
    this.addParameter(this.lineThickness) // 1cm.
  }

  /**
   * Starts line geometry creation.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo): void {
    if (this.stage == 1) return

    const color = this.colorParam.getValue()
    const lineThickness = this.lineThickness.getValue()
    this.change = new CreateMultiLineChange(this.parentItem, xfo, color, lineThickness)
    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo.inverse()
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
  createMove(pt: Vec3, event: any): void {
    if (event.altKey) return

    this.pointerVertex = this.xfo.transformVec3(pt)

    if (this.shouldClosePoligon()) {
      this.tailVertex = this.vertices[0] // same as first
    } else if (event.shiftKey) {
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
    // let closest = 'x'
    // let lowest = vertex.x

    // for (const axis of ['y', 'z']) {
    //   if (Math.abs(vertex[axis]) < Math.abs(lowest)) {
    //     lowest = vertex[axis]
    //     closest = axis
    //   }
    // }

    // console.log('snap ', vertex)

    // vertex.x = 0

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

      // const delta = vertex.subtract(prevVertex)
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
  createRelease(pt: Vec3): void {
    let shouldFinish = false

    if (this.shouldClosePoligon()) {
      shouldFinish = true
    }

    const isDoubleClick =
      pt.distanceTo(this.lastClickPt) < this.doubleClickMaxDistance &&
      Date.now() - this.lastClickTime < this.doubleClickTime

    if (isDoubleClick) {
      shouldFinish = true
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

  shouldClosePoligon() {
    let shouldClosePoligon = false
    if (this.vertices.length > 2) {
      const distanceToFirst = this.pointerVertex.distanceTo(this.vertices[0])
      if (distanceToFirst < this.distanceToSnap) {
        shouldClosePoligon = true
      }
    }
    return shouldClosePoligon
  }

  handleKeyPress(event: any): void {
    console.log(event)

    if (event.key == 'Escape') {
      UndoRedoManager.getInstance().cancel()
      this.resetTool()
    }

    if (event.key == 'Enter') {
      const vertices = [...this.vertices]
      if (this.shouldClosePoligon()) {
        vertices.push(this.pointerVertex)

        // if the last vertex closes the polygon add a dummy
        // vertex at the end, to keep the closing segment
        vertices.push(new Vec3())
      }
      this.change.update({
        shouldFinish: true,
        vertices: [...this.vertices, this.tailVertex],
      })
      this.resetTool()
    }

    if (event.key == 'Backspace') {
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