import BaseTool from './BaseTool.js';


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
      if (intersectionData != undefined && intersectionData.geomItem instanceof Gizmo) {
        const gizmo = intersectionData.geomItem;
        this.gizmoPlane = gizmo.getManipulationPlane();
        const mouseDownDist = intersectionData.mouseRay.intersectRayVector(this.gizmoPlane);
        if (mouseDownDist > 0) {
          const grabPos = intersectionData.mouseRay.dir.scale(mouseDownDist);
          this.activeGizmo = gizmo;
          this.activeGizmo.onDragStart(event, grabPos);
        }
      }
    }
  }

  onMouseMove(event, mousePos, viewport) {
    if (this.activeGizmo) {
      const mouseRay = viewport.calcRayFromScreenPos(mousePos);
      const dist = mouseRay.intersectRayVector(this.gizmoPlane)[0];
      const dragPos = mouseRay.dir.scale(dist);
      this.activeGizmo.onDragStart(event, dragPos);
    }
  }

  onMouseUp(event, mousePos, viewport) {
    if (this.activeGizmo) {
      const mouseRay = viewport.calcRayFromScreenPos(mousePos);
      const dist = mouseRay.intersectRayVector(this.gizmoPlane)[0];
      const releasePos = mouseRay.dir.scale(dist);
      this.activeGizmo.onDragEnd(event, releasePos);
      this.activeGizmo = undefined;
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
        const gizmoPlane = gizmo.getManipulationPlane();
        const mouseDownDist = event.controllerRay.intersectRayVector(gizmoPlane);
        if (mouseDownDist > 0) {
          const grabPos = event.controllerRay.dir.scale(mouseDownDist);
          this.activeController = event.controller;
          this.activeGizmo = gizmo;
          this.activeGizmo.onDragStart(event, grabPos);

          const id = event.controller.controllerMoved.connect((tipXfo) => {

          })
        }
      }
    }
  }

  onVRPoseChanged(event) {
    if (this.activeGizmo) {
      const xfo = this.activeController.getTiipXfo()
      this.activeGizmo.onDrag(event, xfo.tr);
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
      const xfo = this.activeController.getTiipXfo()
      this.activeGizmo.onDragEnd(event, xfo.tr);
      this.activeGizmo = undefined;
    } else if (this.__highlightedGizmo && this.activeController == event.controller) {
      const intersectionData = event.controller.getGeomItemAtTip();
      if (!intersectionData != undefined || intersectionData.geomItem != this.__highlightedGizmo) {
        const gizmo = intersectionData.geomItem;
        if (this.__highlightedGizmo)
          this.__highlightedGizmo.unhiglight();
      }
    }
  }

};
