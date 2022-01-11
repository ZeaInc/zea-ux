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
  StringParameter,
  Registry,
  Vec3Attribute,

} from '@zeainc/zea-engine'

import { HandleMaterial } from '../Handles/Shaders/HandleMaterial'

const sphere = new Sphere(0.003)
const line = new Lines()
line.setNumVertices(2)
line.setNumSegments(1)
line.setSegmentVertexIndices(0, 0, 1)
;(<Vec3Attribute>line.getVertexAttribute('positions')).setValue(0, new Vec3())
;(<Vec3Attribute>line.getVertexAttribute('positions')).setValue(1, new Vec3(0, 0, 1))
line.setBoundingBoxDirty()

/**
 *
 *
 * @extends {TreeItem}
 */
class MeasureDistance extends TreeItem {
  lineMaterial: LinesMaterial
  colorParam: ColorParameter
  unitsParameter = new StringParameter('Units', 'mm')
  markerMaterial: HandleMaterial
  startMarker: GeomItem
  endMarker: GeomItem
  label: Label
  billboard: BillboardItem
  lineGeomItem: GeomItem
  /**
   * Creates an instance of MeasureDistance.
   * @param {string} name
   * @param {Color} color
   */
  constructor(name = 'MeasureDistance', color = new Color('#F9CE03')) {
    super(name)

    this.colorParam = <ColorParameter>this.addParameter(new ColorParameter('Color', color))
    this.addParameter(this.unitsParameter)

    this.markerMaterial = new HandleMaterial('Marker')
    this.markerMaterial.getParameter('BaseColor').value = new Color(0, 0, 0)
    this.markerMaterial.getParameter('MaintainScreenSize').value = 1
    this.markerMaterial.getParameter('Overlay').value = 0.5

    this.startMarker = new GeomItem(`${name}StartMarker`, sphere, this.markerMaterial)
    this.endMarker = new GeomItem(`${name}EndMarker`, sphere, this.markerMaterial)

    this.addChild(this.startMarker)
    this.addChild(this.endMarker)

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.getValue()
      this.markerMaterial.getParameter('BaseColor').value = color
      this.lineMaterial.getParameter('BaseColor').value = color
      this.label.getParameter('BackgroundColor').value = color
    })
  }

  /**
   * Updates the measured value
   */
  updateMeasurement(): void {
    console.log('updateMeasurement')
    const startXfo = this.startMarker.globalXfoParam.value
    const endXfo = this.endMarker.globalXfoParam.value

    const vector = endXfo.tr.subtract(startXfo.tr)
    const distance = vector.length()

    if (distance == 0) return
    const color = this.colorParam.getValue()

    // Convert meters to mm.
    const distanceInMM = distance * 1000
    const units = this.unitsParameter.getValue()
    const labelTest = `${parseFloat(distanceInMM.toFixed(4))}${units}`
    console.log(units, distanceInMM)
    if (!this.label) {
      this.label = new Label('Distance')
      this.label.getParameter('FontSize').value = 20
      this.label.getParameter('BackgroundColor').value = color
      this.label.getParameter('Text').value = labelTest

      this.billboard = new BillboardItem('DistanceBillboard', this.label)
      this.billboard.localXfoParam.value = new Xfo()
      this.billboard.getParameter('PixelsPerMeter').value = 1500
      this.billboard.getParameter('AlignedToCamera').value = true
      this.billboard.getParameter('DrawOnTop').value = true
      this.billboard.getParameter('FixedSizeOnscreen').value = true
      this.billboard.getParameter('Alpha').value = 1

      this.addChild(this.billboard)

      this.lineMaterial = new LinesMaterial('Line')
      this.lineMaterial.getParameter('BaseColor').value = new Color(0, 0, 0)
      this.lineMaterial.getParameter('Overlay').value = 0.5
      this.lineGeomItem = new GeomItem('Line', line, this.lineMaterial)
      this.lineGeomItem.setSelectable(false)
      this.addChild(this.lineGeomItem)
    } else {
      this.label.getParameter('Text').value = labelTest
    }

    const lineXfo = startXfo.clone()
    lineXfo.ori.setFromDirectionAndUpvector(vector, new Vec3(vector.z, vector.x, vector.y))
    lineXfo.sc.z = distance

    this.lineGeomItem.globalXfoParam.value = lineXfo

    vector.normalizeInPlace()
    const midPoint = startXfo.tr.add(vector.scale(distance * 0.5))
    const labelXfo = new Xfo(midPoint)
    labelXfo.ori.setFromDirectionAndUpvector(vector, new Vec3(vector.z, vector.x, vector.y))
    this.billboard.globalXfoParam.value = labelXfo
  }

  /**
   *
   *
   * @param {Vec3} position
   */
  setStartMarkerPos(position: Vec3) {
    const newXfo = this.startMarker.globalXfoParam.value
    newXfo.tr = position
    this.startMarker.globalXfoParam.value = newXfo
    if (this.label) this.updateMeasurement()
  }

  /**
   *
   *
   * @param {Vec3} position
   */
  setEndMarkerPos(position: Vec3) {
    const endXfo = this.endMarker.globalXfoParam.value
    endXfo.tr = position
    this.endMarker.globalXfoParam.value = endXfo
    this.updateMeasurement()
  }

  /**
   *
   *
   * @param {boolean} isVisible -
   */
  setGeomBuffersVisibility(isVisible: boolean) {
    this.startMarker.setSelectable(!isVisible)
    this.endMarker.setSelectable(!isVisible)
  }

  /**
   *
   * @return {string}
   */
  getMeasurementText() {
    return this.label.getParameter('Text').getValue()
  }
}

Registry.register('MeasureDistance', MeasureDistance)

export { MeasureDistance }
