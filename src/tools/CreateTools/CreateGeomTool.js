
import {
  Color,
  Xfo,
  Ray,
  ColorParameter,
  GeomItem,
  Material,
  Cross,
} from '@zeainc/zea-engine';

import BaseCreateTool from '../BaseCreateTool.js';
import Change from '../../undoredo/Change.js';

/**
 * Class representing a create geom change.
 * @extends Change
 */
class CreateGeomChange extends Change {
  /**
   * Create a create circle change.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);
  }

  /**
   * The setParentAndXfo method.
   * @param {any} parentItem - The parentItem param.
   * @param {any} xfo - The xfo param.
   */
  setParentAndXfo(parentItem, xfo) {
    this.parentItem = parentItem;
    const name = this.parentItem.generateUniqueName(this.geomItem.getName());
    this.geomItem.setName(name);
    this.geomItem.setGlobalXfo(xfo);
    this.childIndex = this.parentItem.addChild(this.geomItem, true);

    this.geomItem.addRef(this); // keep a ref to stop it being destroyed
  }

  /**
   * The undo method.
   */
  undo() {
    this.parentItem.removeChild(this.childIndex);
  }

  /**
   * The redo method.
   */
  redo() {
    this.parentItem.addChild(this.geomItem, false, false);
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = super.toJSON(context);
    j.parentItemPath = this.parentItem.getPath();
    j.geomItemName = this.geomItem.getName();
    j.geomItemXfo = this.geomItem.getParameter('LocalXfo').getValue();
    return j;
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} appData - The appData param.
   */
  fromJSON(j, context) {
    const sceneRoot = context.appData.scene.getRoot();
    this.parentItem = sceneRoot.resolvePath(j.parentItemPath, 1);
    this.geomItem.setName(this.parentItem.generateUniqueName(j.geomItemName));
    const xfo = new Xfo();
    xfo.fromJSON(j.geomItemXfo);
    this.geomItem.setLocalXfo(xfo);
    this.childIndex = this.parentItem.addChild(this.geomItem, false);
  }

  // changeFromJSON(j) {
  //   if (this.__newValue.fromJSON)
  //     this.__newValue.fromJSON(j.value);
  //   else
  //     this.__newValue = j.value;
  // }

  /**
   * The destroy method.
   */
  destroy() {
    this.geomItem.removeRef(this); // remove the tmp ref.
  }
}

/**
 * Class representing a create geom tool.
 * @extends BaseCreateTool
 */
class CreateGeomTool extends BaseCreateTool {
  /**
   * Create a create geom tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.stage = 0;
    this.removeToolOnRightClick = true;

    this.cp = this.addParameter(
      new ColorParameter(
        'Line Color',
        new Color(0.7, 0.2, 0.2)
      )
    );
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();

    this.appData.renderer.getDiv().style.cursor = 'crosshair';

    this.appData.renderer.getXRViewport().then(xrvp => {
      if (!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Cross(0.05);
        this.vrControllerToolTipMat = new Material(
          'VRController Cross',
          'LinesShader'
        );
        this.vrControllerToolTipMat
          .getParameter('Color')
          .setValue(this.cp.getValue());
        this.vrControllerToolTipMat.visibleInGeomDataBuffer = false;
      }
      const addIconToController = controller => {
        const geomItem = new GeomItem(
          'CreateGeomToolTip',
          this.vrControllerToolTip,
          this.vrControllerToolTipMat
        );
        controller.getTipItem().removeAllChildren();
        controller.getTipItem().addChild(geomItem, false);
      };
      for (const controller of xrvp.getControllers()) {
        addIconToController(controller);
      }
      this.addIconToControllerId = xrvp.controllerAdded.connect(
        addIconToController
      );
    });
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getDiv().style.cursor = 'pointer';

    this.appData.renderer.getXRViewport().then(xrvp => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.controllerAdded.disconnectId(this.addIconToControllerId);
    });
  }

  /**
   * The screenPosToXfo method.
   * @param {any} screenPos - The screenPos param.
   * @param {any} viewport - The viewport param.
   * @return {any} The return value.
   */
  screenPosToXfo(screenPos, viewport) {
    //

    const ray = viewport.calcRayFromScreenPos(screenPos);

    // Raycast any working planes.
    const planeRay = new Ray(
      this.constructionPlane.tr,
      this.constructionPlane.ori.getZaxis()
    );
    const dist = ray.intersectRayPlane(planeRay);
    if (dist > 0.0) {
      const xfo = this.constructionPlane.clone();
      xfo.tr = ray.pointAtDist(dist);
      return xfo;
    }

    // else project based on focal dist.
    const camera = viewport.getCamera();
    const xfo = camera.getGlobalXfo().clone();
    xfo.tr = ray.pointAtDist(camera.getFocalDistance());
    return xfo;
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.stage = 1;
  }

  /**
   * The createPoint method.
   * @param {any} pt - The pt param.
   */
  createPoint(pt) {}

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {}

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {}

  // ///////////////////////////////////
  // Mouse events

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    //
    if (this.stage == 0) {
      if (event.button == 0) {
        this.constructionPlane = new Xfo();

        const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
        this.createStart(xfo, this.appData.scene.getRoot());
      } else if (event.button == 2) {
        // Cancel the tool.
        if (this.removeToolOnRightClick)
          this.appData.toolManager.removeTool(this.index);
      }
      return true;
    } else if (event.button == 2) {
      this.appData.undoRedoManager.undo(false);
      this.stage = 0;
      return true;
    }
    return true;
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.stage > 0) {
      const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
      this.createMove(xfo.tr);
      return true;
    }
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseUp(event) {
    if (this.stage > 0) {
      const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
      this.createRelease(xfo.tr);
      return true;
    }
  }

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   */
  onWheel(event) {}

  // ///////////////////////////////////
  // Keyboard events

  /**
   * The onKeyPressed method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyPressed(key, event) {}

  /**
   * The onKeyDown method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyDown(key, event) {}

  /**
   * The onKeyUp method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyUp(key, event) {}

  // ///////////////////////////////////
  // Touch events

  /**
   * The onTouchStart method.
   * @param {any} event - The event param.
   */
  onTouchStart(event) {}

  /**
   * The onTouchMove method.
   * @param {any} event - The event param.
   */
  onTouchMove(event) {}

  /**
   * The onTouchEnd method.
   * @param {any} event - The event param.
   */
  onTouchEnd(event) {}

  /**
   * The onTouchCancel method.
   * @param {any} event - The event param.
   */
  onTouchCancel(event) {}

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (!this.__activeController) {
      // TODO: Snap the Xfo to any nearby construction planes.
      this.__activeController = event.controller;
      this.constructionPlane = new Xfo();
      const xfo = this.constructionPlane.clone();
      xfo.tr = this.__activeController.getTipXfo().tr;
      this.createStart(xfo, this.appData.scene.getRoot());
    }
    return true;
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.__activeController && this.stage > 0) {
      // TODO: Snap the Xfo to any nearby construction planes.
      const xfo = this.__activeController.getTipXfo();
      this.createMove(xfo.tr);
      return true;
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.stage > 0) {
      if (this.__activeController == event.controller) {
        const xfo = this.__activeController.getTipXfo();
        this.createRelease(xfo.tr);
        if (this.stage == 0) this.__activeController = undefined;
        return true;
      }
    }
  }
}

export { CreateGeomChange, CreateGeomTool };
