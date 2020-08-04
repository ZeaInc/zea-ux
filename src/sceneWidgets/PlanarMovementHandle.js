import Handle from './Handle.js'
import ParameterValueChange from '../undoredo/ParameterValueChange.js'

/** Class representing a planar movement scene widget.
 * @extends Handle
 */
class PlanarMovementHandle extends Handle {
  /**
   * Create a planar movement scene widget.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name)
    this.fullXfoManipulationInVR = true
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

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (this.fullXfoManipulationInVR) {
      this.activeController = event.controller
      const xfo = this.activeController.getTipXfo()
      const handleXfo = this.getParameter('GlobalXfo').getValue()
      this.grabOffset = xfo.inverse().multiply(handleXfo)
    } else {
      super.onVRControllerButtonDown(event)
    }
    return true
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.fullXfoManipulationInVR) {
      const xfo = this.activeController.getTipXfo()
      const newXfo = xfo.multiply(this.grabOffset)
      if (this.change) {
        this.change.update({
          value: newXfo,
        })
      } else {
        const param = this.getTargetParam()
        param.setValue(newXfo)
      }
    } else {
      super.onVRPoseChanged(event)
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.fullXfoManipulationInVR) {
      this.change = null
    } else {
      super.onVRControllerButtonUp(event)
    }
  }
}
export { PlanarMovementHandle }
