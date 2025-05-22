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
    linesItem.pickableParam.value = false
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
      planeLabelItem.pickableParam.value = false
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

  setFaceColor(faceColor: Color, faceHighlightColor: Color): void {
    this.normalMaterial.baseColorParam.value = faceColor
    this.highlightedMaterial.baseColorParam.value = faceHighlightColor
  }

  onPointerEnter(event: ZeaPointerEvent): void {
    event.stopPropagation()

    this.highlightedGeom = event.intersectionData!.geomItem as GeomItem
    this.highlightedGeom.materialParam.value = this.highlightedMaterial
  }

  onPointerLeave(event: ZeaPointerEvent): void {
    event.stopPropagation()

    this.highlightedGeom.materialParam.value = this.normalMaterial
  }
}

export { ViewCube }
