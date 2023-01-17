import { Color, Xfo, NumberParameter, GeomItem, Material, Torus, ZeaPointerEvent } from '@zeainc/zea-engine'

import BaseAxialRotationHandle from './BaseAxialRotationHandle'
import './Shaders/HandleShader'

/**
 * Class representing an axial rotation scene widget. It has a `Torus` shape and is used to rotate objects around the specified axes.
 * You can do it by specifying the localXfo orientation:
 *
 * ```javascript
 * const xfo = new Xfo()
 * // This is rotation over `Y` axis
 * xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
 * axialRotationHandle.localXfoParam.value = xfo
 * ```
 * **Parameters**
 * * **Radius(`NumberParameter`):** Specifies the radius of the handler.
 *
 * @extends BaseAxialRotationHandle
 */
class AxialRotationHandle extends BaseAxialRotationHandle {
  radiusParam: NumberParameter
  private handleMat: Material
  handle: GeomItem
  /**
   * Create an axial rotation scene widget.
   *
   * @param name - The name value.
   * @param radius - The radius value.
   * @param thickness - The thickness value.
   * @param color - The color value.
   */
  constructor(name: string, radius: number, thickness: number, color = new Color(1, 1, 0)) {
    super(name)

    this.radiusParam = new NumberParameter('Radius', radius)
    this.colorParam.value = color
    this.addParameter(this.radiusParam)

    this.handleMat = new Material('handle', 'HandleShader')
    this.handleMat.getParameter('BaseColor').value = color
    this.handleMat.getParameter('MaintainScreenSize').value = 1
    this.handleMat.getParameter('Overlay').value = 0.9

    // const handleGeom = new Cylinder(radius, thickness * 2, 64, 2, false);
    const handleGeom = new Torus(thickness, radius, 64, Math.PI * 0.5)
    this.handle = new GeomItem('handle', handleGeom, this.handleMat)

    this.radiusParam.on('valueChanged', () => {
      radius = this.radiusParam.getValue()
      handleGeom.outerRadiusParam.value = radius
      handleGeom.innerRadiusParam.value = radius * 0.02
    })

    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').value = this.colorParam.getValue()
    })

    this.addChild(this.handle)
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
   * Returns handle's global Xfo
   *
   * @return {Xfo} - The Xfo value
   */
  getBaseXfo(): Xfo {
    return this.globalXfoParam.value
  }

  /**
   * Handles the initially drag interaction of the handle.
   *
   * @param event - The event param.
   */
  onDragStart(event: ZeaPointerEvent): void {
    super.onDragStart(event)
  }

  /**
   * Handles drag interaction of the handle.
   *
   * @param event - The event param.
   */
  onDrag(event: ZeaPointerEvent) {
    super.onDrag(event)
  }

  /**
   * Handles the end of dragging interaction with the handle.
   *
   * @param event - The event param.
   */
  onDragEnd(event: ZeaPointerEvent): void {
    super.onDragEnd(event)
  }
}

export default AxialRotationHandle
export { AxialRotationHandle }
