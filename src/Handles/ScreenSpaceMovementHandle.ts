import { Parameter, Ray, Xfo, ZeaPointerEvent, ZeaMouseEvent, GLViewport } from '@zeainc/zea-engine'
import Handle from './Handle.js'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange.js'
import UndoRedoManager from '../UndoRedo/UndoRedoManager.js'

import { getPointerRay } from '../utility.js'
import { Change } from '../index.js'
import SelectionXfoChange from '../UndoRedo/Changes/SelectionXfoChange.js'
import SelectionGroup from '../SelectionGroup.js'

/**
 * Class representing a planar movement scene widget.
 *
 * @extends Handle
 */
class ScreenSpaceMovementHandle extends Handle {
  param: Parameter<unknown>
  baseXfo: Xfo
  change: Change
  selectionGroup: SelectionGroup
  /**
   * Create a planar movement scene widget.
   *
   * @param name - The name value
   */
  constructor(name?: string) {
    super(name)
  }

  /**
   * Sets selectionGroup so this handle can modify the items.
   *
   * @param selectionGroup - The SelectionGroup.
   */
  setSelectionGroup(selectionGroup: SelectionGroup): void {
    this.selectionGroup = selectionGroup
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

  // ///////////////////////////////////
  // Mouse events

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param event - The event param.
   */
  handlePointerDown(event: ZeaMouseEvent): void {
    this.gizmoRay = new Ray()
    const ray = getPointerRay(event)
    const viewport = event.viewport as GLViewport
    const cameraXfo = viewport.getCamera().globalXfoParam.value
    this.gizmoRay.dir = cameraXfo.ori.getZaxis()
    const param = this.getTargetParam()
    const baseXfo = <Xfo>param.value
    this.gizmoRay.start = baseXfo.tr
    const dist = ray.intersectRayPlane(this.gizmoRay)
    this.grabPos = ray.pointAtDist(dist)
    this.onDragStart(event)
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param event - The event param
   */
  handlePointerMove(event: ZeaPointerEvent): void {
    const ray = getPointerRay(event)
    const dist = ray.intersectRayPlane(this.gizmoRay)
    this.holdPos = ray.pointAtDist(dist)
    this.onDrag(event)
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param event - The event param.
   */
  handlePointerUp(event: ZeaPointerEvent): void {
    const ray = getPointerRay(event)
    if (ray) {
      const dist = ray.intersectRayPlane(this.gizmoRay)
      this.releasePos = ray.pointAtDist(dist)
    }

    this.onDragEnd(event)
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Handles the initially drag of the handle.
   *
   * @param event - The event param.
   */
  onDragStart(event: ZeaPointerEvent): void {
    this.grabPos = this.grabPos
    const param = this.getTargetParam()
    this.baseXfo = <Xfo>param.value

    if (this.selectionGroup) {
      const items = this.selectionGroup.getItems()
      this.change = new SelectionXfoChange(Array.from(items), this.globalXfoParam.value)
      UndoRedoManager.getInstance().addChange(this.change)
    } else {
      this.change = new ParameterValueChange(param)
      UndoRedoManager.getInstance().addChange(this.change)
    }
  }

  /**
   * Handles drag action of the handle.
   *
   * @param event - The event param.
   */
  onDrag(event: ZeaPointerEvent): void {
    const dragVec = this.holdPos.subtract(this.grabPos)

    if (this.selectionGroup) {
      const selectionXfoChange = <SelectionXfoChange>this.change
      const deltaXfo = new Xfo(dragVec)
      selectionXfoChange.setDeltaXfo(deltaXfo)
    } else {
      const newXfo = this.baseXfo.clone()
      newXfo.tr.addInPlace(dragVec)

      this.change.update({
        value: newXfo,
      })
    }
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param event - The event param.
   */
  onDragEnd(event: ZeaPointerEvent): void {
    this.change = null
  }
}

export default ScreenSpaceMovementHandle
export { ScreenSpaceMovementHandle }
