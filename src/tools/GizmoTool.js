import BaseTool from './BaseTool.js';
import Gizmo from '../gizmos/Gizmo.js';


export default class GizmoTool extends BaseTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);

    this.activeGizmo = undefined;
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
        // const gizmo = intersectionData.geomItem.getOwner() ;
        // this.gizmoPlane = gizmo.getManipulationPlane();
        // const mouseDownDist = intersectionData.mouseRay.intersectRayVector(this.gizmoPlane);
        // if (mouseDownDist > 0) {
        //   const grabPos = intersectionData.mouseRay.dir.scale(mouseDownDist);
        //   this.activeGizmo = gizmo;
        //   this.activeGizmo.onDragStart(event, grabPos);
        //   return true;
        // }


        this.activeGizmo = intersectionData.geomItem.getOwner();
        this.activeGizmo.handleMouseDown(Object.assign(event, {intersectionData, mouseRay:intersectionData.mouseRay}), mousePos);
        return true;
      }
    }
  }

  onMouseMove(event, mousePos, viewport) {
    if (this.activeGizmo) {
      // const mouseRay = viewport.calcRayFromScreenPos(mousePos);
      // const dist = mouseRay.intersectRayVector(this.gizmoPlane)[0];
      // const dragPos = mouseRay.dir.scale(dist);
      // this.activeGizmo.onDragStart(event, dragPos);
      this.activeGizmo.handleMouseMove(event, mousePos, viewport);
      return true;
    }
  }

  onMouseUp(event, mousePos, viewport) {
    if (this.activeGizmo) {
      // const mouseRay = viewport.calcRayFromScreenPos(mousePos);
      // const dist = mouseRay.intersectRayVector(this.gizmoPlane)[0];
      // const releasePos = mouseRay.dir.scale(dist);
      // this.activeGizmo.onDragEnd(event, releasePos);
      // this.activeGizmo = undefined;
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
      if (intersectionData != undefined && intersectionData.geomItem instanceof Gizmo) {
        const gizmo = intersectionData.geomItem;
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
      let gizmoHit = false;
      for (let controller of event.controllers) {
        const intersectionData = event.controller.getGeomItemAtTip();
        if (intersectionData != undefined && intersectionData.geomItem instanceof Gizmo) {
          const gizmo = intersectionData.geomItem;
          if (this.__highlightedGizmo)
            this.__highlightedGizmo.unhiglight();

          this.__highlightedGizmo = gizmo;
          this.__highlightedGizmo.higlight();
          gizmoHit = true;
          break;
        }
      }

      if (!gizmoHit) {
        if (this.__highlightedGizmo) {
          this.__highlightedGizmo.unhiglight();
          this.__highlightedGizmo = undefined;
        }
      }
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
