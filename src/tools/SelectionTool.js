import UndoRedoManager from '../undoredo/UndoRedoManager.js';
import BaseTool from './BaseTool.js';
import SceneWidget from '../sceneWidgets/SceneWidget.js';

/**
 * Class representing a selection tool.
 * @extends BaseTool
 */
class SelectionTool extends BaseTool {
  /**
   * Create a selection tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);

    this.dragging = false;

    this.selectionRect = new Visualive.Rect(1, 1);
    this.selectionRectMat = new Visualive.Material(
      'marker',
      'ScreenSpaceShader'
    );
    this.selectionRectMat
      .getParameter('BaseColor')
      .setValue(new Visualive.Color('#03E3AC'));
    this.selectionRectXfo = new Visualive.Xfo();
    this.selectionRectXfo.tr.set(0.5, 0.5, 0);
    this.selectionRectXfo.sc.set(0, 0, 0);
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();

    if (!this.rectItem) {
      this.rectItem = new Visualive.GeomItem(
        'selectionRect',
        this.selectionRect,
        this.selectionRectMat
      );
      this.rectItem.getParameter('Visible').setValue(false);
      this.appData.renderer.addTreeItem(this.rectItem);
    }
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();
    this.selectionRectXfo.sc.set(0, 0, 0);
    this.rectItem.setGlobalXfo(this.selectionRectXfo);
  }

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    if (event.button == 0) {
      console.log('onMouseDown');
      this.mouseDownPos = event.mousePos;
      this.dragging = false;
      return true;
    }
  }

  __resizeRect(viewport, delta) {
    const sc = new Visualive.Vec2(
      (1 / viewport.getWidth()) * 2,
      (1 / viewport.getHeight()) * 2
    );
    const size = delta.multiply(sc);
    this.selectionRectXfo.sc.set(Math.abs(size.x), Math.abs(size.y), 1);

    const center = this.mouseDownPos.subtract(delta.scale(0.5));
    const tr = center.multiply(sc).subtract(new Visualive.Vec2(1, 1));

    this.selectionRectXfo.tr.x = tr.x;
    this.selectionRectXfo.tr.y = -tr.y;
    this.rectItem.setGlobalXfo(this.selectionRectXfo);
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.mouseDownPos) {
      const delta = this.mouseDownPos.subtract(event.mousePos);
      if (this.dragging) {
        this.__resizeRect(event.viewport, delta);
      }
      const dist = delta.length();
      // dragging only is activated after 4 pixels.
      // This is to avoid causing as rect selection for nothing.
      if (dist > 4) {
        this.dragging = true;
        // Start drawing the selection rectangle on screen.
        this.rectItem.getParameter('Visible').setValue(true);
        this.__resizeRect(event.viewport, delta);
      }
    }
    return true;
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseUp(event) {
    if (this.mouseDownPos) {
      // event.viewport.renderGeomDataFbo();
      if (this.dragging) {
        this.rectItem.getParameter('Visible').setValue(false);
        const mouseUpPos = event.mousePos;
        const tl = new Visualive.Vec2(
          Math.min(this.mouseDownPos.x, mouseUpPos.x),
          Math.min(this.mouseDownPos.y, mouseUpPos.y)
        );
        const br = new Visualive.Vec2(
          Math.max(this.mouseDownPos.x, mouseUpPos.x),
          Math.max(this.mouseDownPos.y, mouseUpPos.y)
        );
        const geomItems = event.viewport.getGeomItemsInRect(tl, br);

        console.log(geomItems);
        if (this.appData.selectionManager.pickingModeActive()) {
          this.appData.selectionManager.pick(geomItems);
        } else {
          // Remove all the scene widgets. (UI elements should not be selectable.)
          const regularGeomItems = new Set(
            [...geomItems].filter(x => !(x.getOwner() instanceof SceneWidget))
          );

          if (!event.shiftKey) {
            this.appData.selectionManager.selectItems(
              regularGeomItems,
              !event.ctrlKey
            );
          } else {
            this.appData.selectionManager.deselectItems(regularGeomItems);
          }

          this.selectionRectXfo.sc.set(0, 0, 0);
          this.rectItem.setGlobalXfo(this.selectionRectXfo);
        }
      } else {
        const intersectionData = event.viewport.getGeomDataAtPos(
          event.mousePos
        );
        if (
          intersectionData != undefined &&
          !(intersectionData.geomItem.getOwner() instanceof SceneWidget)
        ) {
          if (this.appData.selectionManager.pickingModeActive()) {
            this.appData.selectionManager.pick(intersectionData.geomItem);
          } else {
            if (!event.shiftKey) {
              this.appData.selectionManager.toggleItemSelection(
                intersectionData.geomItem,
                !event.ctrlKey
              );
            } else {
              const items = new Set();
              items.add(intersectionData.geomItem);
              this.appData.selectionManager.deselectItems(items);
            }
          }
        } else {
          this.appData.selectionManager.clearSelection();
        }
      }

      this.mouseDownPos = undefined;
      return true;
    }
  }

  /////////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (event.button == 1) {
      const intersectionData = event.controller.getGeomItemAtTip();
      if (
        intersectionData != undefined &&
        !(intersectionData.geomItem.getOwner() instanceof SceneWidget)
      ) {
        this.appData.selectionManager.toggleItemSelection(
          intersectionData.geomItem
        );
        return true;
      }
    }
  }

  // onVRPoseChanged(event) {
  // }

  // onVRControllerButtonUp(event) {

  //   if (event.button == 1 && this.activeController == event.controller) {
  //     const controllerUpPos = event.controller.getTipXfo();
  //     if(this.controllerDownPos.distanceTo(controllerUpPos) < 0.1) {
  //       const intersectionData = event.controller.getGeomItemAtTip();
  //       if (intersectionData != undefined && !(intersectionData.geomItem instanceof SceneWidget)) {
  //         this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem);
  //         return true;
  //       }
  //     }
  //   }
  // }
}

UndoRedoManager.registerChange('SelectionTool', SelectionTool);

export { SelectionTool };
