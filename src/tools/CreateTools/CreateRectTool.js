import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import { CreateGeomChange, CreateGeomTool } from './CreateGeomTool.js';

/**
 * Class representing a create rect change.
 * @extends CreateGeomChange
 */
class CreateRectChange extends CreateGeomChange {
  /**
   * Create a create rect change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Rect');

    this.rect = new Visualive.Rect(0, 0);
    this.rect.lineThickness = 0.05;
    // const material = new Visualive.Material('rect', 'LinesShader');
    const material = new Visualive.Material('circle', 'FatLinesShader');
    material.getParameter('Color').setValue(new Visualive.Color(0.7, 0.2, 0.2));
    this.geomItem = new Visualive.GeomItem('Rect');
    this.geomItem.setGeometry(this.rect);
    this.geomItem.setMaterial(material);

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.baseSize) {
      this.rect.setSize(updateData.baseSize[0], updateData.baseSize[1]);
    }
    if (updateData.tr) {
      const xfo = this.geomItem.getParameter('LocalXfo').getValue();
      xfo.tr.fromJSON(updateData.tr);
      this.geomItem.getParameter('LocalXfo').setValue(xfo);
    }

    this.updated.emit(updateData);
  }
}
UndoRedoManager.registerChange('CreateRectChange', CreateRectChange);

/**
 * Class representing a create rect tool.
 * @extends CreateGeomTool
 */
class CreateRectTool extends CreateGeomTool {
  /**
   * Create a create rect tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateRectChange(parentItem, xfo);
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this._size = 0.0;
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    if (this.stage == 1) {
      const delta = this.invxfo.transformVec3(pt);

      (this._size = Math.abs(delta.x)), Math.abs(delta.y);

      // const delta = pt.subtract(this.xfo.tr)
      this.change.update({
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5)),
      });
    } else {
      const vec = this.invxfo.transformVec3(pt);
      this.change.update({ height: vec.y });
    }
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   * @param {any} viewport - The viewport param.
   */
  createRelease(pt, viewport) {
    if (this._size == 0) {
      this.appData.undoRedoManager.undo(false);
    }
    this.stage = 0;
    this.actionFinished.emit();
  }
}

export { CreateRectTool };
