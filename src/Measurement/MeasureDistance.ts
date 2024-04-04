import {
  LinesMaterial,
  Color,
  Lines,
  BillboardItem,
  Label,
  GeomItem,
  Xfo,
  Vec3,
  StringParameter,
  Registry,
  Vec3Attribute,
} from '@zeainc/zea-engine'

import { Measure } from './Measure'

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
class MeasureDistance extends Measure {
  lineGeomItem: GeomItem = null
  sceneUnits: String = null
  /**
   * Creates an instance of MeasureDistance.
   * @param name
   * @param color
   */
  constructor(name = 'MeasureDistance', color = new Color('#F9CE03'), sceneUnits = 'Meters') {
    super(name, color)

    this.sceneUnits = sceneUnits
  }

  /**
   * Updates the measured value
   */
  updateMeasurement(): void {
    const startXfo = this.markerA.globalXfoParam.value
    const endXfo = this.markerB.globalXfoParam.value

    const vector = endXfo.tr.subtract(startXfo.tr)
    const distance = vector.length()

    if (distance == 0) return
    const color = this.colorParam.value

    // Convert meters to mm.
    let scaleFactor = 1
    switch (this.sceneUnits) {
      case 'Millimeters':
        break
      case 'Meters':
        scaleFactor = 1000
        break
    }
    const distanceInMM = distance * scaleFactor
    const labelTest = `${parseFloat(distanceInMM.toFixed(3))}mm`
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
   * @param position
   */
  setStartMarkerPos(position: Vec3): void {
    const newXfo = this.markerA.globalXfoParam.value
    newXfo.tr = position
    this.markerA.globalXfoParam.value = newXfo
    if (this.label) this.updateMeasurement()
  }

  /**
   *
   *
   * @param position
   */
  setEndMarkerPos(position: Vec3): void {
    const endXfo = this.markerB.globalXfoParam.value
    endXfo.tr = position
    this.markerB.globalXfoParam.value = endXfo
    this.updateMeasurement()
  }

  /**
   *
   *
   * @param isVisible -
   */
  setGeomBuffersVisibility(isVisible: boolean): void {
    this.markerA.setSelectable(!isVisible)
    this.markerB.setSelectable(!isVisible)
  }

  /**
   *
   * @return {string}
   */
  getMeasurementText(): any {
    return this.label.getParameter('Text').value
  }
}

Registry.register('MeasureDistance', MeasureDistance)

export { MeasureDistance }
