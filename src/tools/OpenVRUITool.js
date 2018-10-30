import BaseTool from './BaseTool.js';
import VRUITool from './VRUITool.js';

export default class OpenVRUITool extends BaseTool {
  constructor(appData) {
    super(appData);

    this.vrUITool = new VRUITool(appData);
  }


  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event, vrviewport) {}

  onVRControllerButtonUp(event, vrviewport) {}

  onVRPoseChanged(event, vrviewport) {

    // Controller coordinate system
    // X = Horizontal.
    // Y = Up.
    // Z = Towards handle base.
    const headXfo = event.viewXfo;
    const checkControllers = (ctrlA, ctrlB) => {
      const xfoA = ctrlA.getTreeItem().getGlobalXfo();
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
      headToCtrlA.normalizeInPlace();
      if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) < (Math.PI * 0.25)) {
        this.vrUITool.setUIControllers(ctrlA, ctrlB);
        this.appData.toolManager.pushTool(this.vrUITool);
        return true;
      }
    }

    if (event.controllers.length == 2) {
      if(checkControllers(event.controllers[0], event.controllers[1]))
        return true;
      if(checkControllers(event.controllers[1], event.controllers[0]))
        return true;
    }
  }

};