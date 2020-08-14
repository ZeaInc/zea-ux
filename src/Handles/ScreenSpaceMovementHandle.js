import { Ray } from '@zeainc/zea-engine'
import Handle from './Handle.js'
import ParameterValueChange from '../undoredo/ParameterValueChange.js'

/** Class representing a planar movement scene widget.
 * @extends Handle
 */
class ScreenSpaceMovementHandle extends Handle {
  /**
   * Create a planar movement scene widget.
   */
  constructor(name) {
    super(name)
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param
    if (track) {
      const __updateGizmo = () => {
        this.getParameter('GlobalXfo').setValue(param.getValue())
      }
      __updateGizmo()
      param.on('valueChanged', __updateGizmo)
    }
  }

  /**
   * The getTargetParam method.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The handleMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseDown(event) {
    this.gizmoRay = new Ray()
    // this.gizmoRay.dir = event.viewport.getCamera().getParameter('GlobalXfo').getValue().ori.getZaxis().negate()
    this.gizmoRay.dir = event.mouseRay.dir.negate()
    const param = this.getTargetParam()
    const baseXfo = param.getValue()
    this.gizmoRay.pos = baseXfo.tr
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay)
    event.grabPos = event.mouseRay.pointAtDist(dist)
    this.onDragStart(event)
    return true
  }

  /**
   * The handleMouseMove method.
   * @param {any} event - The event param.
   */
  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay)
    event.holdPos = event.mouseRay.pointAtDist(dist)
    this.onDrag(event)
    return true
  }

  /**
   * The handleMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseUp(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay)
    event.releasePos = event.mouseRay.pointAtDist(dist)
    this.onDragEnd(event)
    return true
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.grabPos = event.grabPos
    const param = this.getTargetParam()
    this.baseXfo = param.getValue()
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange(param)
      event.undoRedoManager.addChange(this.change)
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos)

    const newXfo = this.baseXfo.clone()
    newXfo.tr.addInPlace(dragVec)

    if (this.change) {
      this.change.update({
        value: newXfo,
      })
    } else {
      const param = this.getTargetParam()
      param.setValue(newXfo)
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null
  }
}
export { ScreenSpaceMovementHandle }
