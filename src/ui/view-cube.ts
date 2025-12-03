import {
  Camera,
  CameraManipulator,
  Color,
  GLRenderer,
  GLViewport,
  MathFunctions,
  Quat,
  Scene,
  Vec3,
  Xfo,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import { ToolManager } from '../Tools/ToolManager'
import { ViewCube } from '../Handles/ViewCube'

class ZeaViewCubeElement extends HTMLElement {
  private div: HTMLDivElement
  private scene: Scene = new Scene()
  private sceneViewport: GLViewport
  private viewCubeCamera: Camera
  private viewCube: ViewCube
  private canvas: HTMLCanvasElement
  private movingViewCubeCamera: boolean = false

  constructor() {
    super()
  }

  connectedCallback() {
    this.div = document.createElement('div')
    this.canvas = document.createElement('canvas')
    this.div.appendChild(this.canvas)
    this.div.style.width = '100%'
    this.div.style.height = '100%'
    this.appendChild(this.div)

    const renderer = new GLRenderer(this.canvas, { antialias: true })
    renderer.getViewport().backgroundColorParam.value = new Color(1, 1, 1, 0)

    this.viewCubeCamera = renderer.getViewport().getCamera()
    this.viewCubeCamera.focalDistanceParam.value = 2.75

    const updateSceneCameraXfo = () => {
      if (!this.movingViewCubeCamera && this.sceneViewport) {
        const viewCubeCameraXfo = this.viewCubeCamera.globalXfoParam.value

        const camera = this.sceneViewport.getCamera()
        const target = camera.focalPointParam.value
        const dist = camera.focalDistanceParam.value

        const xfo = camera.globalXfoParam.value.clone()
        xfo.ori = viewCubeCameraXfo.ori.clone()

        // Move the camera back away from the new target using the orientation.
        const newDir = xfo.ori.getZaxis().negate()
        xfo.tr = target.subtract(newDir.scale(dist))

        camera.globalXfoParam.value = xfo
      }
    }

    this.viewCubeCamera.globalXfoParam.on('valueChanged', updateSceneCameraXfo)

    renderer.setScene(this.scene)
  }

  private alignSceneCameraToVector(normal: Vec3, duration = 400) {
    const camera = this.sceneViewport.getCamera()

    const target = camera.focalPointParam.value
    const dist = camera.focalDistanceParam.value

    const startXfo = camera.globalXfoParam.value
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

    let manipulator = this.sceneViewport.getManipulator()
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

    // ////////////////////////////////////////////////////
    // Now blend the camera from the starting values to the end values.

    const count = Math.round(duration / 20) // each step is 20ms
    let id
    let i = 1
    const applyMovement = () => {
      const lerpValue = count > 0 ? MathFunctions.smoothStep(0, 1, i / count) : 1.0

      // interpolate the orientation between the start and the end ones.
      const xfo = new Xfo()
      xfo.ori = startXfo.ori.slerp(endOri, lerpValue).normalize()

      // Move the camera back away from the new target using the orientation.
      const newDir = xfo.ori.getZaxis().negate()
      xfo.tr = target.subtract(newDir.scale(dist))

      camera.globalXfoParam.value = xfo

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

  init(
    viewport: GLViewport,
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
  ): void {
    this.viewCube = new ViewCube(
      faceColor,
      faceHighlightColor,
      fontColor,
      font,
      size,
      edgeBorderRatio,
      fontSize,
      margin,
      labels
    )
    this.viewCube.on('pointerClick', (event: ZeaPointerEvent) => {
      const geomItem = event.intersectionData!.geomItem
      const vec = geomItem.globalXfoParam.value.ori.rotateVec3(new Vec3(0, 0, 1))
      this.alignSceneCameraToVector(vec)
      event.stopPropagation()
    })
    this.scene.getRoot().addChild(this.viewCube)

    this.sceneViewport = viewport

    const camera = this.sceneViewport.getCamera()
    const updateViewCubeCameraXfo = () => {
      this.movingViewCubeCamera = true
      const focalDistance = this.viewCubeCamera.focalDistanceParam.value
      const sceneCameraXfo = camera.globalXfoParam.value
      const xfo = new Xfo()
      xfo.ori = sceneCameraXfo.ori.clone()
      xfo.tr.addInPlace(sceneCameraXfo.ori.getZaxis().scale(focalDistance))
      this.viewCubeCamera.globalXfoParam.value = xfo
      this.movingViewCubeCamera = false
    }

    updateViewCubeCameraXfo()
    camera.globalXfoParam.on('valueChanged', updateViewCubeCameraXfo)
    camera.on('movementFinished', () => {
      // This event tells the viewport to re-render the picking buffer.
      this.viewCubeCamera.emit('movementFinished')
    })
  }
}

if (!customElements.get('zea-view-cube')) {
  customElements.define('zea-view-cube', ZeaViewCubeElement)
}

export { ZeaViewCubeElement }
