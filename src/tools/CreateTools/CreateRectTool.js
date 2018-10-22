import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateRectChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Rect");

    this.rect = new Visualive.Rect(0, 0);
    this.rect.lineThickness = 0.05;
    // const material = new Visualive.Material('rect', 'LinesShader');
    const material = new Visualive.Material('circle', 'FatLinesShader');
    material.getParameter('Color').setValue(new Visualive.Color(.7, .2, .2));
    this.geomItem = new Visualive.GeomItem("Rect");
    this.geomItem.setGeometry(this.rect);
    this.geomItem.setMaterial(material);

    if(parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    if(updateData.baseSize){
      this.rect.setSize(updateData.baseSize[0], updateData.baseSize[1]);
    }
    if(updateData.tr){
      const xfo = this.geomItem.getParameter('LocalXfo').getValue();
      xfo.tr.fromJSON(updateData.tr);
      this.geomItem.getParameter('LocalXfo').setValue(xfo);
    }
  }
}
UndoRedoManager.registerChange(CreateRectChange)


export default class CreateRectTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);
    console.log("Create Rect");
  }

  createStart(xfo, parentItem) {

    const change = new CreateRectChange(parentItem, xfo);
    this.undoRedoManager.addChange(change);

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this._size = 0.0;
  }

  createMove(pt) {
    if(this.stage == 1) {
      const delta = this.invxfo.transformVec3(pt);

      this._size = Math.abs(delta.x), Math.abs(delta.y);

      // const delta = pt.subtract(this.xfo.tr)
      this.undoRedoManager.updateChange({ 
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5))
        });
    }
    else {
      const vec = this.invxfo.transformVec3(pt);
      this.undoRedoManager.updateChange({ height: vec.y });
    }
  }

  createRelease(pt, viewport) {
    if (this._size == 0) {
      this.undoRedoManager.undo(false);
    }
    this.stage = 0;
  }

}

