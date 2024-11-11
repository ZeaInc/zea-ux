import {
  Color,
  Xfo,
  GeomItem,
  Material,
  Cylinder,
  Cone,
  Parameter,
  XfoParameter,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import BaseLinearMovementHandle from './BaseLinearMovementHandle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import './Shaders/HandleShader'
import transformVertices from './transformVertices'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import SelectionGroup from '../SelectionGroup'
import SelectionXfoChange from '../UndoRedo/Changes/SelectionXfoChange'
import { Change, HandleMaterial } from '..'

/**
 * Class representing a linear movement scene widget.
 *
 * @extends BaseLinearMovementHandle
 */
class LinearMovementHandle extends BaseLinearMovementHandle {
  private handleMat: HandleMaterial
  private baseXfo: Xfo
  private change: Change

  param: XfoParameter
  selectionGroup: SelectionGroup
  /**
   * Create a linear movement scene widget.
   *
   * @param name - The name value.
   * @param length - The length value.
   * @param thickness - The thickness value.
   * @param color - The color value.
   */
  constructor(name?: string, length = 0.1, thickness = 0.003, color = new Color()) {
    super(name)
    this.colorParam.value = color

    this.handleMat = new HandleMaterial('handle')
    this.handleMat.baseColorParam.value = color
    this.handleMat.maintainScreenSizeParam.value = 1
    this.handleMat.overlayParam.value = 0.9

    const handleGeom = new Cylinder(thickness, length, 64)
    handleGeom.baseZAtZeroParam.value = true
    const tipGeom = new Cone(thickness * 8, thickness * 16, 64, true)
    const handle = new GeomItem('handle', handleGeom, this.handleMat)

    const tip = new GeomItem('tip', tipGeom, this.handleMat)
    const tipXfo = new Xfo()
    tipXfo.tr.set(0, 0, length)

    transformVertices(tipGeom, tipXfo)

    this.colorParam.on('valueChanged', () => {
      this.handleMat.baseColorParam.value = this.colorParam.value
    })

    this.addChild(handle)
    this.addChild(tip)
  }

  /**
   * highlight the handle to indicate it is under the mouse.
   */
  highlight(): void {
    super.highlight()
    this.handleMat.baseColorParam.value = this.highlightColorParam.value
  }

  /**
   * Removes the highlight from the handle once the mouse moves away.
   */
  unhighlight(): void {
    super.unhighlight()
    this.handleMat.baseColorParam.value = this.colorParam.value
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
  setTargetParam(param: Parameter<any>): void {
    this.param = param
  }

  /**
   * Returns target's global xfo parameter.
   *
   * @return - returns handle's target global Xfo.
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
    const param = this.getTargetParam() as XfoParameter
    this.baseXfo = param.value

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

    if (this.change instanceof SelectionXfoChange) {
      const deltaXfo = new Xfo(dragVec)
      this.change.setDeltaXfo(deltaXfo)
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
    if (this.change instanceof SelectionXfoChange) {
      this.change.setDone()
    }
    this.change = null
  }
}

export default LinearMovementHandle
export { LinearMovementHandle }
