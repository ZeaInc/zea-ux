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
  Registry,
} from '@zeainc/zea-engine'
import { MeasurementOperator } from './MeasurementOperator'
import { MeasurementHandle } from './MeasurementHandle'

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

    this.markerMaterial = new Material('Marker', 'HandleShader')
    this.markerMaterial.getParameter('BaseColor').setValue(this.colorParam.getValue())
    this.markerMaterial.getParameter('MaintainScreenSize').setValue(1)
    this.markerMaterial.getParameter('Overlay').setValue(0.5)

    this.lineMaterial = new Material('Line', 'LinesShader')
    this.lineMaterial.getParameter('BaseColor').setValue(this.colorParam.getValue())
    this.lineMaterial.getParameter('Overlay').setValue(0.5)

    const sphere = new Sphere(0.003)
    this.startMarker = new GeomItem(`${name}StartMarker`, sphere, this.markerMaterial)
    this.endMarker = new GeomItem(`${name}EndMarker`, sphere, this.markerMaterial)

    this.startMarkerHandle = new MeasurementHandle('StartMarkerHandle')
    this.startMarkerHandle.addChild(this.startMarker)
    this.addChild(this.startMarkerHandle)

    this.endMarkerHandle = new MeasurementHandle('EndMarkerHandle')
    this.endMarkerHandle.addChild(this.endMarker)
    this.addChild(this.endMarkerHandle)

    const line = new Lines(0.0)
    line.setNumVertices(2)
    line.setNumSegments(1)
    line.setSegmentVertexIndices(0, 0, 1)
    line.getVertexAttribute('positions').getValueRef(1).setFromOther(new Vec3(0, 0, 1))

    const lineGeomItem = new GeomItem('Line', line, this.lineMaterial)

    this.addChild(lineGeomItem)

    this.measurementOp = new MeasurementOperator(`${name}MeasurementOperator`)
    this.measurementOp
      .getInput(MeasurementOperator.IO_NAMES.StartXfo)
      .setParam(this.startMarkerHandle.getParameter('GlobalXfo'))
    this.measurementOp
      .getInput(MeasurementOperator.IO_NAMES.EndXfo)
      .setParam(this.endMarkerHandle.getParameter('GlobalXfo'))
    this.measurementOp.getOutput(MeasurementOperator.IO_NAMES.LineXfo).setParam(lineGeomItem.getParameter('GlobalXfo'))

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
    const newXfo = this.startMarkerHandle.getParameter('GlobalXfo').getValue()
    newXfo.tr = position
    this.startMarkerHandle.getParameter('GlobalXfo').setValue(newXfo)
  }

  /**
   *
   *
   * @param {Vec3} position
   */
  setEndMarkerPos(position) {
    const newXfo = this.endMarkerHandle.getParameter('GlobalXfo').getValue()
    newXfo.tr = position
    this.endMarkerHandle.getParameter('GlobalXfo').setValue(newXfo)
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

Registry.register('Measurement', Measurement)

export { Measurement }
