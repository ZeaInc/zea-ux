import BaseTool from './BaseTool.js';
import Handle from '../handles/Handle.js';


export default class HandleTool extends BaseTool {
  constructor(appData) {
    super(appData);

    this.activeHandle = undefined;
  }

  activateTool() {
    super.activateTool();
    console.log("activateTool.HandleTool")

    this.appData.renderer.getDiv().style.cursor = "crosshair";

    const addIconToController = (controller) => {
      // The tool might already be deactivated.
      if(!this.__activated)
        return;
      const cross = new Visualive.Cross(0.03);
      const mat = new Visualive.Material('Cross', 'ToolIconShader');
      mat.getParameter('BaseColor').setValue(new Visualive.Color("#03E3AC"));
      const geomItem = new Visualive.GeomItem('HandleToolTip', cross, mat);
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
  // Mouse events

  onMouseDown(event) {
    // 
    if (!this.activeHandle) {
      event.viewport.renderGeomDataFbo();
      const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos);
      if (intersectionData == undefined) 
        return;
      if(intersectionData.geomItem.getOwner() instanceof Handle) {
        this.activeHandle = intersectionData.geomItem.getOwner();
        this.activeHandle.handleMouseDown(Object.assign(event, { intersectionData } ));
        return true;
      }
    }
  }

  onMouseMove(event) {
    if (this.activeHandle) {
      this.activeHandle.handleMouseMove(event);
      return true;
    }
  }

  onMouseUp(event) {
    if (this.activeHandle) {
      this.activeHandle.handleMouseUp(event);
      this.activeHandle = undefined;
      return true;
    }
  }

  onWheel(event) {
    if (this.activeHandle) {
      this.activeHandle.onWheel(event);
    }
  }

  /////////////////////////////////////
  // Touch events
  onTouchStart(event) {}

  onTouchMove(event) {}

  onTouchEnd(event) {}

  onTouchCancel(event) {}

  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {
    if (!this.activeHandle) {
      const intersectionData = event.controller.getGeomItemAtTip();
      if (intersectionData == undefined) 
        return;
      if (intersectionData.geomItem.getOwner() instanceof Handle) {
        const gizmo = intersectionData.geomItem.getOwner();
        this.activeHandle = gizmo;
        this.activeHandle.onVRControllerButtonDown(event);
        return true;
      }
    }
  }

  onVRPoseChanged(event) {
    if (this.activeHandle) {
      this.activeHandle.onVRPoseChanged(event);
      return true;
    } else {
      // let gizmoHit = false;
      // for (let controller of event.controllers) {
      //   const intersectionData = controller.getGeomItemAtTip();
      //   if (intersectionData != undefined && intersectionData.geomItem instanceof Handle) {
      //     const gizmo = intersectionData.geomItem;
      //     if (this.__highlightedHandle)
      //       this.__highlightedHandle.unhiglight();

      //     this.__highlightedHandle = gizmo;
      //     this.__highlightedHandle.higlight();
      //     gizmoHit = true;
      //     break;
      //   }
      // }

      // if (!gizmoHit) {
      //   if (this.__highlightedHandle) {
      //     this.__highlightedHandle.unhiglight();
      //     this.__highlightedHandle = undefined;
      //   }
      // }
    }
  }

  onVRControllerButtonUp(event) {
    if (this.activeHandle) {
      this.activeHandle.onDragEnd(event);
      this.activeHandle = undefined;

      if (this.__highlightedHandle && this.activeController == event.controller) {
        // Check if by releasing the button, we should immedietly
        // unhilight the gizmo. 
        // It is possible that the higlight is still on for a gizmo
        // we are interacting with, even though the controller is no longer touching
        // it.
        const intersectionData = event.controller.getGeomItemAtTip();
        if (!intersectionData != undefined || intersectionData.geomItem != this.__highlightedHandle) {
          const gizmo = intersectionData.geomItem;
          if (this.__highlightedHandle)
            this.__highlightedHandle.unhiglight();
        }
      }
      return true;
    }

  }

};
