import { Color, Xfo, GeomItem, Material, Cylinder, Cuboid } from '@zeainc/zea-engine'
import BaseLinearMovementHandle from './BaseLinearMovementHandle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import './Shaders/HandleShader'
import transformVertices from './transformVertices'

/**
 * Class representing a linear scale scene widget.
 *
 * @extends BaseLinearMovementHandle
 */
class LinearScaleHandle extends BaseLinearMovementHandle {
  /**
   * Create a linear scale scene widget.
   *
   * @param {string} name - The name value.
   * @param {number} length - The length value.
   * @param {number} thickness - The thickness value.
   * @param {Color} color - The color value.
   */
  constructor(name, length, thickness, color) {
    super(name)

    this.__color = color
    this.__hilightedColor = new Color(1, 1, 1)

    const handleMat = new Material('handle', 'HandleShader')
    handleMat.getParameter('maintainScreenSize').setValue(1)
    this.colorParam = handleMat.getParameter('BaseColor')
    this.colorParam.setValue(color)
    const handleGeom = new Cylinder(thickness, length - thickness * 10, 64)
    handleGeom.getParameter('BaseZAtZero').setValue(true)
    const tipGeom = new Cuboid(thickness * 10, thickness * 10, thickness * 10)
    const handle = new GeomItem('handle', handleGeom, handleMat)

    const tip = new GeomItem('tip', tipGeom, handleMat)
    const tipXfo = new Xfo()
    tipXfo.tr.set(0, 0, length - thickness * 10)
    // tipXfo.tr.set(0, 0, length);
    // tip.getParameter('LocalXfo').setValue(tipXfo);
    // Note: the constant screen size shader
    // only works if all the handle geometries
    // are centered on the middle of the XfoHandle.
    transformVertices(tipGeom.getVertexAttribute('positions'), tipXfo)

    this.addChild(handle)
    this.addChild(tip)
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight() {
    this.colorParam.setValue(this.__hilightedColor)
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    this.colorParam.setValue(this.__color)
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

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    this.grabDist = event.grabDist
    this.oriXfo = this.getParameter('GlobalXfo').getValue()
    this.tmplocalXfo = this.getParameter('LocalXfo').getValue()
    const param = this.getTargetParam()
    this.baseXfo = param.getValue()
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange(param)
      event.undoRedoManager.addChange(this.change)
    }
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

    if (this.change) {
      this.change.update({
        value: newXfo,
      })
    } else {
      this.param.setValue(newXfo)
    }
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
