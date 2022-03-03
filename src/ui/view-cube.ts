import { Camera, CameraManipulator, GLViewport, Mat3, Mat4, MathFunctions, Quat, Vec3, Xfo } from '@zeainc/zea-engine'

let currentClass: string = null
class ZeaViewCube extends HTMLElement {
  scene: HTMLDivElement
  cube: HTMLDivElement
  viewport: GLViewport
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    this.scene = document.createElement('div')
    this.scene.classList.add('scene')
    this.shadowRoot?.appendChild(this.scene)
    this.cube = document.createElement('div')
    this.cube.classList.add('cube')
    this.scene.appendChild(this.cube)

    const addCubeFace = (name: string, normal: Vec3) => {
      const cubeFace = document.createElement('div')
      cubeFace.classList.add('cube__face')
      cubeFace.classList.add('cube__face_' + name)
      cubeFace.textContent = name
      cubeFace.addEventListener('click', () => {
        this.alignFace(normal)
      })
      this.cube.appendChild(cubeFace)
    }
    addCubeFace('X', new Vec3(1, 0, 0))
    addCubeFace('-X', new Vec3(-1, 0, 0))
    addCubeFace('Y', new Vec3(0, 1, 0))
    addCubeFace('-Y', new Vec3(0, -1, 0))
    addCubeFace('Z', new Vec3(0, 0, 1))
    addCubeFace('-Z', new Vec3(0, 0, -1))

    const styleTag = document.createElement('style')
    styleTag.appendChild(
      document.createTextNode(`

      .scene {
        width: 80px;
        height: 80px;
        border: 0px;
        margin: 20px;
        perspective: 800px;
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
        transform: translateZ(-80px);
      }
      
      .cube__face {
        position: absolute;
        width: 76px;
        height: 76px;
        border: 2px solid black;
        line-height: 76px;
        font-size: 20px;
        font-weight: bold;
        color: black;
        text-align: center;
      }
      
      .cube__face:hover {
        border: 2px solid white;
        color: white;
      }
      
      .cube__face_X   { background: rgba(255, 0, 0, 0.85); }
      .cube__face_-X  { background: rgba(255, 0, 0, 0.85); }
      .cube__face_Y  { background: rgba(  0, 255, 0, 0.85); }
      .cube__face_-Y   { background: rgba(  0, 255, 0, 0.85); }
      .cube__face_Z    { background: rgba(0, 0, 255, 0.85); }
      .cube__face_-Z { background: rgba(0, 0, 255, 0.85); }
      
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

  alignFace(normal: Vec3, duration = 400) {
    const camera = this.viewport.getCamera()

    const startTarget = camera.getTargetPosition()
    const startDist = camera.getFocalDistance()

    const startXfo = camera.globalXfoParam.getValue()
    const startUp = startXfo.ori.getYaxis()
    // const startViewHeight = Math.sin(camera.fovParam.value * 0.5) * startDist * 2
    const startOrtho = camera.isOrthographicParam.value

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

    const manipulator = this.viewport.getManipulator()
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
    const endDist = startDist
    // const endViewHeight = Math.sin(camera.fovParam.value * 0.5) * endDist * 2

    const endOrtho = 1
    if (endOrtho > 0.5 && startOrtho < 0.5) {
      // IF we are transitioning to an orthographic projection, we match the orthographic
      // view height with the current perspective projection height at the target distance.
      // This keeps the framing consistent as we change the camera.
      //@ts-ignore
      camera.viewHeight = Math.sin(camera.fovParam.value * 0.5) * startDist * 2
    }

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
      const dist = MathFunctions.lerp(startDist, endDist, lerpValue)

      // Move the camera back away from the new target using the orientation.
      const newDir = xfo.ori.getZaxis().negate()
      xfo.tr = target.subtract(newDir.scale(dist))

      camera.globalXfoParam.setValue(xfo)
      camera.setFocalDistance(dist)
      if ((endOrtho > 0.5 && startOrtho < 0.5) || (endOrtho < 0.5 && startOrtho > 0.5)) {
        const ortho = MathFunctions.lerp(startOrtho, endOrtho, lerpValue)

        // Also set the perspective value on the viewcube itself.
        if (endOrtho > 0.5) this.scene.style.perspective = `none`
        else this.scene.style.perspective = `800px`

        camera.setIsOrthographic(ortho, 0)
      }

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

  updateViewCubeTransform(xfo: Xfo) {
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
    this.updateViewCubeTransform(camera.globalXfoParam.value)
    camera.globalXfoParam.on('valueChanged', () => {
      this.updateViewCubeTransform(camera.globalXfoParam.value)
    })
  }
}

customElements.define('zea-view-cube', ZeaViewCube)
