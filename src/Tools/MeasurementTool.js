import { Material, Color, TreeItem, GeomItem, Label, BillboardItem, Xfo, Sphere, Lines } from '@zeainc/zea-engine'
import BaseTool from './BaseTool'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { MeasurementOperator } from '../MeasurementOperator'
/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasurementTool extends BaseTool {
  /**
   * Creates an instance of MeasurementTool.
   *
   * @param {GLBaseRenderer} renderer - The renderer value
   */
  constructor(renderer) {
    super({ renderer })

    this.renderer = renderer

    this.dragging = false
    this.markerMaterial = new Material('Marker', 'ScreenSpaceShader')
    this.markerMaterial.getParameter('BaseColor').setValue(new Color('#FCFC00'))

    this.lineMaterial = new Material('Line', 'LinesShader')
    this.lineMaterial.getParameter('BaseColor').setValue(new Color(0.7, 0.2, 0.2))

    this.startMarker = undefined
    this.endMarker = undefined
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerDown(event) {
    const measurementItem = new TreeItem('')
    this.startMarker = new GeomItem('', new Sphere(0.01), this.markerMaterial)
    this.endMarker = new GeomItem('', new Sphere(0.01), this.markerMaterial)
    this.measurementOperator = new MeasurementOperator('')
    this.measurementOperator
      .getInput(MeasurementOperator.IO_NAMES.StartXfo)
      .setParam(this.startMarker.getParameter('GlobalXfo'))
    this.measurementOperator
      .getInput(MeasurementOperator.IO_NAMES.EndXfo)
      .setParam(this.endMarker.getParameter('GlobalXfo'))

    const label = new Label('Distance')
    label.getParameter('FontSize').setValue(12)
    label.getParameter('BackgroundColor').setValue(new Color('#94C47D'))

    const billboard = new BillboardItem('DistanceBillboard', label)
    billboard.getParameter('LocalXfo').setValue(new Xfo())
    billboard.getParameter('PixelsPerMeter').setValue(300)
    billboard.getParameter('AlignedToCamera').setValue(true)
    billboard.getParameter('DrawOnTop').setValue(true)
    billboard.getParameter('Alpha').setValue(1)

    this.measurementOperator
      .getOutput(MeasurementOperator.IO_NAMES.LabelXfo)
      .setParam(billboard.getParameter('LocalXfo'))
    this.measurementOperator.getOutput(MeasurementOperator.IO_NAMES.Distance).setParam(label.getParameter('Text'))

    if (event.intersectionData) {
      const geomItem = event.intersectionData.geomItem
      this.startMarker.getParameter('GlobalXfo').setValue(geomItem.getParameter('GlobalXfo').getValue())
    }
    this.line = new Lines(0.0)
    this.line.setNumVertices(2)
    this.line.setNumSegments(1)
    this.line.setSegmentVertexIndices(0, 0, 1)
    this.line.lineThickness = 0.4

    const lineGeomItem = new GeomItem('Line', this.line, this.lineMaterial)

    measurementItem.addChild(this.startMarker)
    measurementItem.addChild(this.endMarker)
    measurementItem.addChild(billboard)
    measurementItem.addChild(lineGeomItem)
    this.renderer.addTreeItem(measurementItem)
    this.dragging = false
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerMove(event) {
    if (this.dragging) {
      const dist = event.pointerRay.intersectRayPlane(this.gizmoRay)
      event.holdPos = event.pointerRay.pointAtDist(dist)
      console.log('holdPos', event.holdPos)
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerUp(event) {
    if (event.intersectionData) {
      const geomItem = event.intersectionData.geomItem
      this.endMarker.getParameter('GlobalXfo').setValue(geomItem.getParameter('GlobalXfo').getValue())
      this.line
        .getVertexAttribute('positions')
        .getValueRef(1)
        .setFromOther(geomItem.getParameter('GlobalXfo').getValue())
    }

    console.log('PointerUp')
    this.dragging = false
    this.measurementOperator = undefined
    this.startMarker = undefined
    this.endMarker = undefined
    this.line = undefined
  }
}

UndoRedoManager.registerChange('MeasurementTool', MeasurementTool)

export { MeasurementTool }
