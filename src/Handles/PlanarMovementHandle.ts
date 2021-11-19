import Handle from './Handle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Parameter, Vec3, Xfo } from '@zeainc/zea-engine'

/**
 * Class representing a planar movement scene widget.
 *
 * @extends Handle
 */
class PlanarMovementHandle extends Handle {
  param: Parameter<unknown>
  fullXfoManipulationInVR: boolean
  grabPos: Vec3
  grabOffset: Vec3
  baseXfo: Xfo
  change: ParameterValueChange

  /**
   * Create a planar movement scene widget.
   *
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name)
    this.fullXfoManipulationInVR = true
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
        this.globalXfoParam.setValue(param.getValue())
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
  getTargetParam(): Parameter<unknown> {
    return this.param ? this.param : this.globalXfoParam
  }

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    this.grabPos = event.grabPos
    const param = this.getTargetParam()
    this.baseXfo = <Xfo>param.value

    this.change = new ParameterValueChange(param)
    UndoRedoManager.getInstance().addChange(this.change)
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

    this.change.update({
      value: newXfo,
    })
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    this.change = null
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * Event fired when a VR controller button is pressed over the handle.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonDown(event) {
    if (this.fullXfoManipulationInVR) {
      this.activeController = event.controller
      const xfo = this.activeController.getTipXfo()
      const handleXfo = this.globalXfoParam.value
      this.grabOffset = xfo.inverse().multiply(handleXfo)
    } else {
      super.onVRControllerButtonDown(event)
    }
    return true
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
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
   * Event fired when a VR controller button is released over the handle.
   *
   * @param {object} event - The event param.
   */
  onVRControllerButtonUp(event) {
    if (this.fullXfoManipulationInVR) {
      this.change = null
    } else {
      super.onVRControllerButtonUp(event)
    }
  }
}

export default PlanarMovementHandle
export { PlanarMovementHandle }
