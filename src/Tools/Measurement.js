import { TreeItem, Material, Color, Sphere, Lines, BillboardItem, Label, GeomItem, Xfo, Vec3 } from '@zeainc/zea-engine'
import { MeasurementOperator } from '../MeasurementOperator'
/**
 *
 *
 * @extends {TreeItem()}
 */
class Measurement extends TreeItem {
  /**
   * Creates an instance of Measurement.
   * @param {*} name
   */
  constructor(name) {
    super(name)
    console.log('Measurement')

    const markerMaterial = new Material('Marker', 'HandleShader')
    markerMaterial.getParameter('BaseColor').setValue(new Color('#FCFC00'))
    markerMaterial.getParameter('MaintainScreenSize').setValue(1)
    markerMaterial.getParameter('Overlay').setValue(0.9)

    const lineMaterial = new Material('Line', 'LinesShader')
    lineMaterial.getParameter('BaseColor').setValue(new Color(0.7, 0.2, 0.2))

    this.startMarker = new GeomItem(`${name}StartMarker`, new Sphere(0.01), markerMaterial)
    this.endMarker = new GeomItem(`${name}EndMarker`, new Sphere(0.01), markerMaterial)

    this.label = new Label('Distance')
    this.label.getParameter('FontSize').setValue(20)
    this.label.getParameter('BackgroundColor').setValue(new Color('#CFE2F3'))

    const billboard = new BillboardItem('DistanceBillboard', this.label)
    billboard.getParameter('LocalXfo').setValue(new Xfo())
    billboard.getParameter('PixelsPerMeter').setValue(300)
    billboard.getParameter('AlignedToCamera').setValue(true)
    billboard.getParameter('DrawOnTop').setValue(true)
    billboard.getParameter('Alpha').setValue(1)

    this.addChild(billboard)

    const line = new Lines(0.0)
    line.setNumVertices(2)
    line.setNumSegments(1)
    line.setSegmentVertexIndices(0, 0, 1)
    line.getVertexAttribute('positions').getValueRef(1).setFromOther(new Vec3(0, 0, 1))

    const lineGeomItem = new GeomItem('Line', line, lineMaterial)

    this.addChild(this.startMarker)
    this.addChild(this.endMarker)
    this.addChild(lineGeomItem)

    const measurementOperator = new MeasurementOperator(`${name}MeasurementOperator`)
    measurementOperator
      .getInput(MeasurementOperator.IO_NAMES.StartXfo)
      .setParam(this.startMarker.getParameter('GlobalXfo'))
    measurementOperator.getInput(MeasurementOperator.IO_NAMES.EndXfo).setParam(this.endMarker.getParameter('GlobalXfo'))
    measurementOperator.getOutput(MeasurementOperator.IO_NAMES.Distance).setParam(this.label.getParameter('Text'))
    measurementOperator.getOutput(MeasurementOperator.IO_NAMES.LabelXfo).setParam(billboard.getParameter('GlobalXfo'))
    measurementOperator.getOutput(MeasurementOperator.IO_NAMES.LineXfo).setParam(lineGeomItem.getParameter('GlobalXfo'))
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
   * @return {string}
   */
  getMeasurementText() {
    return this.label.getParameter('Text').getValue()
  }
}

export { Measurement }
