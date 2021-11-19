import { Color, Xfo, GeomItem, Material, Cylinder, Cuboid, Parameter } from '@zeainc/zea-engine'
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
   * @param {string} name - The name value.
   * @param {number} length - The length value.
   * @param {number} thickness - The thickness value.
   * @param {Color} color - The color value.
   */
  constructor(name, length, thickness, color = new Color()) {
    super(name)

    this.colorParam.setValue(color)
    this.handleMat = new Material('handle', 'HandleShader')
    this.handleMat.getParameter('BaseColor').setValue(color)
    this.handleMat.getParameter('MaintainScreenSize').setValue(1)
    this.handleMat.getParameter('Overlay').setValue(0.9)

    const handleGeom = new Cylinder(thickness, length - thickness * 10, 64)
    handleGeom.getParameter('BaseZAtZero').setValue(true)
    const tipGeom = new Cuboid(thickness * 10, thickness * 10, thickness * 10)
    const handle = new GeomItem('handle', handleGeom, this.handleMat)

    const tip = new GeomItem('tip', tipGeom, this.handleMat)
    const tipXfo = new Xfo()
    tipXfo.tr.set(0, 0, length - thickness * 10)
    // tipXfo.tr.set(0, 0, length);
    // tip.getParameter('LocalXfo').setValue(tipXfo);
    // Note: the constant screen size shader
    // only works if all the handle geometries
    // are centered on the middle of the XfoHandle.
    transformVertices(tipGeom, tipXfo)

    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
    })
    this.addChild(handle)
    this.addChild(tip)
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight() {
    super.highlight()
    this.handleMat.getParameter('BaseColor').setValue(this.highlightColorParam.getValue())
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    super.unhighlight()
    this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
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
  getTargetParam() {
    return this.param ? this.param : this.globalXfoParam
  }

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    this.grabDist = event.grabDist
    this.oriXfo = this.globalXfoParam.value
    this.tmplocalXfo = this.getParameter('LocalXfo').getValue()
    const param = this.getTargetParam()
    this.baseXfo = <Xfo>param.getValue()

    this.change = new ParameterValueChange(param)
    UndoRedoManager.getInstance().addChange(this.change)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    // const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone()
    const sc = event.holdDist / this.grabDist
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
    this.getParameter('LocalXfo').setValue(this.tmplocalXfo)

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

    this.tmplocalXfo.sc.set(1, 1, 1)
    this.getParameter('LocalXfo').setValue(this.tmplocalXfo)

    const tip = this.getChildByName('tip')
    const tipXfo = tip.getParameter('LocalXfo').getValue()
    tipXfo.sc.set(1, 1, 1)
    tip.getParameter('LocalXfo').setValue(tipXfo)
  }
}

export default LinearScaleHandle
export { LinearScaleHandle }
