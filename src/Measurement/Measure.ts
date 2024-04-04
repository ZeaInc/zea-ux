import {
  TreeItem,
  LinesMaterial,
  BillboardItem,
  Label,
  GeomItem,
  ColorParameter,
  Color,
  Sphere,
  Lines,
  Vec3Attribute,
  Vec3,
  Material,
} from '@zeainc/zea-engine'

import { HandleMaterial } from '../Handles/Shaders/HandleMaterial'

const sphere = new Sphere(0.003, 24, 12, false)

// // Used to debug the Xfo of the marker handle
// const linesCross = new Lines() //new Lines(0.0)
// linesCross.setNumVertices(6)
// linesCross.setNumSegments(3)
// linesCross.setSegmentVertexIndices(0, 0, 1)
// linesCross.setSegmentVertexIndices(1, 2, 3)
// linesCross.setSegmentVertexIndices(2, 4, 5)
// const positions = <Vec3Attribute>linesCross.getVertexAttribute('positions')
// // positions.setValue(0, new Vec3(-1, 0, 0))
// // positions.setValue(1, new Vec3(1, 0, 0))

// // positions.setValue(2, new Vec3(0, 0, 0))
// // positions.setValue(3, new Vec3(0, 5, 0))

// positions.setValue(4, new Vec3(0, 0, 0))
// positions.setValue(5, new Vec3(0, 0, 5))
// linesCross.setBoundingBoxDirty()

/**
 *
 *
 * @extends {TreeItem}
 */
class Measure extends TreeItem {
  colorParam: ColorParameter
  lineMaterial: LinesMaterial
  markerMaterial: Material
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
      const color = this.colorParam.value
      // this.markerMaterial.getParameter('BaseColor').value = color
      // this.lineMaterial.getParameter('BaseColor').value = color
      this.label.getParameter('BackgroundColor').value = color
    })
  }
}

export { Measure }
