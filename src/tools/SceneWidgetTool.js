import BaseTool from './BaseTool.js';
import SceneWidget from '../sceneWidgets/SceneWidget.js';


export default class SceneWidgetTool extends BaseTool {
  constructor(appData) {
    super(appData);

    this.activeSceneWidget = undefined;
  }

  activateTool() {
    super.activateTool();
    console.log("activateTool.SceneWidgetTool")

    this.appData.renderer.getDiv().style.cursor = "crosshair";

    const addIconToController = (controller) => {
      // The tool might already be deactivated.
      if(!this.__activated)
        return;
      const cross = new Visualive.Cross(0.03);
      const mat = new Visualive.Material('Cross', 'ToolIconShader');
      mat.getParameter('BaseColor').setValue(new Visualive.Color("#03E3AC"));
      const geomItem = new Visualive.GeomItem('SceneWidgetToolTip', cross, mat);
      controller.getTipItem().removeAllChildren();
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
    if (!this.activeSceneWidget) {
      // event.viewport.renderGeomDataFbo();
      const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos);
      if (intersectionData == undefined) 
        return;
      if(intersectionData.geomItem.getOwner() instanceof SceneWidget) {
        this.activeSceneWidget = intersectionData.geomItem.getOwner();
        this.activeSceneWidget.handleMouseDown(Object.assign(event, { intersectionData } ));
        return true;
      }
    }
  }

  onMouseMove(event) {
    if (this.activeSceneWidget) {
      this.activeSceneWidget.handleMouseMove(event);
      return true;
    }
  }

  onMouseUp(event) {
    if (this.activeSceneWidget) {
      this.activeSceneWidget.handleMouseUp(event);
      this.activeSceneWidget = undefined;
      return true;
    }
  }

  onWheel(event) {
    if (this.activeSceneWidget) {
      this.activeSceneWidget.onWheel(event);
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
    if (!this.activeSceneWidget) {
      const intersectionData = event.controller.getGeomItemAtTip();
      if (intersectionData == undefined) 
        return;
      if (intersectionData.geomItem.getOwner() instanceof SceneWidget) {
        const gizmo = intersectionData.geomItem.getOwner();
        this.activeSceneWidget = gizmo;
        this.activeSceneWidget.onVRControllerButtonDown(event);
        return true;
      }
    }
  }

  onVRPoseChanged(event) {
    if (this.activeSceneWidget) {
      this.activeSceneWidget.onVRPoseChanged(event);
      return true;
    } else {
      // let gizmoHit = false;
      // for (let controller of event.controllers) {
      //   const intersectionData = controller.getGeomItemAtTip();
      //   if (intersectionData != undefined && intersectionData.geomItem instanceof SceneWidget) {
      //     const gizmo = intersectionData.geomItem;
      //     if (this.__highlightedSceneWidget)
      //       this.__highlightedSceneWidget.unhiglight();

      //     this.__highlightedSceneWidget = gizmo;
      //     this.__highlightedSceneWidget.higlight();
      //     gizmoHit = true;
      //     break;
      //   }
      // }

      // if (!gizmoHit) {
      //   if (this.__highlightedSceneWidget) {
      //     this.__highlightedSceneWidget.unhiglight();
      //     this.__highlightedSceneWidget = undefined;
      //   }
      // }
    }
  }

  onVRControllerButtonUp(event) {
    if (this.activeSceneWidget) {
      this.activeSceneWidget.onDragEnd(event);
      this.activeSceneWidget = undefined;

      if (this.__highlightedSceneWidget && this.activeController == event.controller) {
        // Check if by releasing the button, we should immedietly
        // unhilight the gizmo. 
        // It is possible that the higlight is still on for a gizmo
        // we are interacting with, even though the controller is no longer touching
        // it.
        const intersectionData = event.controller.getGeomItemAtTip();
        if (!intersectionData != undefined || intersectionData.geomItem != this.__highlightedSceneWidget) {
          const gizmo = intersectionData.geomItem;
          if (this.__highlightedSceneWidget)
            this.__highlightedSceneWidget.unhiglight();
        }
      }
      return true;
    }

  }

};
