import {
  TreeItem,
  LinesMaterial,
  Color,
  Sphere,
  Lines,
  BillboardItem,
  Label,
  GeomItem,
  Xfo,
  Vec3,
  ColorParameter,
  Registry,
  Ray,
  Vec3Attribute,
  Material,
} from '@zeainc/zea-engine'

import { HandleMaterial } from '../Handles/Shaders/HandleMaterial'

const sphere = new Sphere(0.003, 24, 12, false)
const line = new Lines() //new Lines(0.0)
line.setNumVertices(2)
line.setNumSegments(1)
line.setSegmentVertexIndices(0, 0, 1)
const positions = <Vec3Attribute>line.getVertexAttribute('positions')
positions.setValue(0, new Vec3())
positions.setValue(1, new Vec3(0, 0, 1))
line.setBoundingBoxDirty()
/**
 *
 *
 * @extends {TreeItem}
 */
class MeasureAngle extends TreeItem {
  colorParam: ColorParameter
  markerMaterial: Material
  markerMaterialB: Material
  lineMaterial: LinesMaterial
  markerA: GeomItem
  markerB: GeomItem
  label: Label
  billboard: BillboardItem
  /**
   * Creates an instance of MeasureAngle.
   * @param {string} name
   * @param {Color} color
   */
  constructor(name = 'MeasureAngle', color = new Color('#F9CE03')) {
    super(name)

    this.colorParam = <ColorParameter>this.addParameter(new ColorParameter('Color', color))

    this.markerMaterial = new HandleMaterial('Marker')
    this.markerMaterial.getParameter('BaseColor').value = new Color(0, 0, 0)
    this.markerMaterial.getParameter('MaintainScreenSize').value = 1
    this.markerMaterial.getParameter('Overlay').value = 0.5

    this.markerMaterialB = new HandleMaterial('Marker')
    this.markerMaterialB.getParameter('BaseColor').value = new Color(0, 0, 0)
    this.markerMaterialB.getParameter('MaintainScreenSize').value = 1
    this.markerMaterialB.getParameter('Overlay').value = 0.5

    this.lineMaterial = new LinesMaterial('Line')
    this.lineMaterial.baseColorParam.value = new Color(0, 0, 0)
    this.lineMaterial.overlayParam.value = 0.5

    this.markerA = new GeomItem(`markerA`, sphere, this.markerMaterial)
    this.markerB = new GeomItem(`markerB`, sphere, this.markerMaterialB)
    this.addChild(this.markerA)
    this.addChild(this.markerB)
  }

  /**
   * Given the 2 marker positions, calculate and display the angle.
   */
  createLinesAndLabel(): void {
    // ////////////////////////////////////////
    // Calculate the angle
    const xfoA = this.markerA.globalXfoParam.value
    const xfoB = this.markerB.globalXfoParam.value

    const normA = xfoA.ori.getZaxis()
    const normB = xfoB.ori.getZaxis()

    const axis = normA.cross(normB).normalize()
    const tangentA = axis.cross(normA).normalize()
    const tangentB = axis.cross(normB).normalize()

    const rayA = new Ray(xfoA.tr, tangentA)
    const rayB = new Ray(xfoB.tr, tangentB)
    const params = rayA.intersectRayVector(rayB)

    const angle = tangentA.angleTo(tangentB)

    // ////////////////////////////////////////
    // Build the visualization parts.
    this.markerA.addChild(new GeomItem('Line', line, this.lineMaterial), false)
    this.markerB.addChild(new GeomItem('Line', line, this.lineMaterial), false)

    this.label = new Label('Distance')
    this.label.fontSizeParam.value = 20
    this.label.backgroundColorParam.value = this.colorParam.getValue()
    this.label.textParam.value = `${(angle / (Math.PI / 180)).toFixed(3)} °`

    this.billboard = new BillboardItem('DistanceBillboard', this.label)
    this.billboard.localXfoParam.value = new Xfo()
    this.billboard.pixelsPerMeterParam.value = 1500
    this.billboard.alignedToCameraParam.value = true
    this.billboard.drawOnTopParam.value = true
    this.billboard.fixedSizeOnscreenParam.value = true
    this.billboard.alphaParam.value = 1

    this.addChild(this.billboard)

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.getValue()
      this.markerMaterial.getParameter('BaseColor').value = color
      this.lineMaterial.baseColorParam.value = color
      this.label.backgroundColorParam.value = color
    })

    const labelXfo = new Xfo()
    labelXfo.tr.addInPlace(rayA.pointAtDist(params[0]))
    labelXfo.tr.addInPlace(rayB.pointAtDist(params[1]))
    labelXfo.tr.scaleInPlace(0.5)

    xfoA.ori.setFromDirectionAndUpvector(tangentA, normA)
    this.markerA.globalXfoParam.value = xfoA
    xfoB.ori.setFromDirectionAndUpvector(tangentB, normA)
    this.markerB.globalXfoParam.value = xfoB

    const lineAXfo = new Xfo()
    lineAXfo.sc.z = params[0]
    this.markerA.getChild(0).localXfoParam.value = lineAXfo
    const lineBXfo = new Xfo()
    lineBXfo.sc.z = params[1]
    this.markerB.getChild(0).localXfoParam.value = lineBXfo

    this.billboard.globalXfoParam.value = labelXfo
  }

  /**
   *
   *
   * @param {Xfo} xfo
   */
  setXfoA(xfo: Xfo): void {
    this.markerA.globalXfoParam.value = xfo
    this.markerB.globalXfoParam.value = xfo
  }

  /**
   *
   *
   * @return {Xfo}
   */
  getXfoA(): Xfo {
    return this.markerA.globalXfoParam.value
  }

  /**
   *
   *
   * @param {Xfo} xfo
   */
  setXfoB(xfo: Xfo): void {
    this.markerB.globalXfoParam.value = xfo
    this.createLinesAndLabel()
  }
}

Registry.register('MeasureAngle', MeasureAngle)

export { MeasureAngle }
