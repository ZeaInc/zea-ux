import { NumberParameter } from '@zeainc/zea-engine'
import CreateGeomTool from './CreateGeomTool'
import CreateLineChange from './Change/CreateLineChange'

/**
 * Tool for creating a line tool.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateLineTool extends CreateGeomTool {
  /**
   * Create a create line tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData)

    this.tp = this.addParameter(new NumberParameter('Line Thickness', 0.06, [0, 0.1])) // 1cm.
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
   * Starts line geometry creation.
   *
   * @param {Xfo} xfo - The xfo param.
   * @param {TreeItem} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateLineChange(parentItem, xfo)
    this.appData.undoRedoManager.addChange(this.change)

    this.xfo = xfo.inverse()
    this.stage = 1
    this.length = 0.0
  }

  /**
   * Updates line structural data.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    const offet = this.xfo.transformVec3(pt)
    this.length = offet.length()
    this.change.update({ p1: offet })
  }

  /**
   * Finishes Line geometry creation.
   *
   * @param {Vec3} pt - The pt param.
   */
  createRelease(pt) {
    if (this.length == 0) {
      this.appData.undoRedoManager.undo(false)
    }
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateLineTool
export { CreateLineTool }
