import {
  Color,
  Xfo,
  ColorParameter,
  GeomItem,
  Material,
  Cylinder,
  Cone,
} from '@zeainc/zea-engine'

import { BaseLinearMovementHandle } from './BaseLinearMovementHandle.js'
import ParameterValueChange from '../undoredo/Changes/ParameterValueChange.js'
import './Shaders/HandleShader'
import transformVertices from './transformVertices'

/** Class representing a linear movement scene widget.
 * @extends BaseLinearMovementHandle
 */
class LinearMovementHandle extends BaseLinearMovementHandle {
  /**
   * Create a linear movement scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
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
   * The highlight method.
   */
  highlight() {
    this.colorParam.setValue(this.__hilightedColor)
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.colorParam.setValue(this.__color)
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The video param.
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
   * The getTargetParam method.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
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
   * The onDrag method.
   * @param {any} event - The event param.
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
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null
  }
}

export { LinearMovementHandle }
