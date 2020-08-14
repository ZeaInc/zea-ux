import { Color, Xfo, NumberParameter, GeomItem, Material, Cuboid } from '@zeainc/zea-engine'
import PlanarMovementHandle from './PlanarMovementHandle'
import './Shaders/HandleShader'
import transformVertices from './transformVertices'

/**
 * Class representing a planar movement scene widget.
 *
 * @extends Handle
 */
class XfoPlanarMovementHandle extends PlanarMovementHandle {
  /**
   * Create a planar movement scene widget.
   * @param {string} name - The name value.
   * @param {number} size - The size value.
   * @param {Color} color - The color value.
   * @param {Vec3} offset - The offset value.
   */
  constructor(name, size, color, offset) {
    super(name)

    this.__color = color
    this.__hilightedColor = new Color(1, 1, 1)
    this.sizeParam = this.addParameter(new NumberParameter('size', size))

    const handleMat = new Material('handle', 'HandleShader')
    handleMat.getParameter('maintainScreenSize').setValue(1)
    this.colorParam = handleMat.getParameter('BaseColor')
    this.colorParam.setValue(color)

    const handleGeom = new Cuboid(size, size, size * 0.02)

    const handleGeomXfo = new Xfo()
    handleGeomXfo.tr = offset
    transformVertices(handleGeom.getVertexAttribute('positions'), handleGeomXfo)
    this.handle = new GeomItem('handle', handleGeom, handleMat)

    this.sizeParam.on('valueChanged', () => {
      size = this.sizeParam.getValue()
      handleGeom.getParameter('size').setValue(size)
      handleGeom.getParameter('height').setValue(size * 0.02)
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
}

export default XfoPlanarMovementHandle
export { XfoPlanarMovementHandle }
