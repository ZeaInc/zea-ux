import BaseTool from '../BaseTool.js';
import SceneWidget from '../../sceneWidgets/SceneWidget.js';
import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import Change from '../../undoredo/Change.js';

/**
 * Class representing a hold objects change.
 * @extends Change
 */
class HoldObjectsChange extends Change {
  /**
   * Create a hold objects change.
   * @param {any} data - The data value.
   */
  constructor(data) {
    super('HoldObjectsChange');

    this.__selection = [];
    this.__prevXfos = [];
    this.__newXfos = [];

    if (data) this.update(data);
  }

  /**
   * The undo method.
   */
  undo() {
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i]) {
        this.__selection[i].setGlobalXfo(this.__prevXfos[i]);
      }
    }
  }

  /**
   * The redo method.
   */
  redo() {
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i]) {
        this.__selection[i].setGlobalXfo(this.__newXfos[i]);
      }
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.newItem) {
      this.__selection[updateData.newItemId] = updateData.newItem;
      this.__prevXfos[updateData.newItemId] = updateData.newItem.getGlobalXfo();
    } else if (updateData.changeXfos) {
      for (let i = 0; i < updateData.changeXfoIds.length; i++) {
        const gidx = updateData.changeXfoIds[i];
        if (!this.__selection[gidx]) continue;
        this.__selection[gidx].setGlobalXfo(updateData.changeXfos[i]);
        this.__newXfos[gidx] = updateData.changeXfos[i];
      }
    }
    this.updated.emit(updateData);
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   * @return {any} The return value.
   */
  toJSON(appData) {
    const j = super.toJSON(appData);

    const itemPaths = [];
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i]) {
        itemPaths[i] = this.__selection[i].getPath();
      } else {
        itemPaths.push(null);
      }
    }
    j.itemPaths = itemPaths;

    return j;
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} appData - The appData param.
   */
  fromJSON(j, appData) {
    super.fromJSON(j, appData);

    const newSelection = [];
    for (let i = 0; i < j.itemPaths.length; i++) {
      const itemPath = j.itemPaths[i];
      if (itemPath)
        newSelection[i] = appData.scene.getRoot().resolvePath(itemPath, 1);
    }
    this.__selection = newSelection;
  }

  // changeFromJSON(j) {

  //   if(updateData.newItem) {
  //     this.__selection[updateData.newItemId] = updateData.newItem;
  //     this.__prevXfos[updateData.newItemId] = updateData.newItem.getGlobalXfo();
  //   }
  //   else if(updateData.changeXfos) {
  //     for(let i=0; i<updateData.changeXfoIds.length; i++){
  //       const gidx = updateData.changeXfoIds[i];
  //       if(!this.__selection[gidx])
  //         continue;
  //       this.__selection[gidx].setGlobalXfo(updateData.changeXfos[i]);
  //       this.__newXfos[gidx] = updateData.changeXfos[i];
  //     }
  //   }
  //   this.updated.emit(updateData);
  // }
}

UndoRedoManager.registerChange('HoldObjectsChange', HoldObjectsChange);

/**
 * Class representing a VR hold objects tool.
 * @extends BaseTool
 */
class VRHoldObjectsTool extends BaseTool {
  /**
   * Create a VR hold objects tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.__pressedButtonCount = 0;

    this.__freeIndices = [];
    this.__vrControllers = [];
    this.__heldObjectCount = 0;
    this.__heldGeomItems = [];
    this.__heldGeomItemIds = []; // controller id to held goem id.
    this.__heldGeomItemRefs = [];
    this.__heldGeomItemOffsets = [];
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();
    console.log('activateTool.VRHoldObjectsTool');

    this.appData.renderer.getDiv().style.cursor = 'crosshair';

    const addIconToController = controller => {
      // The tool might already be deactivated.
      if (!this.__activated) return;
      const cross = new ZeaEngine.Cross(0.03);
      const mat = new ZeaEngine.Material('Cross', 'FlatSurfaceShader');
      mat.getParameter('BaseColor').setValue(new ZeaEngine.Color('#03E3AC'));
      mat.visibleInGeomDataBuffer = false;
      const geomItem = new ZeaEngine.GeomItem('SceneWidgetToolTip', cross, mat);
      controller.getTipItem().removeAllChildren();
      controller.getTipItem().addChild(geomItem, false);
    };

    this.appData.renderer.getXRViewport().then(xrvp => {
      for (const controller of xrvp.getControllers())
        addIconToController(controller);
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

    this.appData.renderer.getXRViewport().then(xrvp => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.controllerAdded.disconnectId(this.addIconToControllerId);
    });
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The computeGrabXfo method.
   * @param {any} refs - The refs param.
   * @return {any} The return value.
   */
  computeGrabXfo(refs) {
    let grabXfo;
    if (refs.length == 1) {
      grabXfo = this.__vrControllers[refs[0]].getTipXfo();
    } else if (refs.length == 2) {
      const xfo0 = this.__vrControllers[refs[0]].getTipXfo();
      const xfo1 = this.__vrControllers[refs[1]].getTipXfo();

      xfo0.ori.alignWith(xfo1.ori);

      grabXfo = new ZeaEngine.Xfo();
      grabXfo.tr = xfo0.tr.lerp(xfo1.tr, 0.5);
      grabXfo.ori = xfo0.ori.lerp(xfo1.ori, 0.5);

      let vec0 = xfo1.tr.subtract(xfo0.tr);
      vec0.normalizeInPlace();
      const vec1 = grabXfo.ori.getXaxis();
      if (vec0.dot(vec1) < 0.0) vec0 = vec0.negate();

      const angle = vec0.angleTo(vec1);
      if (angle > 0) {
        const axis = vec1.cross(vec0);
        axis.normalizeInPlace();
        const align = new ZeaEngine.Quat();
        align.setFromAxisAndAngle(axis, angle);
        grabXfo.ori = align.multiply(grabXfo.ori);
      }
    }
    return grabXfo;
  }

  /**
   * The initAction method.
   */
  initAction() {
    for (let i = 0; i < this.__heldGeomItems.length; i++) {
      const heldGeom = this.__heldGeomItems[i];
      if (!heldGeom) continue;
      const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i]);
      this.__heldGeomItemOffsets[i] = grabXfo
        .inverse()
        .multiply(heldGeom.getGlobalXfo());
    }
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    const id = event.controller.getId();
    this.__vrControllers[id] = event.controller;

    const intersectionData = event.controller.getGeomItemAtTip();
    if (intersectionData) {
      if (intersectionData.geomItem.getOwner() instanceof SceneWidget)
        return false;

      // console.log("onMouseDown on Geom"); // + " Material:" + geomItem.getMaterial().name);
      // console.log(intersectionData.geomItem.getPath()); // + " Material:" + geomItem.getMaterial().name);
      event.intersectionData = intersectionData;
      intersectionData.geomItem.onMouseDown(event, intersectionData);
      if (event.vleStopPropagation == true) return false;

      let gidx = this.__heldGeomItems.indexOf(intersectionData.geomItem);
      if (gidx == -1) {
        gidx = this.__heldGeomItems.length;
        this.__heldObjectCount++;
        this.__heldGeomItems.push(intersectionData.geomItem);
        this.__heldGeomItemRefs[gidx] = [id];
        this.__heldGeomItemIds[id] = gidx;

        const changeData = {
          newItem: intersectionData.geomItem,
          newItemId: gidx,
        };
        if (!this.change) {
          this.change = new HoldObjectsChange(changeData);
          this.appData.undoRedoManager.addChange(this.change);
        } else {
          this.change.update(changeData);
        }
      } else {
        this.__heldGeomItemIds[id] = gidx;
        this.__heldGeomItemRefs[gidx].push(id);
      }
      this.initAction();
      return true;
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    const id = event.controller.getId();

    this.__pressedButtonCount--;
    if (this.__heldGeomItemIds[id] !== undefined) {
      const gidx = this.__heldGeomItemIds[id];
      const refs = this.__heldGeomItemRefs[gidx];
      refs.splice(refs.indexOf(id), 1);
      if (refs.length == 0) {
        this.__heldObjectCount--;
        this.__heldGeomItems[gidx] = undefined;

        this.change = undefined;
      }
      this.__heldGeomItemIds[id] = undefined;
      this.initAction();
      return true;
    }
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (!this.change) return false;

    const changeXfos = [];
    const changeXfoIds = [];
    for (let i = 0; i < this.__heldGeomItems.length; i++) {
      const heldGeom = this.__heldGeomItems[i];
      if (!heldGeom) continue;
      const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i]);
      changeXfos.push(grabXfo.multiply(this.__heldGeomItemOffsets[i]));
      changeXfoIds.push(i);
    }

    this.change.update({ changeXfos, changeXfoIds });

    return true;
  }
}
export { VRHoldObjectsTool };
