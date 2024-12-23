import {
  TreeItem,
  LinesMaterial,
  BillboardItem,
  Label,
  GeomItem,
  ColorParameter,
  Color,
  Sphere,
  Cone,
  Lines,
  Vec3Attribute,
  Vec3,
  Material,
  Mat3,
  Xfo,
} from '@zeainc/zea-engine'

import { HandleMaterial } from '../Handles/Shaders/HandleMaterial'
import transformVertices from '../Handles/transformVertices'

// const sphere = new Sphere(0.003, 24, 12, false)
const cone = new Cone(0.003, 0.01, 12, true)
const tipXfo = new Xfo()
tipXfo.tr.set(0, 0, -cone.heightParam.value)
transformVertices(cone, tipXfo)

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
  markerMaterial: HandleMaterial
  markerA: GeomItem
  markerB: GeomItem
  label: Label
  billboard: BillboardItem

  constructor(name = 'Measure', color = new Color('#F9CE03')) {
    super(name)

    this.colorParam = <ColorParameter>this.addParameter(new ColorParameter('Color', color))

    this.markerMaterial = new HandleMaterial('Marker')
    this.markerMaterial.baseColorParam.value = new Color(0, 0, 0, 0.7)
    this.markerMaterial.maintainScreenSizeParam.value = 1
    this.markerMaterial.overlayParam.value = 0.5

    this.lineMaterial = new LinesMaterial('Line')
    this.lineMaterial.baseColorParam.value = new Color(0, 0, 0, 0.7)
    this.lineMaterial.overlayParam.value = 0.5

    this.markerA = new GeomItem(`markerA`, cone, this.markerMaterial)
    this.markerB = new GeomItem(`markerB`, cone, this.markerMaterial)

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.value
      // this.markerMaterial.baseColorParam.value = color
      // this.lineMaterial.baseColorParam.value = color
      this.label.backgroundColorParam.value = color
    })
  }
}

export { Measure }
