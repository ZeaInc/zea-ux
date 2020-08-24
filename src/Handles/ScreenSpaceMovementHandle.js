import { Ray } from '@zeainc/zea-engine'
import Handle from './Handle.js'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange.js'
import UndoRedoManager from '../UndoRedo/UndoRedoManager.js'

/**
 * Class representing a planar movement scene widget.
 *
 * @extends Handle
 */
class ScreenSpaceMovementHandle extends Handle {
  /**
   * Create a planar movement scene widget.
   *
   * @param {string} name - The name value
   */
  constructor(name) {
    super(name)
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param {Parameter} param - The video param.
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
   * Returns target's global xfo parameter.
   *
   * @return {Parameter} - returns handle's target global Xfo.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
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
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent} event - The event param
   * @return {boolean} - The return value
   */
  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay)
    event.holdPos = event.mouseRay.pointAtDist(dist)
    this.onDrag(event)
    return true
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
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
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    this.grabPos = event.grabPos
    const param = this.getTargetParam()
    this.baseXfo = param.getValue()
    {
      this.change = new ParameterValueChange(param)
      UndoRedoManager.getInstance().addChange(this.change)
    }
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
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
   * Handles the end of dragging the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    this.change = null
  }
}

export default ScreenSpaceMovementHandle
export { ScreenSpaceMovementHandle }
