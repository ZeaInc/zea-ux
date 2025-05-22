import {
  LinesMaterial,
  Color,
  Lines,
  BillboardItem,
  Label,
  GeomItem,
  Xfo,
  Vec3,
  Registry,
  Vec3Attribute,
  BillboardAlignment,
  Vec2,
} from '@zeainc/zea-engine'

import { Measure } from './Measure'

const line = new Lines()
line.setNumVertices(2)
line.setNumSegments(1)
line.setSegmentVertexIndices(0, 0, 1)
const positions = line.getVertexAttribute('positions') as Vec3Attribute
positions.setValue(0, new Vec3(0, 0, -0.5))
positions.setValue(1, new Vec3(0, 0, 0.5))
line.setBoundingBoxDirty()

/**
 *
 *
 * @extends {TreeItem}
 */
class MeasureDistance extends Measure {
  lineGeomItem: GeomItem = null
  startPos: Vec3 = new Vec3()
  endPos: Vec3 = new Vec3()
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
    const vector = this.endPos.subtract(this.startPos)
    const distance = vector.length()

    if (distance == 0) return

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
      this.label.fontSizeParam.value = 20
      this.label.backgroundColorParam.value = this.colorParam.value
      this.label.textParam.value = labelTest
      this.label.borderRadiusParam.value = 3
      this.label.borderWidthParam.value = 0.5

      this.billboard = new BillboardItem('DistanceBillboard', this.label)
      this.billboard.localXfoParam.value = new Xfo()
      this.billboard.pixelsPerMeterParam.value = 2000
      this.billboard.alignmentParam.value = BillboardAlignment.AlignedToCameraAndXAxis
      this.billboard.pivotParam.value = new Vec2(0.5, 0.5)
      this.billboard.drawOnTopParam.value = true
      this.billboard.opacityParam.value = 0.1
      this.billboard.fixedSizeOnscreenParam.value = true

      this.addChild(this.billboard)

      this.lineMaterial = new LinesMaterial('Line')
      this.lineMaterial.baseColorParam.value = new Color(0, 0, 0, 0.7)
      this.lineMaterial.overlayParam.value = 0.1
      this.lineGeomItem = new GeomItem('Line', line, this.lineMaterial)
      this.lineGeomItem.pickableParam.value = false
      this.addChild(this.lineGeomItem)
      this.addChild(this.markerA)
      this.addChild(this.markerB)
    } else {
      this.label.textParam.value = labelTest
    }

    vector.normalizeInPlace()
    const xfo = new Xfo()
    xfo.tr = this.startPos.lerp(this.endPos, 0.5)
    xfo.ori.setFromDirectionAndUpvector(vector, new Vec3(vector.z, vector.x, vector.y))
    this.globalXfoParam.value = xfo

    const lineXfo = new Xfo()
    lineXfo.sc.z = distance
    this.lineGeomItem.localXfoParam.value = lineXfo

    const markerAXfo = new Xfo()
    markerAXfo.tr.z = distance * 0.5
    this.markerA.localXfoParam.value = markerAXfo

    const markerBXfo = new Xfo()
    markerBXfo.tr.z = distance * -0.5
    markerBXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI)
    this.markerB.localXfoParam.value = markerBXfo

    const billboardXfo = new Xfo()
    billboardXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI / 2)
    this.billboard.localXfoParam.value = billboardXfo
  }

  /**
   *
   *
   * @param position
   */
  setStartMarkerPos(position: Vec3): void {
    this.startPos = position
    if (this.label) this.updateMeasurement()
  }

  /**
   *
   *
   * @param position
   */
  setEndMarkerPos(position: Vec3): void {
    this.endPos = position
    this.updateMeasurement()
  }

  /**
   *
   *
   * @param isVisible -
   */
  setGeomBuffersVisibility(isVisible: boolean): void {
    this.markerA.pickableParam.value = !isVisible
    this.markerB.pickableParam.value = !isVisible
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
