import BaseTool from '../BaseTool.js';

export default class OpenVRUITool extends BaseTool {
  constructor(appData, vrUITool) {
    super(appData);

    this.vrUITool = vrUITool;
  }


  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {}

  onVRControllerButtonUp(event) {}

  onVRPoseChanged(event) {

    // Controller coordinate system
    // X = Horizontal.
    // Y = Up.
    // Z = Towards handle base.
    const headXfo = event.viewXfo;
    const checkControllers = (ctrlA, ctrlB) => {
      if(!ctrlA)
        return false;
      const xfoA = ctrlA.getTreeItem().getGlobalXfo();
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
      headToCtrlA.normalizeInPlace();
      if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) < (Math.PI * 0.25)) {
        this.vrUITool.setUIControllers(ctrlA, ctrlB, headXfo);
        this.appData.toolManager.pushTool(this.vrUITool);
        return true;
      }
    }

    if (event.controllers.length > 0) {
      if(checkControllers(event.controllers[0], event.controllers[1]))
        return true;
      if(checkControllers(event.controllers[1], event.controllers[0]))
        return true;
    }
  }

};