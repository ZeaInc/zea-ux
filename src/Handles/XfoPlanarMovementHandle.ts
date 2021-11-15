import { Color, Xfo, NumberParameter, GeomItem, Material, Cuboid, XfoParameter } from '@zeainc/zea-engine'
import PlanarMovementHandle from './PlanarMovementHandle'
import './Shaders/HandleShader'
import transformVertices from './transformVertices'

/**
 * Class representing a planar movement scene widget.
 *
 * **Parameters**
 * * **Size(`NumberParameter`):** Specifies the size of the plane handle.
 *
 * @extends Handle
 */
class XfoPlanarMovementHandle extends PlanarMovementHandle {
  localXfoParam: XfoParameter
  sizeParam
  colorParam
  handleMat
  handle
  highlightColorParam
  /**
   * Create a planar movement scene widget.
   * @param {string} name - The name value.
   * @param {number} size - The size value.
   * @param {Vec3} offset - The offset value.
   * @param {Color} color - The color value.
   */
  constructor(name, size, offset, color = new Color()) {
    super(name)

    this.sizeParam = new NumberParameter('Size', size)
    this.addParameter(this.sizeParam)
    this.colorParam.setValue(color)

    this.handleMat = new Material('handle', 'HandleShader')
    this.handleMat.getParameter('BaseColor').setValue(color)
    this.handleMat.getParameter('MaintainScreenSize').setValue(1)
    this.handleMat.getParameter('Overlay').setValue(0.9)

    const handleGeom = new Cuboid(size, size, size * 0.02)

    const handleGeomXfo = new Xfo()
    handleGeomXfo.tr = offset
    transformVertices(handleGeom, handleGeomXfo)
    this.handle = new GeomItem('handle', handleGeom, this.handleMat)

    this.sizeParam.on('valueChanged', () => {
      size = this.sizeParam.getValue()
      handleGeom.getParameter('X').setValue(size)
      handleGeom.getParameter('Y').setValue(size)
      handleGeom.getParameter('Z').setValue(size * 0.02)
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
}

export default XfoPlanarMovementHandle
export { XfoPlanarMovementHandle }
