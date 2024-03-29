import { Color, Registry, MaterialColorParam, NumberParameter, Material } from '@zeainc/zea-engine'

/**
 * The Material Class to use for Handle items.
 * The Handle shader is used to display geometry that must provide a fixed size on
 * screen and not get smaller or bigger as the user gets closer/farther away.
 *
 * @extends {GLShader}
 */
class HandleMaterial extends Material {
  baseColorParam = new MaterialColorParam('BaseColor', new Color(1.0, 1, 0.5))
  maintainScreenSizeParam = new NumberParameter('MaintainScreenSize', 0)
  overlayParam = new NumberParameter('Overlay', 0, [0, 1])
  /**
   * Creates an instance of HandleMaterial.
   *
   * @param name - The name of the material. Note: this value is entirely optional.
   */
  constructor(name?: string) {
    super(name)
    this.__shaderName = 'HandleShader'
    this.addParameter(this.baseColorParam)
    this.addParameter(this.maintainScreenSizeParam)
    this.addParameter(this.overlayParam)
  }
}

Registry.register('HandleMaterial', HandleMaterial)

export default HandleMaterial
export { HandleMaterial }
