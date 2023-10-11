import {
  Color,
  Vec3,
  GeomItem,
  Xfo,
  Quat,
  TreeItem,
  FlatSurfaceMaterial,
  MathFunctions,
  GLViewport,
  ZeaPointerEvent,
  Plane,
  Label,
  EulerAngles,
  GLRenderer,
  Camera,
  CameraManipulator,
  Cuboid,
  LinesCuboid,
} from '@zeainc/zea-engine'
import { ToolManager } from '../Tools'

class ViewCube extends TreeItem {
  private viewport: GLViewport
  private normalMaterial = new FlatSurfaceMaterial('material')
  private highlightedMaterial = new FlatSurfaceMaterial('material')
  private highlightedGeom: GeomItem
  /**
   * Create an axial rotation scene widget.
   *
   * @param size - The size value.
   */
  constructor(
    size = 1,
    roundness = 0.15,
    faceColor = new Color(1, 0.8, 0.15),
    faceHighlightColor = new Color(1, 0.9, 0.5),
    labels: Record<string, string> = {
      YPos: 'FRONT',
      YNeg: 'BACK',
      XPos: 'LEFT',
      XNeg: 'RIGHT',
      ZPos: 'TOP',
      ZNeg: 'BOTTOM',
    },
    fontSize = 50,
    margin = 10
  ) {
    super('ViewCube')

    this.normalMaterial.baseColorParam.value = faceColor
    this.highlightedMaterial.baseColorParam.value = faceHighlightColor

    const up = new Vec3(0, 0, 1)

    const marginSize = size * roundness
    const plane = new Plane(size - marginSize * 2, size - marginSize * 2)
    const sphere = new Cuboid(marginSize, marginSize, marginSize, false)
    const cylinder = new Cuboid(marginSize, size - marginSize * 2, marginSize, false)

    const linesMaterial = new FlatSurfaceMaterial('material')
    linesMaterial.baseColorParam.value = new Color(0.1, 0.1, 0.1, 1)
    const lines = new LinesCuboid(size, size, size, false)

    const linesItem = new GeomItem('borderlines', lines, linesMaterial)
    linesItem.setOverlay(true)
    linesItem.setSelectable(false)
    this.addChild(linesItem, false, false)

    const buildFace = (quat: Quat, name: string) => {
      const xfo = new Xfo()
      xfo.ori = quat
      xfo.tr = quat.rotateVec3(new Vec3(0, 0, size * 0.5))

      const planeItem = new GeomItem('face' + name, plane, this.normalMaterial, xfo)
      planeItem.setOverlay(true)
      this.addChild(planeItem, false, false)

      const labelMaterial = new FlatSurfaceMaterial('material')
      labelMaterial.baseColorParam.value = faceColor

      const label = new Label(name)
      label.fontParam.value = 'Verdana'
      label.fontColorParam.value = new Color(0, 0, 0)
      label.fontSizeParam.value = fontSize
      label.fillBackgroundParam.value = false
      label.marginParam.value = margin
      label.strokeBackgroundOutlineParam.value = false
      label.mipMapped = true
      label.textParam.value = labels[name]

      labelMaterial.baseColorParam.setImage(label)

      const planeLabelItem = new GeomItem('face' + name, plane, labelMaterial, new Xfo(new Vec3(0, 0, 0.001)))
      planeLabelItem.setOverlay(true)
      planeLabelItem.setSelectable(false)
      planeItem.addChild(planeLabelItem, false, false)

      label.once('labelRendered', (event: any) => {
        const xfo = planeLabelItem.localXfoParam.value
        xfo.sc.x = event.width / 160
        xfo.sc.y = event.height / 100
        planeLabelItem.localXfoParam.value = xfo
      })
    }
    const quatYPos = new Quat()
    quatYPos.setFromEulerAngles(new EulerAngles(MathFunctions.degToRad(-90), 0, MathFunctions.degToRad(180)))
    buildFace(quatYPos, 'YPos')
    const quatYNeg = new Quat()
    quatYNeg.setFromEulerAngles(new EulerAngles(MathFunctions.degToRad(90), 0, 0))
    buildFace(quatYNeg, 'YNeg')

    const quatXPos = new Quat()
    quatXPos.setFromEulerAngles(new EulerAngles(0, MathFunctions.degToRad(90), MathFunctions.degToRad(90)))
    buildFace(quatXPos, 'XPos')
    const quatXNeg = new Quat()
    quatXNeg.setFromEulerAngles(new EulerAngles(0, MathFunctions.degToRad(-90), MathFunctions.degToRad(-90)))
    buildFace(quatXNeg, 'XNeg')

    const quatZPos = new Quat()
    quatZPos.setFromEulerAngles(new EulerAngles(0, 0, MathFunctions.degToRad(180)))
    buildFace(quatZPos, 'ZPos')
    const quatZNeg = new Quat()
    quatZNeg.setFromEulerAngles(new EulerAngles(0, MathFunctions.degToRad(-180), 0))
    buildFace(quatZNeg, 'ZNeg')

    // /////////////////////
    // Corners
    const buildCorner = (vec3: Vec3, text: string) => {
      const xfo = new Xfo()
      xfo.tr = vec3.scale(size * 0.5)
      xfo.tr.subtractInPlace(vec3.scale(marginSize * 0.5))
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), up)

      const cornerItem = new GeomItem('corner' + text, sphere, this.normalMaterial, xfo)

      const geomOffsetXfo = new Xfo()
      geomOffsetXfo.ori = xfo.ori.inverse()
      cornerItem.geomOffsetXfoParam.value = geomOffsetXfo

      cornerItem.setOverlay(true)
      this.addChild(cornerItem, false, false)
    }

    buildCorner(new Vec3(1, 1, 1), '111')
    buildCorner(new Vec3(-1, 1, 1), '-111')
    buildCorner(new Vec3(-1, -1, 1), '-1-11')
    buildCorner(new Vec3(1, -1, 1), '1-11')
    buildCorner(new Vec3(1, 1, -1), '11-1')
    buildCorner(new Vec3(-1, 1, -1), '-11-1')
    buildCorner(new Vec3(-1, -1, -1), '-1-1-1')
    buildCorner(new Vec3(1, -1, -1), '1-1-1')

    // /////////////////////
    // Edges
    const buildEdge = (xfo: Xfo, up: Vec3, text: string) => {
      const offset = xfo.tr.scale(marginSize * 0.5)
      xfo.tr.scaleInPlace(size * 0.5)
      xfo.tr.subtractInPlace(offset)

      const edgeItem = new GeomItem('edge' + text, cylinder, this.normalMaterial, xfo)

      const geomOffsetXfo = new Xfo()
      geomOffsetXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), MathFunctions.degToRad(45))
      edgeItem.geomOffsetXfoParam.value = geomOffsetXfo

      edgeItem.setOverlay(true)
      this.addChild(edgeItem, false, false)
    }

    {
      const xfo = new Xfo()
      xfo.tr.set(1, 1, 0)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), up)
      buildEdge(xfo, up, '110')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(-1, 1, 0)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), up)
      buildEdge(xfo, up, '-110')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(1, -1, 0)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), up)
      buildEdge(xfo, up, '1-10')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(-1, -1, 0)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), up)
      buildEdge(xfo, up, '-1-10')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(1, 0, 1)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), new Vec3(0, 1, 0))
      buildEdge(xfo, new Vec3(0, 1, 0), '101')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(-1, 0, 1)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), new Vec3(0, 1, 0))
      buildEdge(xfo, new Vec3(0, 1, 0), '-101')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(0, 1, 1)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), new Vec3(1, 0, 0))
      buildEdge(xfo, new Vec3(1, 0, 0), '011')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(0, -1, 1)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), new Vec3(1, 0, 0))
      buildEdge(xfo, new Vec3(1, 0, 0), '0-11')
    }

    {
      const xfo = new Xfo()
      xfo.tr.set(1, 0, -1)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), new Vec3(0, 1, 0))
      buildEdge(xfo, new Vec3(0, 1, 0), '10-1')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(-1, 0, -1)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), new Vec3(0, 1, 0))
      buildEdge(xfo, new Vec3(0, 1, 0), '-10-1')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(0, 1, -1)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), new Vec3(1, 0, 0))
      buildEdge(xfo, new Vec3(1, 0, 0), '01-1')
    }
    {
      const xfo = new Xfo()
      xfo.tr.set(0, -1, -1)
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), new Vec3(1, 0, 0))
      buildEdge(xfo, new Vec3(1, 0, 0), '0-1-1')
    }
  }

  bindToViewport(renderer: GLRenderer, viewport: GLViewport, pixelOffset = 200, screenSpaceCoord: number[] = [1, 1]) {
    renderer.addTreeItem(this)
    this.viewport = viewport
    const camera = this.viewport.getCamera()

    const updateXfo = () => {
      const focalDistance = camera.focalDistanceParam.value
      const xfo = new Xfo()

      const pos = new Vec3()
      const fov = camera.fovParam.value
      const viewHeightPersp = Math.tan(fov * 0.5) * focalDistance

      // @ts-ignore
      const viewHeightOrth = camera.viewHeight * 0.5
      const halfViewHeight = MathFunctions.lerp(viewHeightPersp, viewHeightOrth, camera.isOrthographicParam.value)

      const width = viewport.getWidth() / window.devicePixelRatio
      const height = viewport.getHeight() / window.devicePixelRatio
      const aspectRatio = width / height
      const halfViewWidth = halfViewHeight * aspectRatio

      const margin = pixelOffset * (halfViewHeight / height)
      pos.set(
        (halfViewWidth - margin) * screenSpaceCoord[0],
        (halfViewHeight - margin) * screenSpaceCoord[1],
        -focalDistance
      )

      // normalize the hight so it is the same size on all screen resolutions.
      // the 60 is just a magic number to make the view cube a nice size with a 1.0
      // size parameter.
      const sc = (halfViewHeight * 2.0) / (height / 50)

      xfo.tr = camera.globalXfoParam.value.transformVec3(pos)
      xfo.sc.set(sc, sc, sc)
      this.globalXfoParam.value = xfo
    }

    updateXfo()
    camera.on('projectionParamChanged', updateXfo)
    camera.globalXfoParam.on('valueChanged', updateXfo)
    viewport.on('resized', updateXfo)
  }

  // ///////////////////////////////////
  // Mouse events

  alignToVector(normal: Vec3, duration = 400) {
    const camera = this.viewport.getCamera()

    const target = camera.getTargetPosition()
    const dist = camera.getFocalDistance()

    const startXfo = camera.globalXfoParam.getValue()
    const startUp = startXfo.ori.getYaxis()
    startUp.subtractInPlace(normal.scale(startUp.dot(normal)))

    const endUp = new Vec3()
    const calcUpVector = () => {
      if (Math.abs(startUp.x) > Math.abs(startUp.y) && Math.abs(startUp.x) > Math.abs(startUp.z)) {
        if (startUp.x > 0) endUp.x = 1
        else endUp.x = -1
      } else if (Math.abs(startUp.y) > Math.abs(startUp.x) && Math.abs(startUp.y) > Math.abs(startUp.z)) {
        if (startUp.y > 0) endUp.y = 1
        else endUp.y = -1
      } else if (Math.abs(startUp.z) > Math.abs(startUp.x) && Math.abs(startUp.z) > Math.abs(startUp.y)) {
        if (startUp.z > 0) endUp.z = 1
        else endUp.z = -1
      } else {
        console.warn('Invalid Starting Camera Xfo')
        endUp.z = 1
      }
    }

    let manipulator = this.viewport.getManipulator()
    if (manipulator instanceof ToolManager) {
      const toolManager: ToolManager = manipulator
      if ('CameraManipulator' in toolManager.tools) {
        manipulator = toolManager.tools['CameraManipulator']
      } else {
        for (let key in toolManager.tools) {
          if (toolManager.tools[key] instanceof CameraManipulator) {
            manipulator = toolManager.tools[key]
            break
          }
        }
      }
    }
    if (manipulator instanceof CameraManipulator) {
      if (manipulator.defaultManipulationState == CameraManipulator.MANIPULATION_MODES.turntable) {
        if (normal.approxEqual(new Vec3(0, 0, 1)) || normal.approxEqual(new Vec3(0, 0, -1))) {
          calcUpVector()
        } else {
          endUp.z = 1
        }
      } else {
        calcUpVector()
      }
    } else {
      calcUpVector()
    }

    // Calculate the target orientation of the camera.
    const endOri = new Quat()
    endOri.setFromDirectionAndUpvector(normal, endUp)
    endOri.alignWith(startXfo.ori)

    // const endOrtho = 0 //this.viewport. ? 0 : 1
    // if (endOrtho > 0.5 && startOrtho < 0.5) {
    //   // IF we are transitioning to an orthographic projection, we match the orthographic
    //   // view height with the current perspective projection height at the target distance.
    //   // This keeps the framing consistent as we change the camera.
    //   //@ts-ignore
    //   camera.viewHeight = Math.sin(camera.fovParam.value * 0.5) * dist * 2
    // }

    // ////////////////////////////////////////////////////
    // Now blend the camera from the starting values to the end values.

    const count = Math.round(duration / 20) // each step is 20ms
    let id
    let i = 1
    const applyMovement = () => {
      const lerpValue = MathFunctions.smoothStep(0, 1, i / count)

      // interpolate the orientation between the start and the end ones.
      const xfo = new Xfo()
      xfo.ori = startXfo.ori.slerp(endOri, lerpValue).normalize()

      // Move the camera back away from the new target using the orientation.
      const newDir = xfo.ori.getZaxis().negate()
      xfo.tr = target.subtract(newDir.scale(dist))

      camera.globalXfoParam.setValue(xfo)

      i++
      if (i <= count) {
        id = setTimeout(applyMovement, 20)
      } else {
        // This event tells the viewport to re-render the picking buffer.
        camera.emit('movementFinished')
      }
    }
    applyMovement()
  }

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
   * Event fired when a pointing device is moved while the cursor's hotspot is over the handle.
   *
   * @param event - The event param.
   */
  onPointerEnter(event: ZeaPointerEvent): void {
    event.stopPropagation()

    this.highlightedGeom = event.intersectionData!.geomItem as GeomItem
    this.highlightedGeom.materialParam.value = this.highlightedMaterial
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is over the handle.
   *
   * @param event - The event param.
   */
  onPointerLeave(event: ZeaPointerEvent): void {
    event.stopPropagation()

    this.highlightedGeom.materialParam.value = this.normalMaterial
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the handle.
   *
   * @param event - The event param.
   */
  onPointerClick(event: ZeaPointerEvent): void {
    const geomItem = event.intersectionData!.geomItem
    const vec = geomItem.globalXfoParam.value.ori.rotateVec3(new Vec3(0, 0, 1))
    this.alignToVector(vec)
    event.stopPropagation()
  }
}

export { ViewCube }
