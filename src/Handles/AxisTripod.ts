import {
  Color,
  Vec3,
  GeomItem,
  Xfo,
  Quat,
  Cone,
  Cylinder,
  TreeItem,
  MathFunctions,
  GLViewport,
  ZeaPointerEvent,
  GLRenderer,
  Label,
  BillboardItem,
  BillboardAlignment,
} from '@zeainc/zea-engine'
import HandleMaterial from './Shaders/HandleMaterial'
import transformVertices from './transformVertices'

class AxisTripod extends TreeItem {
  /**
   * Create an axial rotation scene widget.
   *
   * @param size - The size value.
   */
  constructor(
    size = 0.1,
    xaxisColor: Color = new Color(1, 0, 0),
    yaxisColor: Color = new Color(0, 1, 0),
    zaxisColor: Color = new Color(0, 0, 1)
  ) {
    super('AxisTripod')

    const redMaterial = new HandleMaterial('redMaterial')
    redMaterial.baseColorParam.value = xaxisColor
    redMaterial.maintainScreenSizeParam.value = 1
    const greenMaterial = new HandleMaterial('greenMaterial')
    greenMaterial.baseColorParam.value = yaxisColor
    greenMaterial.maintainScreenSizeParam.value = 1
    const blueMaterial = new HandleMaterial('blueMaterial')
    blueMaterial.baseColorParam.value = zaxisColor
    blueMaterial.maintainScreenSizeParam.value = 1

    const arrowTailLength = 0.8 * size
    const arrowHeadLength = 0.2 * size

    const cylinder = new Cylinder(0.01 * size, arrowTailLength, 64, 2, true, true)

    const buildArrow = (material: HandleMaterial, quat: Quat, name: string) => {
      const xfo = new Xfo()
      xfo.ori = quat

      const cone = new Cone(0.06 * size, arrowHeadLength, 64, true)
      const tipXfo = new Xfo()
      tipXfo.tr.set(0, 0, arrowTailLength)
      transformVertices(cone, tipXfo)

      const tailItem = new GeomItem('tail' + name, cylinder, material, xfo)
      const coneItem = new GeomItem('cone' + name, cone, material)

      material.overlayParam.value = 0.35
      tailItem.addChild(coneItem, false, false)
      this.addChild(tailItem, false, false)

      const label = new Label(name)
      label.fontSizeParam.value = 48
      label.fontColorParam.value = material.baseColorParam.value
      label.backgroundParam.value = false

      // Setup the label
      const billboard = new BillboardItem('billboard' + name, label)
      billboard.pixelsPerMeterParam.value = 200 / size
      // @ts-ignore
      if (billboard.alignedToCameraParam) {
        // @ts-ignore
        billboard.alignedToCameraParam.value = true
      } else {
        billboard.alignmentParam.value = BillboardAlignment.AlignedToCamera
      }
      billboard.drawOnTopParam.value = true
      billboard.alphaParam.value = 1
      billboard.fixedSizeOnscreenParam.value = true

      const labelXfo = new Xfo(new Vec3(0, 0, size * 1.15))
      billboard.localXfoParam.value = labelXfo

      tailItem.addChild(billboard, false)
    }

    const quatRed = new Quat()
    quatRed.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
    buildArrow(redMaterial, quatRed, 'X')
    const quatGreen = new Quat()
    quatGreen.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.5)
    buildArrow(greenMaterial, quatGreen, 'Y')
    const quatBlue = new Quat()
    buildArrow(blueMaterial, quatBlue, 'Z')
  }

  bindToViewport(renderer: GLRenderer, viewport: GLViewport, pixelOffset = 100, screenSpaceCoord: number[] = [1, 1]) {
    renderer.addTreeItem(this)
    const camera = viewport.getCamera()

    const updateXfo = () => {
      const focalDistance = camera.focalDistanceParam.value
      const xfo = new Xfo()

      const pos = new Vec3()
      const fov = camera.fovParam.value
      const viewHeightPersp = Math.tan(fov * 0.5) * focalDistance

      // @ts-ignore
      const viewHeightOrth = camera.viewHeight * 0.5
      const halfViewHeight = MathFunctions.lerp(viewHeightPersp, viewHeightOrth, camera.isOrthographicParam.value)

      const aspectRatio = viewport.getWidth() / viewport.getHeight()
      const halfViewWidth = halfViewHeight * aspectRatio

      const margin = pixelOffset * (halfViewHeight / viewport.getHeight())
      pos.set(
        (halfViewWidth - margin) * screenSpaceCoord[0],
        (halfViewHeight - margin) * screenSpaceCoord[1],
        -focalDistance
      )

      xfo.tr = camera.globalXfoParam.value.transformVec3(pos)
      xfo.sc.set(halfViewHeight * 2.0, halfViewHeight * 2.0, halfViewHeight * 2.0)
      this.globalXfoParam.value = xfo
    }

    updateXfo()
    camera.on('projectionParamChanged', updateXfo)
    camera.globalXfoParam.on('valueChanged', updateXfo)
    viewport.on('resized', updateXfo)
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the handle element.
   *
   * @param event - The event param.
   */
  onPointerDown(event: ZeaPointerEvent): void {
    event.stopPropagation()
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is over the handle.
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    event.stopPropagation()
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the handle.
   *
   * @param event - The event param.
   */
  onPointerUp(event: ZeaPointerEvent): void {
    event.stopPropagation()
  }
}

export { AxisTripod }
