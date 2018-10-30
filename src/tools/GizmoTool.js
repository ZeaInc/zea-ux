import BaseTool from './BaseTool.js';
import Gizmo from '../gizmos/Gizmo.js';


export default class GizmoTool extends BaseTool {
  constructor(appData) {
    super(appData);

    this.activeGizmo = undefined;
  }

  activateTool() {
    super.activateTool();
    console.log("activateTool.GizmoTool")

    this.appData.renderer.getDiv().style.cursor = "crosshair";

    const addIconToController = (controller) => {
      if(!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Visualive.Cross(0.03);
        this.vrControllerToolTipMat = new Visualive.Material('Cross', 'ToolIconShader');
        this.vrControllerToolTipMat.getParameter('BaseColor').setValue(new Visualive.Color("#03E3AC"));
      }
      const geomItem = new Visualive.GeomItem('GizmoToolTip', this.vrControllerToolTip, this.vrControllerToolTipMat);
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
  // Mouse events

  onMouseDown(event, mousePos, viewport) {
    // 
    if (!this.activeGizmo) {
      viewport.renderGeomDataFbo();
      const intersectionData = viewport.getGeomDataAtPos(mousePos);
      if (intersectionData == undefined) 
        return;
      if(intersectionData.geomItem.getOwner() instanceof Gizmo) {
        this.activeGizmo = intersectionData.geomItem.getOwner();
        this.activeGizmo.handleMouseDown(Object.assign(event, {intersectionData, mouseRay:intersectionData.mouseRay}), mousePos);
        return true;
      }
    }
  }

  onMouseMove(event, mousePos, viewport) {
    if (this.activeGizmo) {
      this.activeGizmo.handleMouseMove(event, mousePos, viewport);
      return true;
    }
  }

  onMouseUp(event, mousePos, viewport) {
    if (this.activeGizmo) {
      this.activeGizmo.handleMouseUp(event, mousePos, viewport);
      this.activeGizmo = undefined;
      return true;
    }
  }

  onWheel(event, viewport) {
    if (this.activeGizmo) {
      this.activeGizmo.onWheel(event);
    }
  }

  /////////////////////////////////////
  // Touch events
  onTouchStart(event, viewport) {}

  onTouchMove(event, viewport) {}

  onTouchEnd(event, viewport) {}

  onTouchCancel(event, viewport) {}

  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {
    if (!this.activeGizmo) {
      const intersectionData = event.controller.getGeomItemAtTip();
      if (intersectionData == undefined) 
        return;
      if (intersectionData.geomItem.getOwner() instanceof Gizmo) {
        const gizmo = intersectionData.geomItem.getOwner();
        this.activeGizmo = gizmo;
        this.activeGizmo.onVRControllerButtonDown(event);
        return true;
      }
    }
  }

  onVRPoseChanged(event) {
    if (this.activeGizmo) {
      this.activeGizmo.onVRPoseChanged(event);
      return true;
    } else {
      // let gizmoHit = false;
      // for (let controller of event.controllers) {
      //   const intersectionData = controller.getGeomItemAtTip();
      //   if (intersectionData != undefined && intersectionData.geomItem instanceof Gizmo) {
      //     const gizmo = intersectionData.geomItem;
      //     if (this.__highlightedGizmo)
      //       this.__highlightedGizmo.unhiglight();

      //     this.__highlightedGizmo = gizmo;
      //     this.__highlightedGizmo.higlight();
      //     gizmoHit = true;
      //     break;
      //   }
      // }

      // if (!gizmoHit) {
      //   if (this.__highlightedGizmo) {
      //     this.__highlightedGizmo.unhiglight();
      //     this.__highlightedGizmo = undefined;
      //   }
      // }
    }
  }

  onVRControllerButtonUp(event) {
    if (this.activeGizmo) {
      this.activeGizmo.onDragEnd(event);
      this.activeGizmo = undefined;

      if (this.__highlightedGizmo && this.activeController == event.controller) {
        // Check if by releasing the button, we should immedietly
        // unhilight the gizmo. 
        // It is possible that the higlight is still on for a gizmo
        // we are interacting with, even though the controller is no longer touching
        // it.
        const intersectionData = event.controller.getGeomItemAtTip();
        if (!intersectionData != undefined || intersectionData.geomItem != this.__highlightedGizmo) {
          const gizmo = intersectionData.geomItem;
          if (this.__highlightedGizmo)
            this.__highlightedGizmo.unhiglight();
        }
      }
      return true;
    }

  }

};
