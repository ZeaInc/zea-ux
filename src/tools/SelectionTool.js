import UndoRedoManager from '../undoredo/UndoRedoManager.js';
import  BaseTool from './BaseTool.js';

export default class SelectionTool extends BaseTool {
  constructor(appData) {
    super();

    this.appData = appData;
    this.dragging = false;
  }

  activateTool(viewport) {}
  deactivateTool(viewport) {}


  onMouseDown(event, mousePos, viewport) {
    this.mouseDownPos = mousePos;
    this.dragging = false;
    return true;
  }

  onMouseMove(event, mousePos, viewport) {
    if (this.mouseDownPos) {
      const dist = this.mouseDownPos.distanceTo(mousePos);
      // dragging only is activated after 4 pixels. 
      // This is to avoid causing as rect selection for nothing.
      if(dist > 4){
        this.dragging = true;
        // Start drawing the selection rectangle on screen.
      }

    }
    return true;
  }

  onMouseUp(event, mousePos, viewport) {

    viewport.renderGeomDataFbo();
    if (this.dragging) {
      const mouseUpPos = mousePos;
      const tl = new Visualive.Vec2(Math.min(this.mouseDownPos.x, mouseUpPos.x), Math.min(this.mouseDownPos.y, mouseUpPos.y))
      const br = new Visualive.Vec2(Math.max(this.mouseDownPos.x, mouseUpPos.x), Math.max(this.mouseDownPos.y, mouseUpPos.y))
      const geomItems = viewport.getGeomItemsInRect(tl, br);

      if (!event.altKey) {
        this.appData.selectionManager.selectItems(geomItems, !event.ctrlKey);
      } else {
        this.appData.selectionManager.deselectItems(geomItems);
      }
    } else {
      const intersectionData = viewport.getGeomDataAtPos(mousePos);
      if (intersectionData != undefined) {
        this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem, !event.ctrlKey);
      }
      else {
        this.appData.selectionManager.clearSelection();
      }
    }

    this.mouseDownPos = undefined;
    return true;
  }

};



UndoRedoManager.registerChange(SelectionTool)