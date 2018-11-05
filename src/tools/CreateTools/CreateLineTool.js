import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateLineChange extends CreateGeomChange {
  constructor(parentItem, xfo, color, thickness) {
    super("Create Line");

    this.line = new Visualive.Lines(0.0);
    this.line.setNumVertices(2)
    this.line.setNumSegments(1);
    this.line.setSegment(0, 0, 1);
    const material = new Visualive.Material('Line', 'LinesShader');
    material.getParameter('Color').setValue(new Visualive.Color(.7, .2, .2));
    this.geomItem = new Visualive.GeomItem("Line");
    this.geomItem.setGeometry(this.line);
    this.geomItem.setMaterial(material);

    if (color) {
      material.getParameter('Color').setValue(color);
    }

    if (thickness) {
      this.line.lineThickness = thickness;
      // this.line.addVertexAttribute('lineThickness', Visualive.Float32, 0.0);
    }

    if(parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    if(updateData.p1) {
      this.line.getVertex(1).setFromOther(updateData.p1)
      this.line.geomDataChanged.emit();
    }
    this.updated.emit(updateData);
  }

  fromJSON(j, appData) {
    super.fromJSON(j, appData);
    if (j.color) {
      const color = new Visualive.Color();
      color.fromJSON(j.color);
      material.getParameter('Color').setValue(color);
    }

    if (j.thickness) {
      this.line.lineThickness = j.thickness;
      // this.line.addVertexAttribute('lineThickness', Visualive.Float32, 0.0);
    }
  }

}
UndoRedoManager.registerChange('CreateLineChange', CreateLineChange)

export default class CreateLineTool extends CreateGeomTool {
  constructor(appData) {
    super(appData);

    this.cp = this.addParameter(new Visualive.ColorParameter('Line Color', new Visualive.Color(.7, .2, .2)));
    this.tp = this.addParameter(new Visualive.NumberParameter('Line Thickness', 0.06, [0, 0.1])); // 1cm.
  }

  activateTool() {
    super.activateTool();

    this.appData.renderer.getDiv().style.cursor = "crosshair";

    if(this.__id == undefined) {
      this.__id = this.appData.renderer.vrViewportSetup.connect((vrviewport)=>{
        if(!this.vrControllerToolTip) {
          this.vrControllerToolTip = new Visualive.Sphere(this.tp.getValue(), 64);
          this.vrControllerToolTipMat = new Visualive.Material('marker', 'FlatSurfaceShader');
          this.vrControllerToolTipMat.getParameter('BaseColor').setValue(this.cp.getValue());
        }
        const addIconToController = (controller) => {
          // The tool might already be deactivated.
          if(!this.__activated)
            return;
          const geomItem = new Visualive.GeomItem('VRControllerTip', this.vrControllerToolTip, this.vrControllerToolTipMat);
          controller.getTip().addChild(geomItem, false);
        }
        for(let controller of vrviewport.getControllers()) {
          addIconToController(controller)
        }
        this.addIconToControllerId = vrviewport.controllerAdded.connect(addIconToController);
      });
    }

  }

  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getDiv().style.cursor = "pointer";

    if(this.__id != undefined) {
      const vrviewport = this.appData.renderer.getVRViewport();
      if (vrviewport) {
        for(let controller of vrviewport.getControllers()) {
          controller.getTip().removeAllChildren();
        }
      }
    }
  }

  createStart(xfo, parentItem) {
    this.change = new CreateLineChange(parentItem, xfo);
    this.appData.undoRedoManager.addChange(this.change);
    
    this.xfo = xfo.inverse();
    this.stage = 1;
    this.length = 0.0;
  }

  createMove(pt) {
    const offet = this.xfo.transformVec3(pt)
    this.length = offet.length();
    this.change.update({ p1: offet });
  }

  createRelease(pt) {
    if (this.length == 0) {
      this.appData.undoRedoManager.undo(false);
    }
    this.stage = 0;
  }
}
