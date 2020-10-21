import { Material, Color, Ray, GeomItem, Sphere } from '@zeainc/zea-engine'
import BaseTool from './BaseTool'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'

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

    this.startMarker = undefined
    this.endMarker = undefined
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerDown(event) {
    this.gizmoRay = new Ray()

    const ray = event.pointerRay
    const cameraXfo = event.viewport.getCamera().getParameter('GlobalXfo').getValue()
    this.gizmoRay.dir = cameraXfo.ori.getZaxis()

    this.startMarker = new GeomItem('', new Sphere(0.01), this.markerMaterial)

    this.renderer.addTreeItem(this.startMarker)
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerMove(event) {
    console.log('PointerMove')
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerUp(event) {
    console.log('PointerUp')
  }
}

UndoRedoManager.registerChange('MeasurementTool', MeasurementTool)

export { MeasurementTool }
