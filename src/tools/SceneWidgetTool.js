import BaseTool from './BaseTool.js';
import SceneWidget from '../sceneWidgets/SceneWidget.js';

/**
 * Class representing a scene widget tool.
 * @extends BaseTool
 */
class SceneWidgetTool extends BaseTool {
  /**
   * Create a scene widget tool
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.activeHandle = undefined;
  }

  activateTool() {
    super.activateTool();
    console.log('activateTool.SceneWidgetTool');

    this.appData.renderer.getDiv().style.cursor = 'crosshair';

    const addIconToController = controller => {
      // The tool might already be deactivated.
      if (!this.__activated) return;
      const geon = new Visualive.Sphere(0.02 * 0.75);
      const mat = new Visualive.Material('Cross', 'FlatSurfaceShader');
      mat.getParameter('BaseColor').setValue(new Visualive.Color('#03E3AC'));
      mat.visibleInGeomDataBuffer = false;
      const geomItem = new Visualive.GeomItem('SceneWidgetToolTip', geon, mat);
      controller.getTipItem().removeAllChildren();
      controller.getTipItem().addChild(geomItem, false);
    };
    const addIconToControllers = xrvp => {
      for (let controller of xrvp.getControllers()) {
        addIconToController(controller);
      }
      this.addIconToControllerId = xrvp.controllerAdded.connect(
        addIconToController
      );
    };

    this.appData.renderer.getXRViewport().then(xrvp => {
      addIconToControllers(xrvp);
    });
  }

  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getXRViewport().then(xrvp => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.controllerAdded.disconnectId(this.addIconToControllerId);
    });
  }

  /////////////////////////////////////
  // Mouse events

  onMouseDown(event) {
    //
    if (!this.activeHandle) {
      // event.viewport.renderGeomDataFbo();
      const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos);
      if (intersectionData == undefined) return;
      if (intersectionData.geomItem.getOwner() instanceof SceneWidget) {
        this.activeHandle = intersectionData.geomItem.getOwner();
        this.activeHandle.handleMouseDown(
          Object.assign(event, { intersectionData })
        );
        return true;
      }
    }
  }

  onMouseMove(event) {
    if (this.activeHandle) {
      this.activeHandle.handleMouseMove(event);
      return true;
    } else {
      // If the buttons are pressed, we know we are not searching
      // for a handle to drag. (Probably anothet tool in the stack is doing something)
      if (event.button == 0 && event.buttons == 1) return false;

      const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos);
      if (
        intersectionData != undefined &&
        intersectionData.geomItem.getOwner() instanceof SceneWidget
      ) {
        const handle = intersectionData.geomItem.getOwner();
        if (this.__highlightedHandle) this.__highlightedHandle.unhighlight();

        this.__highlightedHandle = handle;
        this.__highlightedHandle.highlight();
        return true;
      } else if (this.__highlightedHandle)
        this.__highlightedHandle.unhighlight();
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
      if (intersectionData == undefined) return;
      if (intersectionData.geomItem.getOwner() instanceof SceneWidget) {
        const handle = intersectionData.geomItem.getOwner();
        this.activeHandle = handle;
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
      let handleHit = false;
      for (let controller of event.controllers) {
        const intersectionData = controller.getGeomItemAtTip();
        if (
          intersectionData != undefined &&
          intersectionData.geomItem.getOwner() instanceof SceneWidget
        ) {
          const handle = intersectionData.geomItem.getOwner();

          if (this.__highlightedHandle) this.__highlightedHandle.unhighlight();

          this.__highlightedHandle = handle;
          this.__highlightedHandle.highlight();
          handleHit = true;
          break;
        }
      }

      if (!handleHit) {
        if (this.__highlightedHandle) {
          this.__highlightedHandle.unhighlight();
          this.__highlightedHandle = undefined;
        }
      }
    }
  }

  onVRControllerButtonUp(event) {
    if (this.activeHandle) {
      this.activeHandle.onDragEnd(event);
      this.activeHandle = undefined;

      if (
        this.__highlightedHandle &&
        this.activeController == event.controller
      ) {
        // Check if by releasing the button, we should immedietly
        // unhilight the handle.
        // It is possible that the highlight is still on for a handle
        // we are interacting with, even though the controller is no longer touching
        // it.
        const intersectionData = event.controller.getGeomItemAtTip();
        if (
          !intersectionData != undefined ||
          intersectionData.geomItem.getOwner() != this.__highlightedHandle
        ) {
          const handle = intersectionData.geomItem.getOwner();
          if (this.__highlightedHandle) this.__highlightedHandle.unhighlight();
        }
      }
      return true;
    }
  }
}

export { SceneWidgetTool };
