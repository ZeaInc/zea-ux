import BaseTool from './BaseTool.js';

export default class VRUITool extends BaseTool {
  constructor(appData) {
    super(appData);

    this.__triggerHeld = false;


    const uimat = new Visualive.Material('uimat', 'FlatSurfaceShader');

    // this.__uiimage = new DataImage();
    // uimat.getParameter('BaseColor').setValue(this.__uiimage);

    this.__uiGeomItem = new Visualive.GeomItem('VRControllerUI', new Visualive.Plane(), uimat);
    this.__uiGeomItem.getLocalXfo().tr.set(0.0, -0.07, 0.05); 
    this.__uiGeomItem.getLocalXfo().ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * -0.6);
    this.__uiGeomItemGeomXfo = new Visualive.Xfo();
    this.__uiGeomItemGeomXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), -Math.PI);
    this.__uiGeomItemGeomXfo.sc.set(0.3, 0.2, 1.0);
    this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomItemGeomXfo)
    this.__dims = { width: 200, height: 300 };
    // this.__uiGeomItem.setVisible(false);
    this.__uiGeomItem.addRef(this)


    const pointermat = new Visualive.Material('pointermat', 'FlatSurfaceShader');
    pointermat.getParameter('BaseColor').setValue(new Visualive.Color(1.2, 0, 0));

    const line = new Visualive.Lines();
    line.setNumVertices(2);
    line.setNumSegments(1);
    line.setSegment(0, 0, 1);
    line.getVertex(0).set(0.0, 0.0, 0.0);
    line.getVertex(1).set(0.0, 0.0, -1.0);
    line.setBoundingBoxDirty();

    this.__uiPointerItem = new Visualive.GeomItem('VRControllerPointer', line, pointermat);
    this.__uiPointerItem.getLocalXfo().tr.set(0.0, -0.08, -0.04);
    this.__uiPointerItem.getLocalXfo().ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * -0.2);
    // this.__uiPointerItem.setVisible(false);
    this.__uiPointerItem.addRef(this)
  }

  /////////////////////////////////////

  setUIControllers(uiController, pointerController) {
    this.uiController = uiController;
    this.pointerController = pointerController;

  }

  activateTool() {
    super.activateTool();

    this.uiController.getTipItem().addChild(this.__uiGeomItem);
    this.pointerController.getTipItem().addChild(this.__uiPointerItem);
  }

  deactivateTool() {
    super.deactivateTool();
    this.uiController.getTipItem().removeAllChildren();
    this.pointerController.getTipItem().removeAllChildren();
  }

  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event, vrviewport) {

    if(event.controller == this.pointerController){
      this.__triggerHeld = true;
    }

    // While the UI is open, no other tools get events.
    return true;
  }

  onVRControllerButtonUp(event, vrviewport) {

    if(event.controller == this.pointerController){
      this.__triggerHeld = false;
    }

    // While the UI is open, no other tools get events.
    return true;
  }

  onVRPoseChanged(event, vrviewport) {

    // Controller coordinate system
    // X = Horizontal.
    // Y = Up.
    // Z = Towards handle base.
    const headXfo = event.viewXfo;
    const checkControllers = () => {
      const xfoA = this.uiController.getTreeItem().getGlobalXfo();
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
      headToCtrlA.normalizeInPlace();
      if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) > (Math.PI * 0.5)) {
        // Remove ourself from the system.
        this.appData.toolManager.removeTool(this.index);
      }
    }

    if(!this.__triggerHeld) {
      this.checkControllers();

    }

    // While the UI is open, no other tools get events.
    return true;
  }

};