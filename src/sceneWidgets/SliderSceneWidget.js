import LinearMovementSceneWidget  from './LinearMovementSceneWidget.js';

import ParameterValueChange from '../undoredo/ParameterValueChange.js';

export default class SliderSceneWidget extends LinearMovementSceneWidget {
  constructor(name, length, radius, color, undoRedoManager) {
    super(name)

    this.__length = length;
    this.__undoRedoManager = undoRedoManager;

    const handleMat = new Visualive.Material('handle', 'FlatSurfaceShader');
    const baseBarMat = new Visualive.Material('baseBar', 'FlatSurfaceShader');
    const topBarMat = new Visualive.Material('topBar', 'FlatSurfaceShader');
    handleMat.getParameter('BaseColor').setValue(color);
    baseBarMat.getParameter('BaseColor').setValue(color);
    topBarMat.getParameter('BaseColor').setValue(new Visualive.Color(0.5, 0.5, 0.5));
    
    const barGeom = new Visualive.Cylinder(radius * 0.25, 1, 64, 2, true, true);

    this.handle = new Visualive.GeomItem('handle', new Visualive.Sphere(radius, 64), handleMat);
    this.baseBar = new Visualive.GeomItem('baseBar', barGeom, handleMat);
    this.topBar = new Visualive.GeomItem('topBar', barGeom, topBarMat);
    this.handleXfo = new Visualive.Xfo()
    this.baseBarXfo = new Visualive.Xfo()
    this.topBarXfo = new Visualive.Xfo()

    this.addChild(this.handle);
    this.addChild(this.baseBar);
    this.addChild(this.topBar);

    this.__updateSlider(0);
  };

  setTargetParam(param) {
    this.__param = param;
    const range = param.getRange() ? param.getRange() : [0, 1];
    const step = param.getStep();
    const __updateSlider = ()=>{
      this.__updateSlider(Math.remap(param.getValue(), range[0], range[1], 0, 1));
    }
    __updateSlider();
    param.valueChanged.connect(__updateSlider)
  }

  __updateSlider(value) {
    this.baseBarXfo.sc.z = value * this.__length;
    this.handleXfo.tr.z = value * this.__length;
    this.topBarXfo.tr.z = value * this.__length;
    this.topBarXfo.sc.z = (1 - (value)) * this.__length;
    this.handle.setLocalXfo(this.handleXfo)
    this.baseBar.setLocalXfo(this.baseBarXfo)
    this.topBar.setLocalXfo(this.topBarXfo)
  }

  /////////////////////////////////////
  // Interaction events

  onDragStart(event) {
    this.change = new ParameterValueChange(this.__param);
    this.__undoRedoManager.addChange(this.change);

    // Hilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.5;
    this.handle.setLocalXfo(this.handleXfo)
  }

  onDrag(event) {
    const range = this.__param.getRange() ? this.__param.getRange() : [0, 1];
    const value = Math.remap(event.value, 0, this.__length, range[0], range[1]);
    this.change.update({ value });
  }

  onDragEnd(event) {
    this.change = null;
    // /unhilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.0;
    this.handle.setLocalXfo(this.handleXfo)
  }
};
