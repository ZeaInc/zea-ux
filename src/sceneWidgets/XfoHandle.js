import SceneWidget from './SceneWidget.js';
import {
  LinearMovementSceneWidget
} from './LinearMovementSceneWidget.js';
import {
  PlanarMovementSceneWidget
} from './PlanarMovementSceneWidget.js';
import {
  AxialRotationSceneWidget
} from './AxialRotationSceneWidget.js';

export default class XfoHandle extends Visualive.TreeItem {
  constructor(name) {
    super(name)

    const size = 0.4
    const thickness = 0.005
    //////////////////////////////////
    // LinearMovementSceneWidget
    const translationHandles = new Visualive.TreeItem('Translation');
    // translationHandles.setVisible(false);
    this.addChild(translationHandles); 

    {
      const linearXWidget = new LinearMovementSceneWidget(
        'linearX',
        size,
        thickness,
        new Visualive.Color('red')
      );
      const xfo = new Visualive.Xfo();
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI * 0.5);
      linearXWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(linearXWidget);
    } {
      const linearYWidget = new LinearMovementSceneWidget(
        'linearY',
        size,
        thickness,
        new Visualive.Color('green')
      );
      const xfo = new Visualive.Xfo();
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * -0.5);
      linearYWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(linearYWidget);
    } {
      const linearZWidget = new LinearMovementSceneWidget(
        'linearZ',
        size,
        thickness,
        new Visualive.Color('blue')
      );
      translationHandles.addChild(linearZWidget);
    }

    //////////////////////////////////
    // planarXYWidget
    const planarSize = size * 0.25;
    {
      const planarXYWidget = new PlanarMovementSceneWidget(
        'planarXY',
        planarSize,
        new Visualive.Color('green')
      );
      const xfo = new Visualive.Xfo();
      xfo.tr.set(planarSize * 0.5, planarSize * 0.5, 0.0)
      planarXYWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(planarXYWidget);
    } {
      const planarYZWidget = new PlanarMovementSceneWidget(
        'planarYZ',
        planarSize,
        new Visualive.Color('red')
      );
      const xfo = new Visualive.Xfo();
      xfo.tr.set(0.0, planarSize * 0.5, planarSize * 0.5)
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI * 0.5);
      planarYZWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(planarYZWidget);

    } {
      const planarXZWidget = new PlanarMovementSceneWidget(
        'planarXZ',
        planarSize,
        new Visualive.Color('blue')
      );
      const xfo = new Visualive.Xfo();
      xfo.tr.set(planarSize * 0.5, 0.0, planarSize * 0.5)
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * 0.5);
      planarXZWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(planarXZWidget);
    }

    //////////////////////////////////
    // Rotation
    const rotationHandles = new Visualive.TreeItem('Rotation');
    this.addChild(rotationHandles); 

    {
      const rotationXWidget = new AxialRotationSceneWidget(
        'rotationX',
        size,
        thickness,
        new Visualive.Color('red')
      );
      const xfo = new Visualive.Xfo();
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI * 0.5);
      rotationXWidget.getParameter('LocalXfo').setValue(xfo)
      rotationHandles.addChild(rotationXWidget);
    } {
      const rotationYWidget = new AxialRotationSceneWidget(
        'rotationY',
        size,
        thickness,
        new Visualive.Color('green')
      );
      const xfo = new Visualive.Xfo();
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * 0.5);
      rotationYWidget.getParameter('LocalXfo').setValue(xfo)
      rotationHandles.addChild(rotationYWidget);
    } {
      const rotationZWidget = new AxialRotationSceneWidget(
        'rotationZ',
        size,
        thickness,
        new Visualive.Color('blue')
      );
      rotationHandles.addChild(rotationZWidget);
    }
    //////////////////////////////////
    // Rotation
    const scaleHandles = new Visualive.TreeItem('Scale');
    this.addChild(scaleHandles)
  }

  showHandles(handles) {
    this.traverse(item => {
      if(item != this) {
        item.setVisible(false)
        return false;
      }
    })

    const child = this.getChildByName(handles);
    if(child)
      child.setVisible(true);
  }

  setTargetParam(param) {
    this.__param = param;
    this.traverse(item => {
      if (item instanceof SceneWidget)
        item.setTargetParam(param, false);
    })
  }
};