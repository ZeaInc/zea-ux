import { CameraManipulator, Color, GLViewport, MathFunctions, Quat, Vec3, Xfo } from '@zeainc/zea-engine'
import { ToolManager } from '../Tools/ToolManager'

// This ViewCube was created while referencing the following tutorial.
// https://3dtransforms.desandro.com/cube
// https://codepen.io/desandro/pen/KRWjzm

class ZeaViewCube extends HTMLElement {
  home: HTMLDivElement
  scene: HTMLDivElement
  cube: HTMLDivElement
  viewport: GLViewport

  faceColor = new Color(1, 0.8, 0.15)
  faceHighlightColor = new Color(1, 0.9, 0.5)
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  private build() {
    this.scene = document.createElement('div')
    this.scene.classList.add('scene')
    this.shadowRoot?.appendChild(this.scene)
    this.cube = document.createElement('div')
    this.cube.classList.add('cube')
    this.scene.appendChild(this.cube)

    const addCubeFace = (name: string, label: string, normal: Vec3) => {
      const cubeFace = document.createElement('div')
      cubeFace.classList.add('cube__face')
      cubeFace.classList.add('cube__face_' + name)
      cubeFace.textContent = label
      cubeFace.addEventListener('click', () => {
        this.alignFace(normal)
      })
      cubeFace.style.background = this.faceColor.toHex()
      this.cube.appendChild(cubeFace)
    }
    addCubeFace('X', 'LEFT', new Vec3(1, 0, 0))
    addCubeFace('-X', 'RIGHT', new Vec3(-1, 0, 0))
    addCubeFace('Y', 'FRONT', new Vec3(0, 1, 0))
    addCubeFace('-Y', 'BACK', new Vec3(0, -1, 0))
    addCubeFace('Z', 'TOP', new Vec3(0, 0, 1))
    addCubeFace('-Z', 'BOTTOM', new Vec3(0, 0, -1))

    const home = document.createElement('div')
    home.classList.add('home')
    this.shadowRoot?.appendChild(home)

    const styleTag = document.createElement('style')
    styleTag.appendChild(
      document.createTextNode(`

.home {
  position: absolute;
  bottom: 0px;
  right: 10px;
  font-family: sans-serif;
}

.scene {
  width: 80px;
  height: 80px;
  border: 0px;
  margin: 10px;
  perspective: 200px;
  font-family: sans-serif;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  user-select: none; /* Non-prefixed version, currently
                            supported by Chrome, Edge, Opera and Firefox */
}

.cube {
  width: 80px;
  height: 80px;
  position: relative;
  transform-style: preserve-3d;
}

.cube__face {
  position: absolute;
  width: 78px;
  height: 78px;
  border: 1px solid black;
  line-height: 78px;
  font-size: 16px;
  color: black;
  text-align: center;
}

.cube__face:hover {
  border: 1px solid white;
  color: white;
}

.cube__face_X   { transform: rotateY(-90deg) translateZ(40px); }
.cube__face_-X  { transform: rotateY( 90deg) translateZ(40px); }
.cube__face_Y  { transform: rotateY(  0deg) translateZ(40px); }
.cube__face_-Y   { transform: rotateY(180deg) translateZ(40px); }
.cube__face_Z    { transform: rotateX( 90deg) translateZ(40px); }
.cube__face_-Z { transform: rotateX(-90deg) translateZ(40px); }
      
`)
    )
    this.shadowRoot?.appendChild(styleTag)
  }

  private alignFace(normal: Vec3, duration = 400) {
    const camera = this.viewport.getCamera()

    const startTarget = camera.getTargetPosition()
    const startDist = camera.getFocalDistance()

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
    }

    // Calculate the target orientation of the camera.
    const endOri = new Quat()
    endOri.setFromDirectionAndUpvector(normal, endUp)
    endOri.alignWith(startXfo.ori)
    const endTarget = startTarget.clone()
    // const endViewHeight = Math.sin(camera.fovParam.value * 0.5) * endDist * 2

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

      // interpolate the target and distance between the start and the end ones.
      const target = startTarget.lerp(endTarget, lerpValue)

      // Move the camera back away from the new target using the orientation.
      const newDir = xfo.ori.getZaxis().negate()
      xfo.tr = target.subtract(newDir.scale(startDist))

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

  private updateViewCubeTransform(xfo: Xfo) {
    const m = xfo.inverse().toMat4()

    // The following matrices will be multiplied right to left, which the following effect.
    // stepBack80px rotateFromNegZupPoZ viewMatrix rotateZUpTpYUp
    const value = `translateZ(-80px) rotateY(180deg) matrix3d(${m.m00},${m.m01},${m.m02},${m.m03},${m.m10},${m.m11},${
      m.m12
    },${m.m13},${m.m20},${m.m21},${m.m22},${m.m23},${0},${0},${0},${1}) rotateX( 90deg)`

    this.cube.style.transform = value
  }

  setViewport(viewport: GLViewport) {
    this.viewport = viewport
    const camera = this.viewport.getCamera()
    this.build()
    this.updateViewCubeTransform(camera.globalXfoParam.value)
    camera.globalXfoParam.on('valueChanged', () => {
      this.updateViewCubeTransform(camera.globalXfoParam.value)
    })
  }
}

if (!customElements.get('zea-view-cube')) {
  customElements.define('zea-view-cube', ZeaViewCube)
}
