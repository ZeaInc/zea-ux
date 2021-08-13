import {
  TreeItem,
  Material,
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
} from '@zeainc/zea-engine'

const sphere = new Sphere(0.003)
const line = new Lines(0.0)
line.setNumVertices(2)
line.setNumSegments(1)
line.setSegmentVertexIndices(0, 0, 1)
line.getVertexAttribute('positions').getValueRef(1).setFromOther(new Vec3(0, 0, 1))

/**
 *
 *
 * @extends {TreeItem}
 */
class MeasureDistance extends TreeItem {
  /**
   * Creates an instance of MeasureDistance.
   * @param {string} name
   * @param {Color} color
   */
  constructor(name = 'MeasureDistance', color = new Color('#F9CE03')) {
    super(name)

    this.colorParam = this.addParameter(new ColorParameter('Color', color))
    this.unitsParameter = this.addParameter(new StringParameter('Units', 'mm'))

    this.markerMaterial = new Material('Marker', 'HandleShader')
    this.markerMaterial.getParameter('BaseColor').setValue(this.colorParam.getValue())
    this.markerMaterial.getParameter('MaintainScreenSize').setValue(1)
    this.markerMaterial.getParameter('Overlay').setValue(0.5)

    this.lineMaterial = new Material('Line', 'LinesShader')
    this.lineMaterial.getParameter('BaseColor').setValue(this.colorParam.getValue())
    this.lineMaterial.getParameter('Overlay').setValue(0.5)

    this.startMarker = new GeomItem(`${name}StartMarker`, sphere, this.markerMaterial)
    this.endMarker = new GeomItem(`${name}EndMarker`, sphere, this.markerMaterial)

    this.addChild(this.startMarker)
    this.addChild(this.endMarker)

    this.lineGeomItem = new GeomItem('Line', line, this.lineMaterial)
    this.lineGeomItem.setSelectable(false)
    this.addChild(this.lineGeomItem)

    this.label = new Label('Distance')
    this.label.getParameter('FontSize').setValue(20)
    this.label.getParameter('BackgroundColor').setValue(this.colorParam.getValue())

    this.billboard = new BillboardItem('DistanceBillboard', this.label)
    this.billboard.getParameter('LocalXfo').setValue(new Xfo())
    this.billboard.getParameter('PixelsPerMeter').setValue(1500)
    this.billboard.getParameter('AlignedToCamera').setValue(true)
    this.billboard.getParameter('DrawOnTop').setValue(true)
    this.billboard.getParameter('FixedSizeOnscreen').setValue(true)
    this.billboard.getParameter('Alpha').setValue(1)

    this.addChild(this.billboard)

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.getValue()
      this.markerMaterial.getParameter('BaseColor').setValue(color)
      this.lineMaterial.getParameter('BaseColor').setValue(color)
      this.label.getParameter('BackgroundColor').setValue(color)
    })
  }

  /**
   * Updates the measured value
   */
  updateMeasurement() {
    const startXfo = this.startMarker.getParameter('GlobalXfo').getValue()
    const endXfo = this.endMarker.getParameter('GlobalXfo').getValue()

    const vector = endXfo.tr.subtract(startXfo.tr)
    const distance = vector.length()

    const lineXfo = startXfo.clone()
    lineXfo.ori.setFromDirectionAndUpvector(vector, new Vec3(vector.z, vector.x, vector.y))
    lineXfo.sc.z = distance

    this.lineGeomItem.getParameter('GlobalXfo').setValue(lineXfo)

    // Convert meters to mm.
    const distanceInMM = distance * 1000

    this.label.getParameter('Text').setValue(`${parseFloat(distanceInMM.toFixed(4))}${this.unitsParameter.getValue()}`)

    vector.normalizeInPlace()
    const midPoint = startXfo.tr.add(vector.scale(distance * 0.5))
    const labelXfo = new Xfo(midPoint)
    labelXfo.ori.setFromDirectionAndUpvector(vector, new Vec3(vector.z, vector.x, vector.y))
    this.billboard.getParameter('GlobalXfo').setValue(labelXfo)
  }

  /**
   *
   *
   * @param {Vec3} position
   */
  setStartMarkerPos(position) {
    const newXfo = this.startMarker.getParameter('GlobalXfo').getValue()
    newXfo.tr = position
    this.startMarker.getParameter('GlobalXfo').setValue(newXfo)
    this.updateMeasurement()
  }

  /**
   *
   *
   * @param {Vec3} position
   */
  setEndMarkerPos(position) {
    const endXfo = this.endMarker.getParameter('GlobalXfo').getValue()
    endXfo.tr = position
    this.endMarker.getParameter('GlobalXfo').setValue(endXfo)
    this.updateMeasurement()
  }

  /**
   *
   *
   * @param {boolean} isVisible -
   */
  setGeomBuffersVisibility(isVisible) {
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
