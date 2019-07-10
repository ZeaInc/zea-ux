import {BaseLinearMovementSceneWidget} from './BaseLinearMovementSceneWidget.js';

class LinearMovementSceneWidget extends BaseLinearMovementSceneWidget {
  constructor(name, length, radius, color) {
    super(name)

    this.__color = color;
    // this.radiusParam = this.addParameter(new Visualive.NumberParameter('radius', radius));
    // this.colorParam = this.addParameter(new Visualive.ColorParameter('BaseColor', color));

    // const handleMat = new Visualive.Material('handle', 'FlatSurfaceShader');
    // // handleMat.replaceParameter(this.colorParam);
    // handleMat.getParameter('BaseColor').setValue(color);

    // const handleGeom = new Visualive.Cylinder(radius * 0.01, length, 64);
    // const tipGeom = new Visualive.Cone(radius, length * 0.05, 64, true);
    // this.handle = new Visualive.GeomItem('handle', handleGeom, handleMat);
    // this.tip = new Visualive.GeomItem('tip', tipGeom, handleMat);
    // const tipXfo = new Visualive.Xfo()
    // tipXfo.tr.set(0,0,length)
    // this.tip.getParameter('LocalXfo').setValue(tipXfo);

    // this.radiusParam.valueChanged.connect(()=>{
    //   radius = this.radiusParam.getValue();
    //   handleGeom.getParameter('radius').setValue(radius);
    //   handleGeom.getParameter('height').setValue(radius * 0.02);
    // })

    // this.addChild(this.handle);
    // this.addChild(this.tip);
  };

  setTargetParam(param, track=true) {
    this.__param = param;
    if(track) {
      const __updateGizmo = () => {
        this.setGlobalXfo(param.getValue())
      }
      __updateGizmo();
      param.valueChanged.connect(__updateGizmo)
    }
  }


};

export {
  LinearMovementSceneWidget
}