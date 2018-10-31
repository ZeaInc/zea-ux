import BaseTool from '../BaseTool.js';
import Gizmo from '../../gizmos/Gizmo.js';
import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import Change from '../../undoredo/Change.js';


class HoldObjectsChange extends Change {
  constructor(data) {
    super('HoldObjectsChange');

    this.__selection = [];
    this.__prevXfos = [];
    this.__newXfos = [];

    if(data) 
      this.update(data);
  }

  undo() {
    for(let i=0; i<this.__selection.length; i++){
      if(this.__selection[i]){
        this.__selection[i].setGlobalXfo(this.__prevXfos[i])
      }
    }
  }

  redo() {
    for(let i=0; i<this.__selection.length; i++){
      if(this.__selection[i]){
        this.__selection[i].setGlobalXfo(this.__newXfos[i])
      }
    }
  }

  update(updateData) {
    if(updateData.newItemPath) {
      const newItem = appData.scene.getRoot().resolvePath(updateData.newItemPath, 1)
      this.__selection[updateData.newItemId] = newItem;
      this.__prevXfos[updateData.newItemId] = newItem.getGlobalXfo();
    }
    else if(updateData.changeXfos) {
      for(let i=0; i<updateData.changeXfoIds.length; i++){
        const gidx = updateData.changeXfoIds[i];
        if(!this.__selection[gidx])
          continue;
        this.__selection[gidx].setGlobalXfo(updateData.changeXfos[i]);
        this.__newXfos[gidx] = updateData.changeXfos[i];
      }
    }
    this.updated.emit(updateData);
  }

  toJSON(appData) { 
    const j = super.toJSON(appData);

    const itemPaths = [];
    for (let treeItem of this.__selection){
        if(treeItem){
          itemPaths.push(treeItem.getPath())
        }
        else{
          itemPaths.push(null)
        }
    }
    j.itemPaths = itemPaths;

    return j;
  }

  fromJSON(j, appData) {
    super.fromJSON(j, appData);

    const newSelection = [];
    for(let i=0; i<j.itemPaths.length; i++){
      for (let itemPath of j.itemPaths){
        if(itemPath)
          newSelection.push(appData.scene.getRoot().resolvePath(itemPath, 1));
      }
    }
    this.__newSelection = newSelection;

  }

  changeFromJSON(j) {
    if (this.__nextValue.fromJSON)
      this.__nextValue.fromJSON(j.value);
    else
      this.__nextValue = j.value;
    this.__param.setValue(this.__nextValue);
  }
}

UndoRedoManager.registerChange('HoldObjectsChange', HoldObjectsChange)

export default class VRHoldObjectsTool extends BaseTool {
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

  activateTool() {
    super.activateTool();
    console.log("activateTool.VRHoldObjectsTool")

    this.appData.renderer.getDiv().style.cursor = "crosshair";

    const addIconToController = (controller) => {
      // The tool might already be deactivated.
      if(!this.__activated)
        return;
      const cross = new Visualive.Cross(0.03);
      const mat = new Visualive.Material('Cross', 'ToolIconShader');
      mat.getParameter('BaseColor').setValue(new Visualive.Color("#03E3AC"));
      const geomItem = new Visualive.GeomItem('GizmoToolTip', cross, mat);
      controller.getTipItem().addChild(geomItem, false);
    }
    const addIconToControllers = (vrviewport)=>{
      for(let controller of vrviewport.getControllers()) {
        addIconToController(controller)
      }
      if(!this.addIconToControllerId)
        this.addIconToControllerId = vrviewport.controllerAdded.connect(addIconToController);
    }

    const vrviewport = this.appData.renderer.getVRViewport();
    if (vrviewport) {
      addIconToControllers(vrviewport);
    }
    else {
      this.appData.renderer.vrViewportSetup.connect((vrviewport)=>{
        addIconToControllers(vrviewport);
      });
    }
  }

  deactivateTool() {
    super.deactivateTool();

    const vrviewport = this.appData.renderer.getVRViewport();
    if(vrviewport) {
      const removeIconFromController = (controller) => {
        controller.getTipItem().removeAllChildren();
      }
      for(let controller of vrviewport.getControllers()) {
        removeIconFromController(controller)
      }
    }
  }

  /////////////////////////////////////
  // VRController events

  computeGrabXfo(refs){
      let grabXfo;
      if(refs.length == 1) {
          grabXfo = this.__vrControllers[refs[0]].getTipXfo();
      }
      else if(refs.length == 2) {
          const xfo0 = this.__vrControllers[refs[0]].getTipXfo();
          const xfo1 = this.__vrControllers[refs[1]].getTipXfo();

          xfo0.ori.alignWith(xfo1.ori);

          grabXfo = new Visualive.Xfo();
          grabXfo.tr = xfo0.tr.lerp(xfo1.tr, 0.5);
          grabXfo.ori = xfo0.ori.lerp(xfo1.ori, 0.5);

          let vec0 = xfo1.tr.subtract(xfo0.tr);
          vec0.normalizeInPlace();
          const vec1 = grabXfo.ori.getXaxis();
          if(vec0.dot(vec1) < 0.0)
              vec0 = vec0.negate();
          
          const angle = vec0.angleTo(vec1);
          if(angle > 0){
              const axis = vec1.cross(vec0);
              axis.normalizeInPlace();
              const align = new Visualive.Quat();
              align.setFromAxisAndAngle(axis, angle);
              grabXfo.ori = align.multiply(grabXfo.ori);
          }
      }
      return grabXfo;
  }

  initAction() {
    for (let i=0;i < this.__heldGeomItems.length; i++){
      const heldGeom = this.__heldGeomItems[i];
      if(!heldGeom)
          continue;
      const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i]);
      this.__heldGeomItemOffsets[i] = grabXfo.inverse().multiply(heldGeom.getGlobalXfo());
    }
  }

  onVRControllerButtonDown(event, vrviewport) {
    const id = event.controller.getId();
    this.__vrControllers[id] = event.controller;

    const intersectionData = event.controller.getGeomItemAtTip();
    if(intersectionData){
      if (intersectionData.geomItem.getOwner() instanceof Gizmo)
        return false;

      let gidx = this.__heldGeomItems.indexOf(intersectionData.geomItem);
      if(gidx == -1){
        gidx = this.__heldGeomItems.length;
        this.__heldObjectCount++;
        this.__heldGeomItems.push(intersectionData.geomItem);
        this.__heldGeomItemRefs[gidx] = [id];
        this.__heldGeomItemIds[id] = gidx;

        const changeData = { newItemPath: intersectionData.geomItem.getPath(), newItemId: gidx }
        if(!this.change) {
          this.change = new HoldObjectsChange(changeData);
          this.appData.undoRedoManager.addChange(this.change);
        }
        else {
          this.change.update(changeData)
        }
      }
      else{
        this.__heldGeomItemIds[id] = gidx;
        this.__heldGeomItemRefs[gidx].push(id);
      }
      this.initAction();
      return true;
    }
  }

  onVRControllerButtonUp(event, vrviewport) {
    const id = event.controller.getId();

    this.__pressedButtonCount--;
    if(this.__heldGeomItemIds[id] !== undefined){
      const gidx = this.__heldGeomItemIds[id];
      const refs = this.__heldGeomItemRefs[gidx]
      refs.splice(refs.indexOf(id), 1);
      if(refs.length == 0){
        this.__heldObjectCount--;
        this.__heldGeomItems[gidx] = undefined;

        this.change = undefined;
      }
      this.__heldGeomItemIds[id] = undefined;
      this.initAction();
      return true;
    }
  }

  onVRPoseChanged(event, vrviewport) {

    if(!this.change)
      return false;

    const changeXfos = [];
    const changeXfoIds = [];
    for (let i=0;i < this.__heldGeomItems.length; i++){
      const heldGeom = this.__heldGeomItems[i];
      if(!heldGeom)
          continue;
      const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i]);
      changeXfos.push(grabXfo.multiply(this.__heldGeomItemOffsets[i]));
      changeXfoIds.push(i);
    }

    this.change.update({ changeXfos, changeXfoIds });

    return true;
  }

};