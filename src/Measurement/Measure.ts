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
  NumberParameter,
  BillboardAlignment,
  Vec2,
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
  colorParam = new ColorParameter('Color')
  fontSizeParam = new NumberParameter('Font Size', 24)
  lineMaterial: LinesMaterial
  markerMaterial: HandleMaterial
  markerA: GeomItem
  markerB: GeomItem
  label: Label
  billboard: BillboardItem

  constructor(name = 'Measure', color = new Color('#F9CE03')) {
    super(name)

    this.addParameter(this.colorParam)
    this.addParameter(this.fontSizeParam)
    this.colorParam.value = color

    this.markerMaterial = new HandleMaterial('Marker')
    this.markerMaterial.baseColorParam.value = new Color(0, 0, 0, 0.7)
    this.markerMaterial.maintainScreenSizeParam.value = 1
    this.markerMaterial.overlayParam.value = 0

    this.lineMaterial = new LinesMaterial('Line')
    this.lineMaterial.baseColorParam.value = new Color(0, 0, 0, 0.7)
    this.lineMaterial.overlayParam.value = 0.002

    this.markerA = new GeomItem(`markerA`, cone, this.markerMaterial)
    this.markerA.pickableParam.value = false
    this.markerB = new GeomItem(`markerB`, cone, this.markerMaterial)
    this.markerB.pickableParam.value = false

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.value
      this.markerMaterial.baseColorParam.value = color
      this.lineMaterial.baseColorParam.value = color
      if (this.label) {
        this.label.backgroundColorParam.value = color
      }
    })
    this.fontSizeParam.on('valueChanged', () => {
      const fontSize = this.fontSizeParam.value
      this.label.fontSizeParam.value = fontSize
    })
  }

  createLabel(text: string, alignment: number): void {
    this.label = new Label('Label')
    this.label.backgroundColorParam.value = this.colorParam.value
    this.label.borderRadiusParam.value = 3
    this.label.borderWidthParam.value = 0.5
    this.label.fontSizeParam.value = this.fontSizeParam.value

    this.label.textParam.value = text
    this.label.renderLabelToImage()

    this.billboard = new BillboardItem('AngleBillboard', this.label)
    this.billboard.drawOnTopParam.value = true
    this.billboard.pixelsPerMeterParam.value = 2000
    this.billboard.pivotParam.value = new Vec2(0.5, 0.5)
    this.billboard.alignmentParam.value = alignment

    this.billboard.drawOnTopParam.value = true
    this.billboard.fixedSizeOnscreenParam.value = true
    this.billboard.alphaParam.value = 1

    this.addChild(this.billboard)
  }
  /**
   *
   *
   * @param isPickable -
   */
  setIsPickable(isPickable: boolean): void {
    this.markerA.pickableParam.value = isPickable
    this.markerB.pickableParam.value = isPickable
  }

  /**
   *
   * @return {string}
   */
  getMeasurementText(): any {
    return this.label.getParameter('Text').value
  }
}

export { Measure }
