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
  Cuboid,
  LinesCuboid,
} from '@zeainc/zea-engine'

class ViewCube extends TreeItem {
  private viewport: GLViewport
  private faceMaterial = new FlatSurfaceMaterial('material')
  private highlightedMaterial = new FlatSurfaceMaterial('material')
  private highlightedGeom: GeomItem
  /**
   * Create an axial rotation scene widget.
   *
   * @param size - The size value.
   */
  constructor(
    faceColor = new Color(1, 0.8, 0.15),
    faceHighlightColor = new Color(1, 0.9, 0.5),
    fontColor = new Color(0, 0, 0),
    font = 'Verdana',
    size = 1,
    edgeBorderRatio = 0.15,
    fontSize = 50,
    margin = 10,
    labels: Record<string, string> = {
      YPos: 'FRONT',
      YNeg: 'BACK',
      XPos: 'LEFT',
      XNeg: 'RIGHT',
      ZPos: 'TOP',
      ZNeg: 'BOTTOM',
    }
  ) {
    super('ViewCube')

    this.faceMaterial.baseColorParam.value = faceColor
    this.highlightedMaterial.baseColorParam.value = faceHighlightColor

    const up = new Vec3(0, 0, 1)

    const marginSize = size * edgeBorderRatio
    const plane = new Plane(size - marginSize * 2, size - marginSize * 2)
    const cornerCuboid = new Cuboid(marginSize, marginSize, marginSize, false)
    const edgeCuboid = new Cuboid(marginSize, size - marginSize * 2, marginSize, false)

    const linesMaterial = new FlatSurfaceMaterial('material')
    linesMaterial.baseColorParam.value = new Color(0.1, 0.1, 0.1, 1)
    const lines = new LinesCuboid(size, size, size, false)

    const linesItem = new GeomItem('borderlines', lines, linesMaterial)
    linesItem.pickableParam.value = false
    this.addChild(linesItem, false, false)

    const buildFace = (quat: Quat, name: string) => {
      const xfo = new Xfo()
      xfo.ori = quat
      xfo.tr = quat.rotateVec3(new Vec3(0, 0, size * 0.5))

      const planeItem = new GeomItem('face' + name, plane, this.faceMaterial, xfo)
      this.addChild(planeItem, false, false)

      const label = new Label(name)
      label.fontParam.value = font
      label.fontColorParam.value = fontColor
      label.fontSizeParam.value = fontSize
      label.backgroundColorParam.value = faceColor
      label.fillBackgroundParam.value = false
      label.marginParam.value = margin
      label.outlineColorParam.value = faceColor
      label.strokeBackgroundOutlineParam.value = false
      // Mip mapping just makes the font blurrier.
      // label.mipMapped = true
      // label.magFilter = 'LINEAR_MIPMAP_LINEAR'
      label.textParam.value = labels[name]

      const labelMaterial = new FlatSurfaceMaterial('material')
      labelMaterial.baseColorParam.value = faceColor
      labelMaterial.baseColorParam.setImage(label)

      const planeLabelItem = new GeomItem('face' + name, plane, labelMaterial, new Xfo(new Vec3(0, 0, 0.001)))
      planeLabelItem.pickableParam.value = false
      planeItem.addChild(planeLabelItem, false, false)
      label.once('labelRendered', (event: any) => {
        const xfo = planeLabelItem.localXfoParam.value
        xfo.sc.x = event.width / 160
        xfo.sc.y = event.height / 100
        planeLabelItem.localXfoParam.value = xfo
      })
    }

    const eulerYPos = new EulerAngles(MathFunctions.degToRad(-90), 0, MathFunctions.degToRad(180))
    buildFace(eulerYPos.toQuat(), 'YPos')
    const eulerYNeg = new EulerAngles(MathFunctions.degToRad(90), 0, 0)
    buildFace(eulerYNeg.toQuat(), 'YNeg')

    const eulerXPos = new EulerAngles(0, MathFunctions.degToRad(90), MathFunctions.degToRad(90))
    buildFace(eulerXPos.toQuat(), 'XPos')
    const eulerXNeg = new EulerAngles(0, MathFunctions.degToRad(-90), MathFunctions.degToRad(-90))
    buildFace(eulerXNeg.toQuat(), 'XNeg')

    const eulerZPos = new EulerAngles(0, 0, MathFunctions.degToRad(180))
    buildFace(eulerZPos.toQuat(), 'ZPos')
    const eulerZNeg = new EulerAngles(0, MathFunctions.degToRad(-180), 0)
    buildFace(eulerZNeg.toQuat(), 'ZNeg')

    // /////////////////////
    // Corners
    const buildCorner = (vec3: Vec3, text: string) => {
      const xfo = new Xfo()
      xfo.tr = vec3.scale(size * 0.5)
      xfo.tr.subtractInPlace(vec3.scale(marginSize * 0.5))
      xfo.ori.setFromDirectionAndUpvector(xfo.tr.normalize(), up)

      const cornerItem = new GeomItem('corner' + text, cornerCuboid, this.faceMaterial, xfo)

      const geomOffsetXfo = new Xfo()
      geomOffsetXfo.ori = xfo.ori.inverse()
      cornerItem.geomOffsetXfoParam.value = geomOffsetXfo

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

      const edgeItem = new GeomItem('edge' + text, edgeCuboid, this.faceMaterial, xfo)

      const geomOffsetXfo = new Xfo()
      geomOffsetXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), MathFunctions.degToRad(45))
      edgeItem.geomOffsetXfoParam.value = geomOffsetXfo

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

  onPointerEnter(event: ZeaPointerEvent): void {
    event.stopPropagation()

    this.highlightedGeom = event.intersectionData!.geomItem as GeomItem
    this.highlightedGeom.materialParam.value = this.highlightedMaterial
  }

  onPointerLeave(event: ZeaPointerEvent): void {
    event.stopPropagation()

    this.highlightedGeom.materialParam.value = this.faceMaterial
  }
}

export { ViewCube }
