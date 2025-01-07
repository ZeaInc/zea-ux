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

    const faceVectors = {
      '+x': new Vec3(1, 0, 0),
      '-x': new Vec3(-1, 0, 0),
      '+y': new Vec3(0, 1, 0),
      '-y': new Vec3(0, -1, 0),
      '+z': new Vec3(0, 0, 1),
      '-z': new Vec3(0, 0, -1),
    }
    const edgeVectors = {
      '+x+y': new Vec3(1, 1, 0),
      '+x-y': new Vec3(1, -1, 0),
      '-x+y': new Vec3(-1, 1, 0),
      '-x-y': new Vec3(-1, -1, 0),
      '+y+z': new Vec3(0, 1, 1),
      '-y-z': new Vec3(0, -1, -1),
      '-y+z': new Vec3(0, -1, 1),
      '+x+z': new Vec3(1, 0, 1),
      '+x-z': new Vec3(1, 0, -1),
      '-x-z': new Vec3(-1, 0, -1),
      '-x+z': new Vec3(-1, 0, 1),
      '+y-z': new Vec3(0, 1, -1),
    }
    const cornerVectors = {
      '+x+y+z': new Vec3(1, 1, 1),
      '+x-y+z': new Vec3(1, -1, 1),
      '-x+y+z': new Vec3(-1, 1, 1),
      '-x-y+z': new Vec3(-1, -1, 1),
      '+x+y-z': new Vec3(1, 1, -1),
      '+x-y-z': new Vec3(1, -1, -1),
      '-x+y-z': new Vec3(-1, 1, -1),
      '-x-y-z': new Vec3(-1, -1, -1),
    }
    const faceQuats = {
      '+x': new Quat(0, 0.7071, 0, 0.7071),
      '-x': new Quat(0, -0.7071, 0, 0.7071),
      '+y': new Quat(-0.7071, 0, 0, 0.7071),
      '-y': new Quat(0.7071, 0, 0, 0.7071),
      '+z': new Quat(0, 0, 0, 1),
      '-z': new Quat(0, 1, 0, 0),
    }

    const addCubeFace = (label: string, normal: Vec3) => {
      const cubeFace = document.createElement('div')
      cubeFace.classList.add('face')
      cubeFace.classList.add(label)
      cubeFace.textContent = label.toUpperCase()
      cubeFace.addEventListener('click', (event) => {
        console.log('click', event)
        this.alignFace(normal.normalize())
        event.stopPropagation()
      })
      // cubeFace.style.background = this.faceColor.toHex()
      this.cube.appendChild(cubeFace)

      // addCubeBorder(cubeFace, 'border-top', top)
      // addCubeBorder(cubeFace, 'border-bottom', bottom)
      // addCubeBorder(cubeFace, 'border-left', left)
      // addCubeBorder(cubeFace, 'border-right', right)

      // addCubeCorner(cubeFace, 'corner-tl')
      // addCubeCorner(cubeFace, 'corner-tr')
      // addCubeCorner(cubeFace, 'corner-bl')
      // addCubeCorner(cubeFace, 'corner-br')
    }
    addCubeFace('left', faceVectors['+x'])
    addCubeFace('right', faceVectors['-x'])
    addCubeFace('front', faceVectors['+y'])
    addCubeFace('back', faceVectors['-y'])
    addCubeFace('top', faceVectors['+z'])
    addCubeFace('bottom', faceVectors['-z'])

    const addCubeBorderFace = (borderDiv: HTMLDivElement, classStr: string, normal: Vec3) => {
      const borderFaceDiv = document.createElement('div')
      borderFaceDiv.classList.add('border-face')
      borderFaceDiv.classList.add(classStr)
      borderFaceDiv.addEventListener('click', (event) => {
        this.alignFace(normal.normalize())
        event.stopPropagation()
      })
      // borderFaceDiv.style.background = this.faceColor.toHex()
      borderDiv.appendChild(borderFaceDiv)
    }
    const addCubeBorder = (classStr: string, borderClassStr: string[], normal: Vec3) => {
      const borderDiv = document.createElement('div')
      borderDiv.classList.add('border')
      borderDiv.classList.add(classStr)
      this.cube.appendChild(borderDiv)
      addCubeBorderFace(borderDiv, borderClassStr[0], normal)
      addCubeBorderFace(borderDiv, borderClassStr[1], normal)
    }
    addCubeBorder('border-xy', ['border-front', 'border-right'], edgeVectors['-x+y'])
    addCubeBorder('border--xy', ['border-front', 'border-left'], edgeVectors['+x+y'])
    addCubeBorder('border-x-y', ['border-back', 'border-left'], edgeVectors['+x-y'])
    addCubeBorder('border--x-y', ['border-back', 'border-right'], edgeVectors['-x-y'])
    addCubeBorder('border-yz', ['border-front', 'border-top'], edgeVectors['+y+z'])
    addCubeBorder('border-y-z', ['border-front', 'border-bottom'], edgeVectors['+y-z'])
    addCubeBorder('border-xz', ['border-right', 'border-top'], edgeVectors['-x+z'])

    // const borderDivXY = document.createElement('div')
    // borderDivXY.classList.add('border')
    // borderDivXY.classList.add('border-xy')
    // this.cube.appendChild(borderDivXY)
    // addCubeBorderFace(borderDivXY, 'border-front', edgeVectors['-x+y'])
    // addCubeBorderFace(borderDivXY, 'border-right', edgeVectors['-x+y'])

    // const borderDivnegXY = document.createElement('div')
    // borderDivnegXY.classList.add('border')
    // borderDivnegXY.classList.add('border--xy')
    // this.cube.appendChild(borderDivnegXY)
    // addCubeBorderFace(borderDivnegXY, 'border-front', edgeVectors['+x+y'])
    // addCubeBorderFace(borderDivnegXY, 'border-left', edgeVectors['+x+y'])

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
  position: relative;
  width: 80px;
  height: 80px;
  transform-style: preserve-3d;
  background: rgba(200, 200, 200, 1);
}

.face {
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgba(200, 200, 200, 1);
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.0rem;
  font-weight: bold;
  cursor: pointer;
}
.face:hover {
  background: rgba(255, 255, 255, 1);
}

/* Position each face */
.front { transform: translateZ(50px);  }
.back { transform: rotateY(180deg) translateZ(50px);  }
.left { transform: rotateY(-90deg) translateZ(50px);  }
.right { transform: rotateY(90deg) translateZ(50px);  }
.top { transform: rotateX(90deg) translateZ(50px);  }
.bottom { transform: rotateX(-90deg) translateZ(50px);  }

/* Clickable edge borders */
.border {
  position: absolute;
  background: rgba(200, 200, 200, 1);
  border: none;
  cursor: pointer;
  border: none;
  transform-style: preserve-3d;
}
.border:hover {
  background: rgba(255, 255, 255, 1);
}
  
.border-xy { 
  width: 10px;
  height: 80px;
  transform: translate3d(80px, 0px, 45px);
}

.border--xy { 
  width: 10px;
  height: 80px;
  transform: translate3d(-10px, 0px, 45px);
}

.border-x-y { 
  width: 10px;
  height: 80px;
  transform: translate3d(-10px, 0px, -45px);
}

.border--x-y { 
  width: 10px;
  height: 80px;
  transform: translate3d(80px, 0px, -45px);
}

.border-yz { 
  width: 80px;
  height: 10px;
  transform: translate3d(0px, -10px, 45px);
}

.border-y-z { 
  width: 80px;
  height: 10px;
  transform: translate3d(0px, 80px, 45px);
}

.border-xz { 
  width: 10px;
  height: 80px;
  transform: translate3d(45px, -10px, 0px);
}


.border-face { 
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border: 1px solid #000000;
}


/* Position each border-face */
.border-front { transform: translate3d(0px, 0px, 5px);  }
.border-back { transform: rotateY(180deg) translate3d(0px, 0px, 5px);  }
.border-left { transform: rotateY(-90deg) translate3d(0px, 0px, 5px);  }
.border-right { transform: rotateY(90deg) translate3d(0px, 0px, 5px);  }
.border-top { transform: rotateX(90deg) translate3d(0px, 0px, 5px);  }
.border-bottom { transform: rotateX(-90deg) translate3d(0px, 0px, 5px);  }



/* Mini corner cubes */
.corner {
  position: absolute;
  width: 10px; /* 1/10 of main cube size */
  height: 10px; /* 1/10 of main cube size */
  background: rgba(200, 200, 200, 1);
  border: 1px solid #000000;
  cursor: pointer;
  transform-style: preserve-3d;
}
.corner:hover {
  background: rgba(255, 255, 255, 1);
}

/* Corner positioning for the front face */
.corner-tl { top: -10px; left: -10px; }
.corner-tr { top: -10px; right: -10px; }
.corner-bl { bottom: -10px; left: -10px; }
.corner-br { bottom: -10px; right: -10px; }



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

customElements.define('zea-view-cube', ZeaViewCube)
