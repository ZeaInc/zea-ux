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
  }

  fromJSON(j, root) {
    super.fromJSON(j, root);
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
  constructor(undoRedoManager) {
    super(undoRedoManager);

    this.cp = this.addParameter(new Visualive.ColorParameter('Line Color', new Visualive.Color(.7, .2, .2)));
    this.tp = this.addParameter(new Visualive.NumberParameter('Line Thickness', 0.01, [0, 0.1])); // 1cm.
  }

  activateTool(renderer) {

    renderer.getDiv().style.cursor = "crosshair";

    renderer.vrViewportSetup.connect((vrviewport)=>{
      if(!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Visualive.Sphere(this.tp.getValue(), 64);
        this.vrControllerToolTipMat = new Visualive.Material('marker', 'FlatSurfaceShader');
        this.vrControllerToolTipMat.getParameter('BaseColor').setValue(this.cp.getValue());
      }
      const addIconToController = (id, controller) => {
        const geomItem = new Visualive.GeomItem('VRControllerTip', this.vrControllerToolTip, this.vrControllerToolTipMat);
        controller.getTip().addChild(geomItem);
      }
      for(let controller of vrviewport.getControllers()) {
        addIconToController(controller)
      }
      this.addIconToControllerId = vrviewport.controllerAdded.connect(addIconToController);
    });

  }

  deactivateTool(renderer) {

    renderer.getDiv().style.cursor = "pointer";

    const vrviewport = renderer.getVRViewport();
    if (vrviewport) {
      for(let controller of vrviewport.getControllers()) {
        controller.getTip().removeAllChildren();
      }
      vrviewport.controllerAdded.disconnectId(this.addIconToControllerId);
    }
  }

  createStart(xfo, parentItem) {
    const change = new CreateLineChange(parentItem, xfo);
    this.undoRedoManager.addChange(change);
    
    this.xfo = xfo.inverse();
    this.stage = 1;
    this.length = 0.0;
  }

  createMove(pt) {
    const offet = this.xfo.transformVec3(pt)
    this.length = offet.length();
    this.undoRedoManager.updateChange({ p1: offet });
  }

  createRelease(pt) {
    if (this.length == 0) {
      this.undoRedoManager.undo(false);
    }
    this.stage = 0;
  }
}
