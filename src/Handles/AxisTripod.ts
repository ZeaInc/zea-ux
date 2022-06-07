import {
  Color,
  Vec3,
  GeomItem,
  Xfo,
  Quat,
  Cone,
  Cylinder,
  TreeItem,
  FlatSurfaceMaterial,
  MathFunctions,
  GLViewport,
  Material,
  ZeaPointerEvent,
  GLRenderer,
} from '@zeainc/zea-engine'

class AxisTripod extends TreeItem {
  /**
   * Create an axial rotation scene widget.
   *
   * @param size - The size value.
   */
  constructor(public size = 1) {
    super('AxisTripod')

    const redMaterial = new FlatSurfaceMaterial('redMaterial')
    redMaterial.baseColorParam.value = new Color(1, 0, 0)
    const greenMaterial = new FlatSurfaceMaterial('greenMaterial')
    greenMaterial.baseColorParam.value = new Color(0, 1, 0)
    const blueMaterial = new FlatSurfaceMaterial('blueMaterial')
    blueMaterial.baseColorParam.value = new Color(0, 0, 1)

    const arrowTailLength = 0.8 * this.size
    const arrowHeadLength = 0.2 * this.size

    const cylinder = new Cylinder(0.02 * this.size, arrowTailLength, 64, 2, true, true)
    const cone = new Cone(0.08 * this.size, arrowHeadLength, 64, true)

    const buildArrow = (material: Material, quat: Quat, name: string) => {
      const xfo = new Xfo()
      xfo.ori = quat

      const tailItem = new GeomItem('tail' + name, cylinder, material, xfo)
      const coneItem = new GeomItem('cone' + name, cone, material, new Xfo(new Vec3(0, 0, arrowTailLength)))
      tailItem.setOverlay(true)
      coneItem.setOverlay(true)
      tailItem.addChild(coneItem, false, false)
      this.addChild(tailItem, false, false)
    }
    const quatRed = new Quat()
    quatRed.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
    buildArrow(redMaterial, quatRed, 'Red')
    const quatGreen = new Quat()
    quatGreen.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.5)
    buildArrow(greenMaterial, quatGreen, 'Green')
    const quatBlue = new Quat()
    buildArrow(blueMaterial, quatBlue, 'Blue')
  }

  bindToViewport(renderer: GLRenderer, viewport: GLViewport, pixelOffset = 100) {
    renderer.addTreeItem(this)
    const updateXfo = () => {
      const focalDistance = camera.focalDistanceParam.value
      const xfo = new Xfo() // camera.globalXfoParam.value.clone()
      xfo.ori = xfo.ori.inverse()

      const pos = new Vec3()
      const fov = camera.fovParam.value
      const viewHeightPersp = Math.tan(fov * 0.5) * focalDistance
      const offsetPersp = (viewHeightPersp / viewport.getHeight()) * pixelOffset

      // @ts-ignore
      const viewHeightOrth = camera.viewHeight * 0.5
      const viewHeight = MathFunctions.lerp(viewHeightPersp, viewHeightOrth, camera.isOrthographicParam.value)
      const offsetOrth = (viewHeightOrth / viewport.getHeight()) * pixelOffset

      const aspectRatio = viewport.getWidth() / viewport.getHeight()
      const viewWidth = viewHeight * aspectRatio

      const margin = MathFunctions.lerp(offsetPersp, offsetOrth, camera.isOrthographicParam.value)
      pos.set(0, 0, -focalDistance)
      pos.set(viewWidth - margin, -viewHeight + margin, -focalDistance)

      xfo.tr = camera.globalXfoParam.value.transformVec3(pos)

      xfo.sc.set(margin * 0.75, margin * 0.75, margin * 0.75)
      this.globalXfoParam.value = xfo
    }
    const camera = viewport.getCamera()
    camera.addChild(this, false)
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
