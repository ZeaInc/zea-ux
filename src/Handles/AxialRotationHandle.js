import { Color, Xfo, NumberParameter, GeomItem, Material, Torus } from '@zeainc/zea-engine'
import BaseAxialRotationHandle from './BaseAxialRotationHandle'
import './Shaders/HandleShader'

/**
 * Class representing an axial rotation scene widget. It has a `Torus` shape and is used to rotate objects around the specified axes.
 * You can do it by specifying the localXfo orientation:
 *
 * ```javascript
 * const xfo1 = new Xfo()
 * // This is rotation over `Y` axis
 * xfo1.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
 * axialRotationHandle.getParameter('LocalXfo').setValue(xfo1)
 * ```
 * **Parameters**
 * * **Radius(`NumberParameter`):** Specifies the radius of the handler.
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
  constructor(name, radius, thickness, color = new Color(1, 1, 0)) {
    super(name)

    this.radiusParam = this.addParameter(new NumberParameter('Radius', radius))
    this.colorParam.setValue(color)

    this.handleMat = new Material('handle', 'HandleShader')
    this.handleMat.getParameter('MaintainScreenSize').setValue(1)
    this.handleMat.getParameter('BaseColor').setValue(color)

    // const handleGeom = new Cylinder(radius, thickness * 2, 64, 2, false);
    const handleGeom = new Torus(thickness, radius, 64)
    this.handle = new GeomItem('handle', handleGeom, this.handleMat)
    this.handleXfo = new Xfo()

    this.radiusParam.on('valueChanged', () => {
      radius = this.radiusParam.getValue()
      handleGeom.getParameter('OuterRadius').setValue(radius)
      handleGeom.getParameter('InnerRadius').setValue(radius * 0.02)
    })

    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
    })

    this.addChild(this.handle)
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight() {
    this.handleMat.getParameter('BaseColor').setValue(this.highlightColorParam.getValue())
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
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
  }
}

export default AxialRotationHandle
export { AxialRotationHandle }
