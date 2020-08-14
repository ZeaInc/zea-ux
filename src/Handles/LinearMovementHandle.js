import { Color, Xfo, GeomItem, Material, Cylinder, Cone } from '@zeainc/zea-engine'
import BaseLinearMovementHandle from './BaseLinearMovementHandle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import './Shaders/HandleShader'
import transformVertices from './transformVertices'

/**
 * Class representing a linear movement scene widget.
 *
 * @extends BaseLinearMovementHandle
 */
class LinearMovementHandle extends BaseLinearMovementHandle {
  /**
   * Create a linear movement scene widget.
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
    const handleGeom = new Cylinder(thickness, length, 64)
    handleGeom.getParameter('baseZAtZero').setValue(true)
    const tipGeom = new Cone(thickness * 4, thickness * 10, 64, true)
    const handle = new GeomItem('handle', handleGeom, handleMat)

    const tip = new GeomItem('tip', tipGeom, handleMat)
    const tipXfo = new Xfo()
    tipXfo.tr.set(0, 0, length)
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
    this.grabPos = event.grabPos
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
    const dragVec = event.holdPos.subtract(this.grabPos)

    const newXfo = this.baseXfo.clone()
    newXfo.tr.addInPlace(dragVec)

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
  }
}

export default LinearMovementHandle
export { LinearMovementHandle }
