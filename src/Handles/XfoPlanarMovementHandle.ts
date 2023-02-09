import {
  Color,
  Xfo,
  NumberParameter,
  GeomItem,
  Material,
  Cuboid,
  XfoParameter,
  ColorParameter,
  Vec3,
} from '@zeainc/zea-engine'
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
  sizeParam: NumberParameter
  colorParam: ColorParameter
  highlightColorParam: ColorParameter
  handle: GeomItem
  handleMat: Material
  /**
   * Create a planar movement scene widget.
   * @param name - The name value.
   * @param size - The size value.
   * @param offset - The offset value.
   * @param color - The color value.
   */
  constructor(name: string, size: number, offset: Vec3, color = new Color()) {
    super(name)

    this.sizeParam = new NumberParameter('Size', size)
    this.addParameter(this.sizeParam)
    this.colorParam.value = color

    this.handleMat = new Material('handle', 'HandleShader')
    this.handleMat.getParameter('BaseColor').value = color
    this.handleMat.getParameter('MaintainScreenSize').value = 1
    this.handleMat.getParameter('Overlay').value = 0.9

    const handleGeom = new Cuboid(size, size, size * 0.02)

    const handleGeomXfo = new Xfo()
    handleGeomXfo.tr = offset
    transformVertices(handleGeom, handleGeomXfo)
    this.handle = new GeomItem('handle', handleGeom, this.handleMat)

    this.sizeParam.on('valueChanged', () => {
      size = this.sizeParam.getValue()
      handleGeom.sizeXParam.value = size
      handleGeom.sizeYParam.value = size
      handleGeom.sizeZParam.value = size * 0.02
    })

    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').value = this.colorParam.getValue()
    })
    this.addChild(this.handle)
  }

  /**
   * highlight the handle to indicate it is under the mouse.
   */
  highlight(): void {
    super.highlight()
    this.handleMat.getParameter('BaseColor').value = this.highlightColorParam.getValue()
  }

  /**
   * Removes the highlight from the handle once the mouse moves away.
   */
  unhighlight(): void {
    super.unhighlight()
    this.handleMat.getParameter('BaseColor').value = this.colorParam.getValue()
  }
}

export default XfoPlanarMovementHandle
export { XfoPlanarMovementHandle }
