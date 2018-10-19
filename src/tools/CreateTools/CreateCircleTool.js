import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateCircleChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Circle", parentItem);

    this.circle = new Visualive.Circle(0, 64);
    this.circle.lineThickness = 0.05;
    // const material = new Visualive.Material('circle', 'LinesShader');
    const material = new Visualive.Material('circle', 'FatLinesShader');
    material.getParameter('Color').setValue(new Visualive.Color(.7, .2, .2));
    this.geomItem = new Visualive.GeomItem('Circle');
    this.geomItem.setGeometry(this.circle);
    this.geomItem.setMaterial(material);

    if(parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    this.circle.getParameter("Radius").setValue(updateData.radius);
  }

  toJSON() {
    const j = super.toJSON();
    j.radius = this.circle.getParameter("Radius").getValue();
    return j;
  }

  changeFromJSON(j) {
    console.log("CreateCircleChange:", j)
    if (j.radius)
      this.circle.getParameter("Radius").setValue(j.radius);
  }
}

export default class CreateCircleTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);
  }

  createStart(xfo, parentItem) {
    const change = new CreateCircleChange(parentItem, xfo);
    this.undoRedoManager.addChange(change);

    this.xfo = xfo;
    this.stage = 1;
    this.radius = 0.0;
  }

  createMove(pt) {
    this.radius = pt.distanceTo(this.xfo.tr);
    this.undoRedoManager.updateChange({ radius: this.radius });
  }

  createRelease(pt) {
    if (this.radius == 0) {
      this.undoRedoManager.undo(false);
    }
    this.stage = 0;
  }
}

