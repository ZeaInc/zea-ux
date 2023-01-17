import {
  MathFunctions,
  Vec3,
  Xfo,
  XfoParameter,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  NumberParameter,
} from '@zeainc/zea-engine'
import Handle from './Handle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import SelectionXfoChange from '../UndoRedo/Changes/SelectionXfoChange'
import SelectionGroup from '../SelectionGroup'
import { Change } from '../UndoRedo/Change'

/**
 * Class representing an axial rotation scene widget.
 *
 * @extends Handle
 */
class BaseAxialRotationHandle extends Handle {
  param: XfoParameter
  private baseXfo: Xfo
  private handleXfo: Xfo
  private handleToTargetXfo: Xfo
  private vec0: Vec3
  private change: Change
  selectionGroup: SelectionGroup

  /**
   * Create an axial rotation scene widget.
   *
   * @param name - The name value.
   */
  constructor(name: string) {
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
   * Sets the target parameter for this manipulator.
   * This parameter will be modified by interactions on the manipulator.
   *
   * @param param - The parameter that will be modified during manipulation
   */
  setTargetParam(param: XfoParameter): void {
    this.param = param
  }

  /**
   * Returns target's global xfo parameter.
   *
   * @return {Parameter} - returns parameter
   */
  getTargetParam(): XfoParameter {
    return this.param ? this.param : this.globalXfoParam
  }

  /**
   * Handles the initially drag of the handle.
   *
   * @param event - The event param.
   */
  onDragStart(event: ZeaPointerEvent): void {
    this.baseXfo = this.globalXfoParam.value.clone()

    this.vec0 = this.grabPos.subtract(this.baseXfo.tr)
    this.vec0.normalizeInPlace()

    // this.offsetXfo = this.localXfoParam.value.inverse()
    if (this.selectionGroup) {
      const items = this.selectionGroup.getItems()
      this.change = new SelectionXfoChange(Array.from(items), this.baseXfo)
      UndoRedoManager.getInstance().addChange(this.change)
    } else {
      const invBaseXfo = this.baseXfo.inverse()
      const param = this.getTargetParam() as XfoParameter
      this.handleToTargetXfo = invBaseXfo.multiply(param.value)
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
    const vec1 = this.holdPos.subtract(this.baseXfo.tr)
    vec1.normalizeInPlace()
    let angle = this.vec0.angleTo(vec1)
    if (this.vec0.cross(vec1).dot(this.baseXfo.ori.getZaxis()) < 0) angle = -angle

    if ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && event.shiftKey) {
      // modulate the angle to X degree increments.
      const increment = MathFunctions.degToRad(22.5)
      angle = Math.floor(angle / increment) * increment
    }

    const deltaXfo = new Xfo()
    deltaXfo.ori.setFromAxisAndAngle(this.baseXfo.ori.getZaxis(), angle)

    if (this.selectionGroup) {
      const selectionXfoChange = <SelectionXfoChange>this.change
      selectionXfoChange.setDeltaXfo(deltaXfo)
    } else {
      // Add the values in global space.
      const newBase = this.baseXfo.clone()
      newBase.ori = deltaXfo.ori.multiply(newBase.ori)
      const value = newBase.multiply(this.handleToTargetXfo)

      this.change.update({
        value,
      })
    }
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param event - The event param.
   */
  onDragEnd(event: ZeaPointerEvent): void {
    if (this.selectionGroup) {
      const selectionXfoChange = <SelectionXfoChange>this.change
      selectionXfoChange.setDone()
    }
    this.change = null
  }
}

export default BaseAxialRotationHandle
export { BaseAxialRotationHandle }
