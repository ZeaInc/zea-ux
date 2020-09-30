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
   * @param {Vec3} offset - The offset value.
   * @param {Color} color - The color value.
   */
  constructor(name, size, offset, color = new Color()) {
    super(name)

    this.sizeParam = this.addParameter(new NumberParameter('size', size))
    this.colorParam.setValue(color)

    this.handleMat = new Material('handle', 'HandleShader')
    this.handleMat.getParameter('BaseColor').setValue(color)
    this.handleMat.getParameter('MaintainScreenSize').setValue(1)

    const handleGeom = new Cuboid(size, size, size * 0.02)

    const handleGeomXfo = new Xfo()
    handleGeomXfo.tr = offset
    transformVertices(handleGeom.getVertexAttribute('positions'), handleGeomXfo)
    this.handle = new GeomItem('handle', handleGeom, this.handleMat)

    this.sizeParam.on('valueChanged', () => {
      size = this.sizeParam.getValue()
      handleGeom.getParameter('size').setValue(size)
      handleGeom.getParameter('height').setValue(size * 0.02)
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
}

export default XfoPlanarMovementHandle
export { XfoPlanarMovementHandle }
