import {
  BaseLinearMovementSceneWidget
} from './BaseLinearMovementSceneWidget.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

class LinearMovementSceneWidget extends BaseLinearMovementSceneWidget {
  constructor(name, length, thickness, color) {
    super(name)

    this.__color = color;
    this.__hilightedColor = new Visualive.Color(1, 1, 1);
    this.colorParam = this.addParameter(new Visualive.ColorParameter('BaseColor', color));

    const handleMat = new Visualive.Material('handle', 'HandleShader');
    handleMat.replaceParameter(this.colorParam);
    const handleGeom = new Visualive.Cylinder(thickness, length, 64);
    handleGeom.getParameter('baseZAtZero').setValue(true)
    const tipGeom = new Visualive.Cone(thickness * 4, thickness * 10, 64, true);
    const handle = new Visualive.GeomItem('handle', handleGeom, handleMat);

    const tip = new Visualive.GeomItem('tip', tipGeom, handleMat);
    const tipXfo = new Visualive.Xfo()
    tipXfo.tr.set(0, 0, length)
    tipGeom.transformVertices(tipXfo);

    // this.radiusParam.valueChanged.connect(()=>{
    //   radius = this.radiusParam.getValue();
    //   handleGeom.getParameter('radius').setValue(radius);
    //   handleGeom.getParameter('height').setValue(radius * 0.02);
    // })

    this.addChild(handle);
    this.addChild(tip);
  };


  highlight() {
    this.colorParam.setValue(this.__hilightedColor)
  }

  unhighlight() {
    this.colorParam.setValue(this.__color)
  }

  setTargetParam(param, track = true) {
    this.__param = param;
    if (track) {
      const __updateGizmo = () => {
        this.setGlobalXfo(param.getValue())
      }
      __updateGizmo();
      param.valueChanged.connect(__updateGizmo)
    }
  }


  onDragStart(event) {
    this.change = new ParameterValueChange(this.__param);
    event.undoRedoManager.addChange(this.change);

    this.grabPos = event.grabPos;
    this.baseXfo = this.__param.getValue();

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
      newXfo: newXfo
    });
  }

  onDragEnd(event) {
    this.change = null;

    this.manipulateEnd.emit({
      releasePos: event.releasePos,
      manipRay: this.manipRay
    });
  }

};

export {
  LinearMovementSceneWidget
}