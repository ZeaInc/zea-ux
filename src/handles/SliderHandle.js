import Handle  from './Handle.js';

import ParameterValueChange from '../undoredo/ParameterValueChange.js';

export default class SliderHandle extends LinearMovementHandle {
  constructor(name, length, color, undoRedoManager) {
    super(name)

    this.__length = length;
    this.__undoRedoManager = undoRedoManager;

    const handleMat = new Visualive.Material('handle', 'FlatSurfaceShader');
    const baseBarMat = new Visualive.Material('baseBar', 'FlatSurfaceShader');
    const topBarMat = new Visualive.Material('topBar', 'FlatSurfaceShader');
    handleMat.getParameter('BaseColor').setValue(color);
    baseBarMat.getParameter('BaseColor').setValue(color);
    topBarMat.getParameter('BaseColor').setValue(new Visualive.Color(0.8, 0.8, 0.8));
    
    const barGeom = new Visualive.Cylinder(0.02, 1, 64, 2, true, true);

    this.handle = new Visualive.GeomItem('sphere', new Visualive.Sphere(0.05, 64), handleMat);
    this.baseBar = new Visualive.GeomItem('topBar', barGeom, handleMat);
    this.topBar = new Visualive.GeomItem('topBar', barGeom, handleMat);
    this.handleXfo = new Visualive.Xfo()
    this.baseBarXfo = new Visualive.Xfo()
    this.topBarXfo = new Visualive.Xfo()

    this.addChild(this.handle);
    this.addChild(this.baseBar);
    this.addChild(this.topBar);
  };

  setTargetParam(param) {
    const range = param.getRange() ? param.getRange() : [0, 1];
    const step = param.getStep();

    param.valueChanged.connect(()=>{
      const value = param.getValue();
      this.__updateSlider(Math.remap(value, range[0], range[1], 0, this.__length));
    })

  }

  __updateSlider(value) {
    this.handleXfo.tr.z = value;
    this.baseBarXfo.sc.z = value;
    this.topBarXfo.sc.z = 1 - (value);
    this.handle.setLocalXfo(this.handleXfo)
    this.baseBar.setLocalXfo(this.baseBarXfo)
    this.topBar.setLocalXfo(this.topBarXfo)
  }

  /////////////////////////////////////
  // Interaction events

  onDragStart(event) {
    this.change = new ParameterValueChange(parameter, value);
    this.__undoRedoManager.addChange(this.change);

    // Hilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 2.0;
  }

  onDrag(event) {
    const value = Math.remap(value, 0, this.__length, range[0], range[1]);
    this.change.update({ value });
  }

  onDragEnd(event) {
    this.change = null;
    // /unhilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.0;
  }
};
