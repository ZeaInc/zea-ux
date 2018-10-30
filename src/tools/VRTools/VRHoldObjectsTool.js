import BaseTool from '../BaseTool.js';

export default class VRHoldObjectsTool extends BaseTool {
  constructor(appData) {
    super(appData);


    this.__pressedButtonCount = 0;

    this.__heldObjectCount = 0;
    this.__heldGeomItems = [];
    this.__heldGeomItemIds = []; // controller id to held goem id.
    this.__heldGeomItemRefs = [];
    this.__heldGeomItemOffsets = [];
  }

  activateTool() {
    super.activateTool();
    console.log("activateTool.GizmoTool")

    this.appData.renderer.getDiv().style.cursor = "crosshair";

    const addIconToController = (controller) => {
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
    }

    const vrviewport = this.appData.renderer.getVRViewport();
    if (vrviewport) {
      addIconToControllers(vrviewport);
    }
    else {
      this.appData.renderer.vrViewportSetup.connect((vrviewport)=>{
        addIconToControllers(vrviewport);
        this.addIconToControllerId = vrviewport.controllerAdded.connect(addIconToController);
      });
    }
  }

  deactivateTool() {
    super.deactivateTool();

    const vrviewport = this.appData.renderer.getVRViewport();
    if(vrviewport && this.vrControllerToolTip) {
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

          grabXfo = new Xfo();
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
              const align = new Quat();
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

    const intersectionData = event.controller.getGeomItemAtTip();
    if(intersectionData){
        let gidx = this.__heldGeomItems.indexOf(intersectionData.geomItem);
        if(gidx == -1){
            gidx = this.__heldGeomItems.length;
            this.__heldObjectCount++;
            this.__heldGeomItems.push(geomItem);
            this.__heldGeomItemRefs[gidx] = [id];
            this.__heldGeomItemIds[id] = gidx;
        }
        else{
            this.__heldGeomItemIds[id] = gidx;
            this.__heldGeomItemRefs[gidx].push(id);
        }
        this.initAction();
    }

    // While the UI is open, no other tools get events.
    return true;
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
        }
        this.__heldGeomItemIds[id] = undefined;
        this.initAction();
    }
    // While the UI is open, no other tools get events.
    return true;
  }

  onVRPoseChanged(event, vrviewport) {

    if(this.__heldGeomItems.length == 0)
      return false;

    for (let i=0;i < this.__heldGeomItems.length; i++){
      const heldGeom = this.__heldGeomItems[i];
      if(!heldGeom)
          continue;
      const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i]);
      heldGeom.setGlobalXfo(grabXfo.multiply(this.__heldGeomItemOffsets[i]));
    }

    // While the UI is open, no other tools get events.
    return true;
  }

};