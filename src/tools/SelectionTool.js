
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
  }

  onMouseMove(event, mousePos, viewport) {
    if (this.mouseDownPos) {
      this.dragging = true;

      // Start drawing the selection rectangle on screen.
    }
  }

  onMouseUp(event, mousePos, viewport) {

    viewport.renderGeomDataFbo();
    if (this.dragging) {
      // const mouseUpPos = mousePos;
      // const geomItems = viewport.getGeomItemsInRect(this.mouseDownPos, mouseUpPos);

      // if (!event.altKey) {
      //   this.appData.selectionManager.selectItems(geomItems, !event.ctrlKey);
      // } else {
      //   this.appData.selectionManager.deselectItems(geomItems);
      // }
    } else {
      const intersectionData = viewport.getGeomDataAtPos(mousePos);
      if (intersectionData != undefined) {
        this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem, !event.ctrlKey);
      }
    }

    this.mouseDownPos = undefined;
  }

};
