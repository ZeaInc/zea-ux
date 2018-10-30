import UndoRedoManager from '../undoredo/UndoRedoManager.js';
import  BaseTool from './BaseTool.js';
import Gizmo from '../gizmos/Gizmo.js';

export default class SelectionTool extends BaseTool {
  constructor(appData) {
    super(appData);

    this.dragging = false;


    this.selectionRect = new Visualive.Rect(1,1);
    this.selectionRectMat = new Visualive.Material('marker', 'ScreenSpaceShader');
    this.selectionRectMat.getParameter('BaseColor').setValue(new Visualive.Color("#03E3AC"));
    this.selectionRectXfo = new Visualive.Xfo();
    this.selectionRectXfo.tr.set(0.5,0.5,0)
    this.selectionRectXfo.sc.set(0,0,0)
  }

  activateTool() {
    super.activateTool();

    if(!this.rectItem) {
      this.rectItem = new Visualive.GeomItem('selectionRect', this.selectionRect, this.selectionRectMat);
      this.rectItem.getParameter('Visible').setValue(false);
      this.appData.renderer.getCollector().addTreeItem(this.rectItem);
    }

  }

  deactivateTool() {
    super.deactivateTool();
    this.selectionRectXfo.sc.set(0,0,0)
    this.rectItem.setGlobalXfo(this.selectionRectXfo)
  }


  onMouseDown(event, mousePos, viewport) {
    if(event.button == 0) {
      console.log("onMouseDown")
      this.mouseDownPos = mousePos;
      this.dragging = false;
      return true;
    }
  }

  __resizeRect(viewport, delta) {
    const sc = new Visualive.Vec2(1/viewport.getWidth() * 2, 1/viewport.getHeight() * 2);
    const size = delta.multiply(sc);
    this.selectionRectXfo.sc.set(Math.abs(size.x), Math.abs(size.y), 1)

    const center = this.mouseDownPos.subtract(delta.scale(0.5))
    const tr = center.multiply(sc).subtract(new Visualive.Vec2(1, 1));
    
    this.selectionRectXfo.tr.x = tr.x;
    this.selectionRectXfo.tr.y = -tr.y;
    this.rectItem.setGlobalXfo(this.selectionRectXfo)
  }

  onMouseMove(event, mousePos, viewport) {
    if (this.mouseDownPos) {
      const delta = this.mouseDownPos.subtract(mousePos);
      if(this.dragging) {
        this.__resizeRect(viewport, delta);
      }
      const dist = delta.length();
      // dragging only is activated after 4 pixels. 
      // This is to avoid causing as rect selection for nothing.
      if(dist > 4){
        this.dragging = true;
        // Start drawing the selection rectangle on screen.
        this.rectItem.getParameter('Visible').setValue(true);
        this.__resizeRect(viewport, delta);
      }

    }
    return true;
  }

  onMouseUp(event, mousePos, viewport) {

    if (this.mouseDownPos) {
      viewport.renderGeomDataFbo();
      if (this.dragging) {
        this.rectItem.getParameter('Visible').setValue(false);
        const mouseUpPos = mousePos;
        const tl = new Visualive.Vec2(Math.min(this.mouseDownPos.x, mouseUpPos.x), Math.min(this.mouseDownPos.y, mouseUpPos.y))
        const br = new Visualive.Vec2(Math.max(this.mouseDownPos.x, mouseUpPos.x), Math.max(this.mouseDownPos.y, mouseUpPos.y))
        const geomItems = viewport.getGeomItemsInRect(tl, br);

        if (!event.shiftKey) {
          this.appData.selectionManager.selectItems(geomItems, !event.ctrlKey);
        } else {
          this.appData.selectionManager.deselectItems(geomItems);
        }
        
        this.selectionRectXfo.sc.set(0,0,0)
        this.rectItem.setGlobalXfo(this.selectionRectXfo)
      } else {
        const intersectionData = viewport.getGeomDataAtPos(mousePos);
        if (intersectionData != undefined) {
          if (!event.shiftKey) {
            this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem, !event.ctrlKey);
          } else {
            const items = new Set();
            items.add(intersectionData.geomItem)
            this.appData.selectionManager.deselectItems(items);
          }
        }
        else {
          this.appData.selectionManager.clearSelection();
        }
      }

      this.mouseDownPos = undefined;
      return true;
    }
  }

  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {
    if (event.button == 1) {
      const intersectionData = event.controller.getGeomItemAtTip();
      if (intersectionData != undefined && !(intersectionData.geomItem instanceof Gizmo)) {
        this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem);
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
  //       if (intersectionData != undefined && !(intersectionData.geomItem instanceof Gizmo)) {
  //         this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem);
  //         return true;
  //       }
  //     }
  //   }
  // }
};



UndoRedoManager.registerChange('SelectionTool', SelectionTool)