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
import { MeasurementOperator } from './MeasurementOperator'

/**
 *
 *
 * @extends {TreeItem}
 */
class Measurement extends TreeItem {
  /**
   * Creates an instance of Measurement.
   * @param {string} name
   * @param {Color} color
   */
  constructor(name = 'Measurement', color = new Color('#FCFC00')) {
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

    const sphere = new Sphere(0.003)
    this.startMarker = new GeomItem(`StartMarker`, sphere, this.markerMaterial)
    this.endMarker = new GeomItem(`EndMarker`, sphere, this.markerMaterial)

    this.addChild(this.startMarker)
    this.addChild(this.endMarker)

    const line = new Lines(0.0)
    line.setNumVertices(2)
    line.setNumSegments(1)
    line.setSegmentVertexIndices(0, 0, 1)
    line.getVertexAttribute('positions').getValueRef(1).setFromOther(new Vec3(0, 0, 1))

    this.lineGeomItem = new GeomItem('Line', line, this.lineMaterial)

    this.addChild(this.lineGeomItem)

    this.measurementOp = new MeasurementOperator(`MeasurementOperator`)
    this.measurementOp
      .getInput(MeasurementOperator.IO_NAMES.StartXfo)
      .setParam(this.startMarker.getParameter('GlobalXfo'))
    this.measurementOp.getInput(MeasurementOperator.IO_NAMES.EndXfo).setParam(this.endMarker.getParameter('GlobalXfo'))
    this.measurementOp
      .getOutput(MeasurementOperator.IO_NAMES.LineXfo)
      .setParam(this.lineGeomItem.getParameter('GlobalXfo'))

    this.displayLabel()

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.getValue()
      this.markerMaterial.getParameter('BaseColor').setValue(color)
      this.lineMaterial.getParameter('BaseColor').setValue(color)
      this.label.getParameter('BackgroundColor').setValue(color)
    })
  }

  displayLabel() {
    this.label = new Label('Distance')
    this.label.getParameter('FontSize').setValue(20)
    this.label.getParameter('BackgroundColor').setValue(this.colorParam.getValue())

    const billboard = new BillboardItem('DistanceBillboard', this.label)
    billboard.getParameter('LocalXfo').setValue(new Xfo())
    billboard.getParameter('PixelsPerMeter').setValue(1500)
    billboard.getParameter('AlignedToCamera').setValue(true)
    billboard.getParameter('DrawOnTop').setValue(true)
    billboard.getParameter('FixedSizeOnscreen').setValue(true)
    billboard.getParameter('Alpha').setValue(1)

    this.measurementOp.getOutput(MeasurementOperator.IO_NAMES.Distance).setParam(this.label.getParameter('Text'))
    this.measurementOp.getOutput(MeasurementOperator.IO_NAMES.LabelXfo).setParam(billboard.getParameter('GlobalXfo'))

    this.addChild(billboard)
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
  }

  /**
   *
   *
   * @param {Vec3} position
   */
  setEndMarkerPos(position) {
    const newXfo = this.endMarker.getParameter('GlobalXfo').getValue()
    newXfo.tr = position
    this.endMarker.getParameter('GlobalXfo').setValue(newXfo)
  }

  /**
   *
   *
   * @param {boolean} isVisible -
   */
  setGeomBuffersVisibility(isVisible) {
    this.lineGeomItem.setSelectable(!isVisible)
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

Registry.register('Measurement', Measurement)

export { Measurement }
