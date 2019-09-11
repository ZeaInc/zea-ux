import SceneWidget from './SceneWidget.js';
import { LinearMovementSceneWidget } from './LinearMovementSceneWidget.js';
import { PlanarMovementSceneWidget } from './PlanarMovementSceneWidget.js';
import { AxialRotationSceneWidget } from './AxialRotationSceneWidget.js';
import { LinearScaleSceneWidget } from './LinearScaleSceneWidget.js';

/**
 * Class representing an xfo handle.
 * @extends ZeaEngine.TreeItem
 */
export default class XfoHandle extends ZeaEngine.TreeItem {
  /**
   * Create an axial rotation scene widget.
   * @param {any} size - The size value.
   * @param {any} thickness - The thickness value.
   */
  constructor(size, thickness) {
    super('XfoHandle');

    // ////////////////////////////////
    // LinearMovementSceneWidget

    const translationHandles = new ZeaEngine.TreeItem('Translate');
    translationHandles.setVisible(false);
    this.addChild(translationHandles);

    const red = new ZeaEngine.Color(1, 0.1, 0.1);
    const green = new ZeaEngine.Color('#32CD32'); // limegreen https://www.rapidtables.com/web/color/green-color.html
    const blue = new ZeaEngine.Color('#1E90FF'); // dodgerblue https://www.rapidtables.com/web/color/blue-color.html
    red.a = 0.8;
    green.a = 0.8;
    blue.a = 0.8;

    {
      const linearXWidget = new LinearMovementSceneWidget(
        'linearX',
        size,
        thickness,
        red
      );
      const xfo = new ZeaEngine.Xfo();
      xfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(0, 1, 0), Math.PI * 0.5);
      linearXWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(linearXWidget);
    }
    {
      const linearYWidget = new LinearMovementSceneWidget(
        'linearY',
        size,
        thickness,
        green
      );
      const xfo = new ZeaEngine.Xfo();
      xfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(1, 0, 0), Math.PI * -0.5);
      linearYWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(linearYWidget);
    }
    {
      const linearZWidget = new LinearMovementSceneWidget(
        'linearZ',
        size,
        thickness,
        blue
      );
      translationHandles.addChild(linearZWidget);
    }

    // ////////////////////////////////
    // planarXYWidget
    const planarSize = size * 0.35;
    {
      const planarXYWidget = new PlanarMovementSceneWidget(
        'planarXY',
        planarSize,
        green,
        new ZeaEngine.Vec3(planarSize * 0.5, planarSize * 0.5, 0.0)
      );
      const xfo = new ZeaEngine.Xfo();
      planarXYWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(planarXYWidget);
    }
    {
      const planarYZWidget = new PlanarMovementSceneWidget(
        'planarYZ',
        planarSize,
        red,
        new ZeaEngine.Vec3(planarSize * -0.5, planarSize * 0.5, 0.0)
      );
      const xfo = new ZeaEngine.Xfo();
      xfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(0, 1, 0), Math.PI * 0.5);
      planarYZWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(planarYZWidget);
    }
    {
      const planarXZWidget = new PlanarMovementSceneWidget(
        'planarXZ',
        planarSize,
        blue,
        new ZeaEngine.Vec3(planarSize * 0.5, planarSize * 0.5, 0.0)
      );
      const xfo = new ZeaEngine.Xfo();
      xfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(1, 0, 0), Math.PI * 0.5);
      planarXZWidget.getParameter('LocalXfo').setValue(xfo);
      translationHandles.addChild(planarXZWidget);
    }

    // ////////////////////////////////
    // Rotation
    const rotationHandles = new ZeaEngine.TreeItem('Rotate');
    rotationHandles.setVisible(false);
    this.addChild(rotationHandles);
    {
      const maskMat = new ZeaEngine.Material('mask', 'HandleShader');
      maskMat
        .getParameter('BaseColor')
        .setValue(new ZeaEngine.Color(1, 1, 1, 0.4));
      const maskGeom = new ZeaEngine.Sphere(size - thickness, 64);
      const maskGeomItem = new ZeaEngine.GeomItem('mask', maskGeom, maskMat);
      rotationHandles.addChild(maskGeomItem);
    }
    {
      const rotationXWidget = new AxialRotationSceneWidget(
        'rotationX',
        size,
        thickness,
        red
      );
      const xfo = new ZeaEngine.Xfo();
      xfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(0, 1, 0), Math.PI * 0.5);
      rotationXWidget.getParameter('LocalXfo').setValue(xfo);
      rotationHandles.addChild(rotationXWidget);
    }
    {
      const rotationYWidget = new AxialRotationSceneWidget(
        'rotationY',
        size,
        thickness,
        green
      );
      const xfo = new ZeaEngine.Xfo();
      xfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(1, 0, 0), Math.PI * 0.5);
      rotationYWidget.getParameter('LocalXfo').setValue(xfo);
      rotationHandles.addChild(rotationYWidget);
    }
    {
      const rotationZWidget = new AxialRotationSceneWidget(
        'rotationZ',
        size,
        thickness,
        blue
      );
      rotationHandles.addChild(rotationZWidget);
    }

    // ////////////////////////////////
    // Scale - Not supported
    const scaleHandles = new ZeaEngine.TreeItem('Scale');
    scaleHandles.setVisible(false);
    this.addChild(scaleHandles);

    const scaleHandleLength = size * 0.95;
    {
      const scaleXWidget = new LinearScaleSceneWidget(
        'scaleX',
        scaleHandleLength,
        thickness,
        red
      );
      const xfo = new ZeaEngine.Xfo();
      xfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(0, 1, 0), Math.PI * 0.5);
      scaleXWidget.getParameter('LocalXfo').setValue(xfo);
      scaleHandles.addChild(scaleXWidget);
    }
    {
      const scaleYWidget = new LinearScaleSceneWidget(
        'scaleY',
        scaleHandleLength,
        thickness,
        green
      );
      const xfo = new ZeaEngine.Xfo();
      xfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(1, 0, 0), Math.PI * -0.5);
      scaleYWidget.getParameter('LocalXfo').setValue(xfo);
      scaleHandles.addChild(scaleYWidget);
    }
    {
      const scaleZWidget = new LinearScaleSceneWidget(
        'scaleZ',
        scaleHandleLength,
        thickness,
        blue
      );
      scaleHandles.addChild(scaleZWidget);
    }
  }

  /**
   * Calculate the global Xfo for the handls.
   */
  _cleanGlobalXfo(prevValue) {
    const parentItem = this.getParentItem();
    if (parentItem !== undefined) {
      const parentXfo = parentItem.getGlobalXfo().clone();
      parentXfo.sc.set(1, 1, 1);
      return parentXfo.multiply(this.__localXfoParam.getValue());
    }
    else
      return this.__localXfoParam.getValue();
  }

  /**
   * The showHandles method.
   * @param {any} name - The name param.
   * @return {any} The return value.
   */
  showHandles(name) {
    this.traverse(item => {
      if (item != this) {
        item.setVisible(false);
        return false;
      }
    });

    const child = this.getChildByName(name);
    if (child) child.setVisible(true);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   */
  setTargetParam(param) {
    this.__param = param;
    this.traverse(item => {
      if (item instanceof SceneWidget) item.setTargetParam(param, false);
    });
  }
}
