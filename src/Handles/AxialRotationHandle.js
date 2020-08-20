import { Color, Xfo, NumberParameter, GeomItem, Material, Torus } from '@zeainc/zea-engine'
import BaseAxialRotationHandle from './BaseAxialRotationHandle'
import './Shaders/HandleShader'

/**
 * Class representing an axial rotation scene widget.
 *
 * @extends BaseAxialRotationHandle
 */
class AxialRotationHandle extends BaseAxialRotationHandle {
  /**
   * Create an axial rotation scene widget.
   *
   * @param {string} name - The name value.
   * @param {number} radius - The radius value.
   * @param {number} thickness - The thickness value.
   * @param {Color} color - The color value.
   */
  constructor(name, radius, thickness, color) {
    super(name)

    this.__color = color
    this.__hilightedColor = new Color(1, 1, 1)
    this.radiusParam = this.addParameter(new NumberParameter('radius', radius))

    const handleMat = new Material('handle', 'HandleShader')
    handleMat.getParameter('maintainScreenSize').setValue(1)
    this.colorParam = handleMat.getParameter('BaseColor')
    this.colorParam.setValue(color)

    // const handleGeom = new Cylinder(radius, thickness * 2, 64, 2, false);
    const handleGeom = new Torus(thickness, radius, 64)
    this.handle = new GeomItem('handle', handleGeom, handleMat)
    this.handleXfo = new Xfo()

    this.radiusParam.on('valueChanged', () => {
      radius = this.radiusParam.getValue()
      handleGeom.getParameter('OuterRadius').setValue(radius)
      handleGeom.getParameter('InnerRadius').setValue(radius * 0.02)
    })

    this.addChild(this.handle)
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
   * Returns handle's global Xfo
   *
   * @return {Xfo} - The Xfo value
   */
  getBaseXfo() {
    return this.getParameter('GlobalXfo').getValue()
  }

  /**
   * Handles the initially drag interaction of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    super.onDragStart(event)

    // Hilight the material.
    this.colorParam.setValue(new Color(1, 1, 1))
  }

  /**
   * Handles drag interaction of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    super.onDrag(event)
  }

  /**
   * Handles the end of dragging interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    super.onDragEnd(event)
    this.colorParam.setValue(this.__color)
  }
}

export default AxialRotationHandle
export { AxialRotationHandle }
