import {
  TreeItem,
  LinesMaterial,
  BillboardItem,
  Label,
  GeomItem,
  ColorParameter,
  Color,
  Sphere,
} from '@zeainc/zea-engine'

import { HandleMaterial } from '../Handles/Shaders/HandleMaterial'

const sphere = new Sphere(0.003, 24, 12, false)
/**
 *
 *
 * @extends {TreeItem}
 */
class Measure extends TreeItem {
  colorParam: ColorParameter
  lineMaterial: LinesMaterial
  markerMaterial: HandleMaterial
  markerA: GeomItem
  markerB: GeomItem
  label: Label
  billboard: BillboardItem

  constructor(name = 'Measure', color = new Color('#F9CE03')) {
    super(name)

    this.colorParam = <ColorParameter>this.addParameter(new ColorParameter('Color', color))

    this.markerMaterial = new HandleMaterial('Marker')
    this.markerMaterial.getParameter('BaseColor').value = new Color(0, 0, 0)
    this.markerMaterial.getParameter('MaintainScreenSize').value = 1
    this.markerMaterial.getParameter('Overlay').value = 0.5

    this.lineMaterial = new LinesMaterial('Line')
    this.lineMaterial.baseColorParam.value = new Color(0, 0, 0)
    this.lineMaterial.overlayParam.value = 0.5

    this.markerA = new GeomItem(`markerA`, sphere, this.markerMaterial)
    this.markerB = new GeomItem(`markerB`, sphere, this.markerMaterial)
    this.addChild(this.markerA)
    this.addChild(this.markerB)

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.getValue()
      // this.markerMaterial.getParameter('BaseColor').value = color
      // this.lineMaterial.getParameter('BaseColor').value = color
      this.label.getParameter('BackgroundColor').value = color
    })
  }
}

export { Measure }
