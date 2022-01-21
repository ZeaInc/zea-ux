import Handle from './Handle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import {
  Parameter,
  Vec3,
  Xfo,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
} from '@zeainc/zea-engine'

/**
 * Class representing a planar movement scene widget.
 *
 * @extends Handle
 */
class PlanarMovementHandle extends Handle {
  param: Parameter<unknown>
  fullXfoManipulationInVR: boolean
  grabOffset: Vec3
  baseXfo: Xfo
  change: ParameterValueChange

  /**
   * Create a planar movement scene widget.
   *
   * @param name - The name value.
   */
  constructor(name: string) {
    super(name)
    this.fullXfoManipulationInVR = true
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param param - The video param.
   * @param track - The track param.
   */
  setTargetParam(param: any, track = true): void {
    this.param = param
    if (track) {
      const __updateGizmo = () => {
        this.globalXfoParam.value = param.getValue()
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
   * @param event - The event param.
   */
  onDragStart(event: ZeaPointerEvent): void {
    this.grabPos = this.grabPos
    const param = this.getTargetParam()
    this.baseXfo = <Xfo>param.value

    this.change = new ParameterValueChange(param)
    UndoRedoManager.getInstance().addChange(this.change)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param event - The event param.
   */
  onDrag(event: ZeaPointerEvent): void {
    const dragVec = this.holdPos.subtract(this.grabPos)

    const newXfo = this.baseXfo.clone()
    newXfo.tr.addInPlace(dragVec)

    this.change.update({
      value: newXfo,
    })
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param event - The event param.
   */
  onDragEnd(event: ZeaPointerEvent): void {
    this.change = null
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * Event fired when a VR controller button is pressed over the handle.
   *
   * @param event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonDown(event: XRControllerEvent): void {
    if (this.fullXfoManipulationInVR) {
      this.activeController = event.controller
      const xfo = this.activeController.getTipXfo()
      const handleXfo = this.globalXfoParam.value
      this.grabOffset = xfo.inverse().multiply(handleXfo)
    } else {
      super.onVRControllerButtonDown(event)
    }
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param event - The event param.
   */
  onVRPoseChanged(event: XRControllerEvent): void {
    if (this.fullXfoManipulationInVR) {
      const xfo = this.activeController.getTipXfo()
      const newXfo = xfo.multiply(this.grabOffset)
      if (this.change) {
        this.change.update({
          value: newXfo,
        })
      } else {
        const param = this.getTargetParam()
        param.value = newXfo
      }
    } else {
      super.onVRPoseChanged(event)
    }
  }

  /**
   * Event fired when a VR controller button is released over the handle.
   *
   * @param event - The event param.
   */
  onVRControllerButtonUp(event: XRControllerEvent): void {
    if (this.fullXfoManipulationInVR) {
      this.change = null
    } else {
      super.onVRControllerButtonUp(event)
    }
  }
}

export default PlanarMovementHandle
export { PlanarMovementHandle }
