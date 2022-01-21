import {
  Color,
  Xfo,
  GeomItem,
  Material,
  Cylinder,
  Cuboid,
  Parameter,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
  XfoParameter,
} from '@zeainc/zea-engine'
import BaseLinearMovementHandle from './BaseLinearMovementHandle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import './Shaders/HandleShader'
import transformVertices from './transformVertices'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'

/**
 * Class representing a linear scale scene widget.
 *
 * @extends BaseLinearMovementHandle
 */
class LinearScaleHandle extends BaseLinearMovementHandle {
  param: Parameter<unknown>
  handleMat: Material
  oriXfo: Xfo
  tmplocalXfo: Xfo
  change: ParameterValueChange
  baseXfo: Xfo
  /**
   * Create a linear scale scene widget.
   *
   * @param name - The name value.
   * @param length - The length value.
   * @param thickness - The thickness value.
   * @param color - The color value.
   */
  constructor(name: string, length: number, thickness: number, color = new Color()) {
    super(name)

    this.colorParam.value = color
    this.handleMat = new Material('handle', 'HandleShader')
    this.handleMat.getParameter('BaseColor').value = color
    this.handleMat.getParameter('MaintainScreenSize').value = 1
    this.handleMat.getParameter('Overlay').value = 0.9

    const handleGeom = new Cylinder(thickness, length - thickness * 10, 64)
    handleGeom.getParameter('BaseZAtZero').value = true
    const tipGeom = new Cuboid(thickness * 10, thickness * 10, thickness * 10)
    const handle = new GeomItem('handle', handleGeom, this.handleMat)

    const tip = new GeomItem('tip', tipGeom, this.handleMat)
    const tipXfo = new Xfo()
    tipXfo.tr.set(0, 0, length - thickness * 10)
    // tipXfo.tr.set(0, 0, length);
    // tip.localXfoParam.value = tipXfo;
    // Note: the constant screen size shader
    // only works if all the handle geometries
    // are centered on the middle of the XfoHandle.
    transformVertices(tipGeom, tipXfo)

    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').value = this.colorParam.getValue()
    })
    this.addChild(handle)
    this.addChild(tip)
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight(): void {
    super.highlight()
    this.handleMat.getParameter('BaseColor').value = this.highlightColorParam.getValue()
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight(): void {
    super.unhighlight()
    this.handleMat.getParameter('BaseColor').value = this.colorParam.getValue()
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param param - The video param.
   * @param track - The track param.
   */
  setTargetParam(param: XfoParameter, track = true): void {
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
  getTargetParam(): XfoParameter | Parameter<unknown> {
    return this.param ? this.param : this.globalXfoParam
  }

  /**
   * Handles the initially drag of the handle.
   *
   * @param event - The event param.
   */
  onDragStart(event: ZeaPointerEvent): void {
    this.oriXfo = this.globalXfoParam.value
    this.tmplocalXfo = this.localXfoParam.getValue()
    const param = this.getTargetParam()
    this.baseXfo = <Xfo>param.getValue()

    this.change = new ParameterValueChange(param)
    UndoRedoManager.getInstance().addChange(this.change)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param event - The event param.
   */
  onDrag(event: ZeaPointerEvent): void {
    // const dragVec = this.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone()
    const sc = this.holdDist / this.grabDist
    if (sc < 0.0001) return

    // const scAxis = this.oriXfo.ori.getZaxis();
    // const scX = this.baseXfo.ori.getXaxis().dot(scAxis);
    // const scY = this.baseXfo.ori.getYaxis().dot(scAxis);
    // const scZ = this.baseXfo.ori.getZaxis().dot(scAxis);
    // console.log("sc:", sc, " scX", scX, " scY:", scY, " scZ:", scZ)
    // newXfo.sc.set(scX, scY, scZ);
    newXfo.sc.set(this.baseXfo.sc.x * sc, this.baseXfo.sc.y * sc, this.baseXfo.sc.z * sc)

    // Scale inheritance is disabled for handles.
    // (XfoHandle throws away scale in _cleanGlobalXfo).
    // This means we have to apply it here to see the scale
    // widget change size.
    this.tmplocalXfo.sc.set(1, 1, sc)
    this.localXfoParam.value = this.tmplocalXfo

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

    this.tmplocalXfo.sc.set(1, 1, 1)
    this.localXfoParam.value = this.tmplocalXfo

    const tip = this.getChildByName('tip')
    const tipXfo = tip.localXfoParam.getValue()
    tipXfo.sc.set(1, 1, 1)
    tip.localXfoParam.value = tipXfo
  }
}

export default LinearScaleHandle
export { LinearScaleHandle }
