import {
  MathFunctions,
  Vec3,
  Xfo,
  XfoParameter,
  ZeaPointerEvent,
  ZeaMouseEvent,
  NumberParameter,
  GeomItem,
  Material,
  Color,
  Torus,
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
class AxialRotationHandle extends Handle {
  param: XfoParameter
  radiusParam: NumberParameter
  private baseXfo: Xfo
  private handleXfo: Xfo
  // Angle in degrees that the rotation handle should snap to.
  snapIncrementAngle: number = 22.5
  // set to true to force snaps to always be enabled for this handle.
  enableAngleSnapping: boolean = false
  private handleToTargetXfo: Xfo
  private vec0: Vec3
  private change: Change
  private handleMat: Material
  private handle: GeomItem

  selectionGroup: SelectionGroup

  /**
   * Create an axial rotation scene widget.
   *
   * @param name - The name value.
   */
  constructor(
    name: string,
    radius: number,
    thickness: number,
    radians: number = Math.PI * 0.5,
    color = new Color(1, 1, 0)
  ) {
    super(name)

    this.radiusParam = new NumberParameter('Radius', radius)
    this.colorParam.value = color
    this.addParameter(this.radiusParam)

    this.handleMat = new Material('handle', 'HandleShader')
    this.handleMat.getParameter('BaseColor').value = color
    this.handleMat.getParameter('MaintainScreenSize').value = 1
    this.handleMat.getParameter('Overlay').value = 0.9

    // const handleGeom = new Cylinder(radius, thickness * 2, 64, 2, false);
    const handleGeom = new Torus(thickness, radius, 64, radians)
    this.handle = new GeomItem('handle', handleGeom, this.handleMat)

    this.radiusParam.on('valueChanged', () => {
      radius = this.radiusParam.value
      handleGeom.outerRadiusParam.value = radius
      handleGeom.innerRadiusParam.value = radius * 0.02
    })

    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').value = this.colorParam.value
    })

    this.addChild(this.handle)
  }

  /**
   * highlight the handle to indicate it is under the mouse.
   */
  highlight(): void {
    super.highlight()
    this.handleMat.getParameter('BaseColor').value = this.highlightColorParam.value
  }

  /**
   * Removes the highlight from the handle once the mouse moves away.
   */
  unhighlight(): void {
    super.unhighlight()
    this.handleMat.getParameter('BaseColor').value = this.colorParam.value
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
    this.highlight()

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

    if ((event instanceof ZeaMouseEvent && event.shiftKey) || this.enableAngleSnapping) {
      // modulate the angle to snapIncrementAngle degree increments.
      const increment = MathFunctions.degToRad(this.snapIncrementAngle)
      angle = Math.floor(angle / increment) * increment
    }

    const deltaXfo = new Xfo()
    deltaXfo.ori.setFromAxisAndAngle(this.baseXfo.ori.getZaxis(), angle)

    if (this.change instanceof SelectionXfoChange) {
      this.change.setDeltaXfo(deltaXfo)
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
    if (this.change instanceof SelectionXfoChange) {
      this.change.setDone()
    }
    this.change = null
  }
}

export default AxialRotationHandle
export { AxialRotationHandle }
