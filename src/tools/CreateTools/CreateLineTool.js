import {
  Color,
  NumberParameter,
  GeomItem,
  Material,
  Lines,
} from '@zeainc/zea-engine'

import UndoRedoManager from '../../undoredo/UndoRedoManager.js'
import { CreateGeomChange, CreateGeomTool } from './CreateGeomTool.js'

/**
 * Class representing a create line change.
 * @extends CreateGeomChange
 */
class CreateLineChange extends CreateGeomChange {
  /**
   * Create a create line change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   * @param {any} color - The color value.
   * @param {any} thickness - The thickness value.
   */
  constructor(parentItem, xfo, color, thickness) {
    super('Create Line')

    this.line = new Lines(0.0)
    this.line.setNumVertices(2)
    this.line.setNumSegments(1)
    this.line.setSegment(0, 0, 1)
    const material = new Material('Line', 'LinesShader')
    material.getParameter('Color').setValue(new Color(0.7, 0.2, 0.2))
    this.geomItem = new GeomItem('Line')
    this.geomItem.setGeometry(this.line)
    this.geomItem.setMaterial(material)

    if (color) {
      material.getParameter('Color').setValue(color)
    }

    if (thickness) {
      this.line.lineThickness = thickness
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
    }

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.p1) {
      this.line.getVertex(1).setFromOther(updateData.p1)
      this.line.geomDataChanged.emit()
    }
    this.emit('updated', updateData)
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context)
    if (j.color) {
      const color = new Color()
      color.fromJSON(j.color)
      material.getParameter('Color').setValue(color)
    }

    if (j.thickness) {
      this.line.lineThickness = j.thickness
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
    }
  }
}
UndoRedoManager.registerChange('CreateLineChange', CreateLineChange)

/**
 * Class representing a create line tool.
 * @extends CreateGeomTool
 */
export default class CreateLineTool extends CreateGeomTool {
  /**
   * Create a create line tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData)

    this.tp = this.addParameter(
      new NumberParameter('Line Thickness', 0.06, [0, 0.1])
    ) // 1cm.
  }

  // activateTool() {
  //   super.activateTool();

  //   this.appData.renderer.getDiv().style.cursor = "crosshair";

  //   this.appData.renderer.getXRViewport().then(xrvp => {
  //     if(!this.vrControllerToolTip) {
  //       this.vrControllerToolTip = new Sphere(this.tp.getValue(), 64);
  //       this.vrControllerToolTipMat = new Material('marker', 'FlatSurfaceShader');
  //       this.vrControllerToolTipMat.getParameter('BaseColor').setValue(this.cp.getValue());
  //     }
  //     const addIconToController = (controller) => {
  //       // The tool might already be deactivated.
  //       if(!this.__activated)
  //         return;
  //       const geomItem = new GeomItem('VRControllerTip', this.vrControllerToolTip, this.vrControllerToolTipMat);
  //       controller.getTipItem().removeAllChildren();
  //       controller.getTipItem().addChild(geomItem, false);
  //     }
  //     for(let controller of xrvp.getControllers()) {
  //       addIconToController(controller)
  //     }
  //     this.addIconToControllerId = xrvp.on('controllerAdded', addIconToController);
  //   });

  // }

  // deactivateTool() {
  //   super.deactivateTool();

  //   this.appData.renderer.getDiv().style.cursor = "pointer";

  //   this.appData.renderer.getXRViewport().then(xrvp => {
  //     // for(let controller of xrvp.getControllers()) {
  //     //   controller.getTipItem().removeAllChildren();
  //     // }
  //     xrvp.removeListenerById('controllerAdded', this.addIconToControllerId);
  //   });
  // }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateLineChange(parentItem, xfo)
    this.appData.undoRedoManager.addChange(this.change)

    this.xfo = xfo.inverse()
    this.stage = 1
    this.length = 0.0
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    const offet = this.xfo.transformVec3(pt)
    this.length = offet.length()
    this.change.update({ p1: offet })
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {
    if (this.length == 0) {
      this.appData.undoRedoManager.undo(false)
    }
    this.stage = 0
    this.emit('actionFinished')
  }
}
export { CreateLineTool }
