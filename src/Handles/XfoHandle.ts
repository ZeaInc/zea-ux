import { Color, Vec3, Xfo, EulerAngles, TreeItem, ColorParameter, XfoParameter, Parameter } from '@zeainc/zea-engine'
import Handle from './Handle'
import LinearMovementHandle from './LinearMovementHandle'
import AxialRotationHandle from './AxialRotationHandle'
import './Shaders/HandleShader'
import XfoPlanarMovementHandle from './XfoPlanarMovementHandle'
import SelectionGroup from '../SelectionGroup'

/**
 * Class representing a xfo handle. Base transformations for objects in the scene
 *
 * **Parameters**
 * * **HighlightColor(`ColorParameter`):** Specifies the highlight color of the handle.
 *
 * @extends TreeItem
 */
class XfoHandle extends TreeItem {
  param: Parameter<unknown>
  highlightColorParam = new ColorParameter('HighlightColor', new Color(1, 1, 1))

  /**
   * Create an axial rotation scene widget.
   *
   * @param size - The size value.
   * @param thickness - The thickness value.
   */
  constructor(size = 0.1, thickness = 0.001) {
    super('XfoHandle')

    this.highlightColorParam.on('valueChanged', () => {
      const color = this.highlightColorParam.getValue()

      this.traverse((item) => {
        if (item instanceof Handle) item.highlightColorParam.value = color
      })
    })
    this.addParameter(this.highlightColorParam)
    // ////////////////////////////////
    // LinearMovementHandle

    const translationHandles = new TreeItem('Translate')
    // translationHandles.setVisible(false)
    this.addChild(translationHandles)

    const red = new Color(1, 0.1, 0.1)
    const green = new Color('#32CD32') // limegreen https://www.rapidtables.com/web/color/green-color.html
    const blue = new Color('#1E90FF') // dodgerblue https://www.rapidtables.com/web/color/blue-color.html
    red.a = 1
    green.a = 1
    blue.a = 1

    {
      const linearXWidget = new LinearMovementHandle('linearX', size, thickness, red)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
      linearXWidget.localXfoParam.value = xfo
      translationHandles.addChild(linearXWidget)
    }
    {
      const linearYWidget = new LinearMovementHandle('linearY', size, thickness, green)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.5)
      linearYWidget.localXfoParam.value = xfo
      translationHandles.addChild(linearYWidget)
    }
    {
      const linearZWidget = new LinearMovementHandle('linearZ', size, thickness, blue)
      translationHandles.addChild(linearZWidget)
    }

    // ////////////////////////////////
    // planarXYWidget
    const planarSize = size * 0.25
    {
      const planarXYWidget = new XfoPlanarMovementHandle(
        'planarXY',
        planarSize,
        new Vec3(planarSize * 0.85, planarSize * 0.85, 0.0),
        blue
      )
      const xfo = new Xfo()
      planarXYWidget.localXfoParam.value = xfo
      translationHandles.addChild(planarXYWidget)
    }
    {
      const planarYZWidget = new XfoPlanarMovementHandle(
        'planarYZ',
        planarSize,
        new Vec3(planarSize * -0.85, planarSize * 0.85, 0.0),
        red
      )
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
      planarYZWidget.localXfoParam.value = xfo
      translationHandles.addChild(planarYZWidget)
    }
    {
      const planarXZWidget = new XfoPlanarMovementHandle(
        'planarXZ',
        planarSize,
        new Vec3(planarSize * 0.85, planarSize * 0.85, 0.0),
        green
      )
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
      planarXZWidget.localXfoParam.value = xfo
      translationHandles.addChild(planarXZWidget)
    }

    // ////////////////////////////////
    // Rotation
    const rotationHandles = new TreeItem('Rotate')
    // rotationHandles.setVisible(false)
    this.addChild(rotationHandles)
    // {
    //   const rotationWidget = new SphericalRotationHandle('rotation', size - thickness, new Color(1, 1, 1, 0))
    //   rotationHandles.addChild(rotationWidget)
    // }
    {
      const rotationXWidget = new AxialRotationHandle('rotationX', size * 0.75, thickness, red)
      const xfo = new Xfo()
      xfo.ori.setFromEulerAngles(new EulerAngles(Math.PI * -0.5, Math.PI * -0.5, 0))
      rotationXWidget.localXfoParam.value = xfo
      rotationHandles.addChild(rotationXWidget)
    }
    {
      const rotationYWidget = new AxialRotationHandle('rotationY', size * 0.75, thickness, green)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.5)
      rotationYWidget.localXfoParam.value = xfo
      rotationHandles.addChild(rotationYWidget)
    }
    {
      const rotationZWidget = new AxialRotationHandle('rotationZ', size * 0.75, thickness, blue)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(0, 0, 1), Math.PI * 0.5)
      rotationZWidget.localXfoParam.value = xfo
      rotationHandles.addChild(rotationZWidget)
    }
    /*
    // ////////////////////////////////
    // Scale - Not supported
    const scaleHandles = new TreeItem('Scale')
    scaleHandles.setVisible(false)
    this.addChild(scaleHandles)

    const scaleHandleLength = size * 0.95
    {
      const scaleXWidget = new LinearScaleHandle('scaleX', scaleHandleLength, thickness, red)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
      scaleXWidget.localXfoParam.value = xfo
      scaleHandles.addChild(scaleXWidget)
    }
    {
      const scaleYWidget = new LinearScaleHandle('scaleY', scaleHandleLength, thickness, green)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.5)
      scaleYWidget.localXfoParam.value = xfo
      scaleHandles.addChild(scaleYWidget)
    }
    {
      const scaleZWidget = new LinearScaleHandle('scaleZ', scaleHandleLength, thickness, blue)
      scaleHandles.addChild(scaleZWidget)
    }
    */
  }

  /**
   * Displays handles depending on the specified mode(Move, Rotate, Scale).
   * If nothing is specified, it hides all of them.
   * @deprecated
   * @param visible - The mode of the Xfo parameter
   */
  showHandles(visible: boolean): void {
    if (visible) this.setVisible(true)
    else this.setVisible(false)
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param param - The parameter that will be modified during manipulation
   */
  setTargetParam(param: XfoParameter): void {
    this.param = param
    this.traverse((item) => {
      if (
        item instanceof LinearMovementHandle ||
        item instanceof XfoPlanarMovementHandle ||
        item instanceof AxialRotationHandle
      ) {
        item.setTargetParam(param)
      }
    })
  }

  /**
   * Sets selectionGroup so this handle can modify the items.
   *
   * @param selectionGroup - The SelectionGroup.
   */
  setSelectionGroup(selectionGroup: SelectionGroup): void {
    this.traverse((item) => {
      if (
        item instanceof LinearMovementHandle ||
        item instanceof XfoPlanarMovementHandle ||
        item instanceof AxialRotationHandle
      ) {
        item.setSelectionGroup(selectionGroup)
      }
    })
  }
}

export default XfoHandle
export { XfoHandle }
