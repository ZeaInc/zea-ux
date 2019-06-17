import SceneWidget  from './SceneWidget.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

class PlanarMovementSceneWidget extends SceneWidget {
  constructor(name, size, color) {
    super(name);

    this.__color = color;
    this.sizeParam = this.addParameter(new Visualive.NumberParameter('size', size));
    this.colorParam = this.addParameter(new Visualive.ColorParameter('BaseColor', color));

    const handleMat = new Visualive.Material('handle', 'FlatSurfaceShader');
    handleMat.replaceParameter(this.colorParam);

    const handleGeom = new Visualive.Cuboid(size, size, size * 0.02);
    this.handle = new Visualive.GeomItem('handle', handleGeom, handleMat);
    this.handleXfo = new Visualive.Xfo()

    this.sizeParam.valueChanged.connect(()=>{
      size = this.sizeParam.getValue();
      handleGeom.getParameter('size').setValue(size);
      handleGeom.getParameter('height').setValue(size * 0.02);
    })

    this.addChild(this.handle);
  }

  setTargetParam(param) {
    this.__param = param;
    const __updateGizmo = () => {
      this.setGlobalXfo(param.getValue())
    }
    __updateGizmo();
    param.valueChanged.connect(__updateGizmo)
  }

  onDragStart(event) {
    this.grabPos = event.grabPos;
    this.change = new ParameterValueChange(this.__param);

    event.undoRedoManager.addChange(this.change);

    this.baseXfo = this.getGlobalXfo();

    // Hilight the material.
    this.colorParam.setValue(new Visualive.Color(1,1,1));

    this.manipulateBegin.emit({
      grabPos: event.grabPos,
      manipRay: this.manipRay
    });
  }

  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone();
    newXfo.tr.addInPlace(dragVec);

    this.change.update({
      value: newXfo
    });

    this.manipulate.emit({
      holdPos: event.holdPos,
      manipRay: this.gizmoRay,
      deltaXfo: this.deltaXfo, 
      newXfo
    });
  }

  onDragEnd(event) {
    this.manipulateEnd.emit({
      releasePos: event.releasePos,
      manipRay: this.manipRay
    });
  }

}
export {
  PlanarMovementSceneWidget
}