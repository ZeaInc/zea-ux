const { Color } = window.zeaEngine

/**
 * This sample UI class shows how to build a custom UI for VR interfaces.
 *
 * @extends {HTMLElement}
 */
class VRUI extends HTMLElement {
  /**
   * Creates an instance of VRUI.
   */
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    this.contentDiv = document.createElement('div')
    this.contentDiv.id = 'contentDiv'
    shadowRoot.appendChild(this.contentDiv)

    this.buttonsContainer = document.createElement('div')
    this.buttonsContainer.id = 'buttonsContainer'
    this.contentDiv.appendChild(this.buttonsContainer)

    this.toolsContainer = document.createElement('div')
    this.toolsContainer.id = 'toolsContainer'
    this.contentDiv.appendChild(this.toolsContainer)

    this.addButton('data/dustin-w-Undo-icon.png', () => {
      const { UndoRedoManager } = window.zeaUx
      UndoRedoManager.getInstance().undo()
    })
    this.addButton('data/dustin-w-Redo-icon.png', () => {
      const { UndoRedoManager } = window.zeaUx
      UndoRedoManager.getInstance().redo()
    })
    this.addButton('data/Frame-All.png', () => {
      this.appData.renderer.getXRViewport().then((xrvp) => {
        const headXfo = xrvp.getVRHead().getTreeItem().globalXfoParam.value
        const headLocalXfo = xrvp.getVRHead().getXfo()
        const stageXfo = xrvp.getXfo()

        const box3 = this.appData.scene.getRoot().boundingBoxParam.value
        if (!box3.isValid()) {
          console.warn('Bounding box not valid.')
          return
        }
        // Compute the distance the camera should be to fit the entire bounding sphere
        const newTarget = box3.center()
        const focalDistance = box3.size() / 2

        // reset the stage scale.
        stageXfo.sc.set(focalDistance * 1.5, focalDistance * 1.5, focalDistance * 1.5)

        // Calculate the translation to apply to the stage to maintain the current
        // head position after the scale change.
        const newHeadXfo = stageXfo.multiply(headLocalXfo)
        const delta = headXfo.tr.subtract(newHeadXfo.tr)
        stageXfo.tr.addInPlace(delta)

        // apply the delte beteen the head postion and the controller position to the stage.
        const headToTarget = headXfo.tr.subtract(newTarget).normalize().scale(focalDistance)
        const newHeadPos = headToTarget.add(newTarget)
        // const deltaTr = headXfo.tr.subtract(newHeadPos)
        const deltaTr = newHeadPos.subtract(headXfo.tr)
        stageXfo.tr.addInPlace(deltaTr)
        xrvp.setXfo(stageXfo)

        const viewManipulator = this.toolManager.tools['XRViewManipulator']
        if (viewManipulator) {
          viewManipulator.enableViewScale = true
        }
      })
    })

    // let recording = false
    // addButton('data/record-button-off.png', (img) => {
    //   if (!recording) {
    //     img.src = 'data/record-button-on.png'
    //     this.sessionRecorder.startRecording()
    //     recording = true
    //   } else {
    //     img.src = 'data/record-button-off.png'
    //     this.sessionRecorder.stopRecording()
    //     recording = false
    //   }
    // })

    // addButton('data/view_1_1.png', () => {
    //   this.appData.getXRViewport().then((xrvp) => {
    //     const { Ray, Xfo, Vec3 } = window.zeaEngine
    //     const stageXfo = xrvp.getXfo()
    //     const stageScale = stageXfo.sc.z
    //     const headLocalXfo = xrvp.getVRHead().getXfo()
    //     const headXfo = xrvp.getVRHead().getTreeItem().getParameter('GlobalXfo').getValue()

    //     stageXfo.sc.set(1, 1, 1)
    //     const delta = headXfo.tr.subtract(stageXfo.multiply(headLocalXfo).tr)
    //     stageXfo.tr.addInPlace(delta)

    //     // Now cast a ray straight down to te
    //     const ray = new Ray()
    //     ray.start = headXfo.tr
    //     ray.dir.set(0, 0, -1)
    //     const dist = 20 * stageScale
    //     const area = 0.5
    //     const rayXfo = new Xfo()
    //     rayXfo.setLookAt(ray.start, ray.start.add(ray.dir), new Vec3(0, 0, 1))

    //     const result = this.appData.raycast(rayXfo, ray, dist, area)
    //     if (result) {
    //       const worldPos = ray.pointAtDist(result.dist)
    //       console.log('raycast', stageScale, worldPos.z, stageXfo.tr.z)
    //       stageXfo.tr.z += worldPos.z - stageXfo.tr.z
    //     }

    //     xrvp.setXfo(stageXfo)
    //   })
    // })

    const styleTag = document.createElement('style')
    styleTag.appendChild(
      document.createTextNode(`

#contentDiv {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 280px;
  user-select: none;
}

.button {
  border: 2px solid #333333;
  width: 90px;
  height: 90px; 
  border-radius: 50%;
  background-color: #b0b0b0;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-image {
  width: 80px;
  height: 80px; 
}

#buttonsContainer {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
}

.button-hover {
  background: #d0d0d0;
  border: 2px dashed #FF0000;
}

.button-active {
  border: 2px solid #FF0000;
  background: #FFFFFF;
}

.button-mousedown {
  border: 2px solid #FF0000;
  background: #FFFFFF;
}

.label {
  color: black;
}
        `)
    )
    shadowRoot.appendChild(styleTag)
  }

  /**
   * Sets the appData to the UI so it can support VR actions.
   * @param {string} icon
   * @param {function} callback
   * @return {HTMLElement}
   */
  addButton(icon, callback) {
    // const buttonDiv = document.createElement('div')
    const buttonDiv = document.createElement('button')
    buttonDiv.classList.add('button')
    this.buttonsContainer.appendChild(buttonDiv)
    buttonDiv.addEventListener('mouseenter', (event) => {
      buttonDiv.classList.add('button-hover')
      event.stopPropagation()
      event.preventDefault()
    })
    buttonDiv.addEventListener('mouseleave', (event) => {
      buttonDiv.classList.remove('button-hover')
      event.stopPropagation()
      event.preventDefault()
    })
    buttonDiv.addEventListener('mousedown', (event) => {
      buttonDiv.classList.add('button-mousedown')
      if (callback) callback(event)
      event.stopPropagation()
      event.preventDefault()
    })
    buttonDiv.addEventListener('mouseup', (event) => {
      buttonDiv.classList.remove('button-mousedown')
    })
    const img = new Image()
    img.classList.add('button-image')
    img.src = icon
    buttonDiv.appendChild(img)
    return buttonDiv
  }

  /**
   * Sets the appData to the UI so it can support VR actions.
   * @param {GLRenderer} appData
   */
  setAppData(appData) {
    this.appData = appData
  }

  /**
   * Sets the ToolManager to the UI so it can configure the tool buttons.
   * @param {ToolManager} toolManager
   */
  setToolManager(toolManager) {
    this.toolManager = toolManager

    let activeTool = null
    const addToolButton = (tool, icon, callback) => {
      let toolActive = false
      const buttonDiv = this.addButton(icon, (event) => {
        if (callback) callback(!toolActive, event)
        if (!toolActive) {
          if (activeTool) {
            toolManager.removeTool(activeTool)
          }
          if (toolManager.activeToolName() == 'VRUITool') {
            toolManager.insertTool(tool, toolManager.toolStack.length - 1)
          } else {
            toolManager.pushTool(tool)
          }
          activeTool = tool
        } else {
          activeTool = null
          toolManager.removeTool(tool)
        }
      })

      tool.on('activatedChanged', (event) => {
        if (event.activated) {
          if (tool.colorParam) {
            tool.colorParam.setValue(color)
          }

          buttonDiv.classList.add('button-active')
          toolActive = true
        } else {
          buttonDiv.classList.remove('button-active')
          toolActive = false
          if (tool == activeTool) activeTool = null
        }
      })
      return buttonDiv
    }

    const addPointerToolButton = (tool, icon, callback) => {
      const buttonDiv = addToolButton(tool, icon, (activating, event) => {
        if (activating && event.controller) {
          const tool = toolManager.tools['PointerTool']
          tool.pointerController = event.controller
        }

        if (callback) callback(activating, event)
      })
      return buttonDiv
    }

    addPointerToolButton(toolManager.tools['PointerTool'], 'data/laser-pointer.webp')
    addPointerToolButton(toolManager.tools['DropUserTool'], 'data/Maps-Street-View-icon.png')
    addToolButton(toolManager.tools['VRHoldObjectsTool'], 'data/grab-icon.png')
    addToolButton(toolManager.tools['HandHeldTool'], 'data/wrench-icon.png', (activating, event) => {
      if (activating && event.controller) {
        const tool = toolManager.tools['HandHeldTool']
        tool.toolController = event.controller
      }
    })
    addToolButton(toolManager.tools['FreehandLineTool'], 'data/pen-tool.png')
    addPointerToolButton(toolManager.tools['EraserTool'], 'data/eraser.png', (activating, event) => {
      if (activating && event.controller) {
        const tool = toolManager.tools['HandHeldTool']
        tool.toolController = event.controller
      }
    })
    // addToolButton('Create Cuboid', 'data/create-cuboid-icon.png')
    // addToolButton('Create Sphere', 'data/create-sphere-icon.png')
    // addToolButton('Create Cone', 'data/create-cone-icon.png')

    let activeButtonDiv
    let color = new Color('#FFD800')
    const addColorButton = (icon, cb) => {
      const buttonDiv = this.addButton(icon, () => {
        if (activeButtonDiv) {
          activeButtonDiv.classList.remove('button-active')
        }
        buttonDiv.classList.add('button-active')
        activeButtonDiv = buttonDiv
      })
    }

    addColorButton('data/color-red.png', () => {
      color = new Color(1, 0, 0)
    })
    addColorButton('data/color-green.png', () => {
      color = new Color(0, 1, 0)
    })
    addColorButton('data/color-blue.png', () => {
      color = new Color(0, 0, 1)
    })
    addColorButton('data/color-yellow.png', () => {
      color = new Color('#FFD800')
    })
  }

  /**
   * Sets the sessionRecorder to the UI so it can make recordings of VR sessions.
   * @param {SessionRecorder} sessionRecorder
   */
  setSessionRecorder(sessionRecorder) {
    this.sessionRecorder = sessionRecorder
  }
}
window.customElements.define('vr-ui', VRUI)
