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

    const addButton = (icon, cb) => {
      // const buttonDiv = document.createElement('div')
      const buttonDiv = document.createElement('button')
      buttonDiv.classList.add('button')
      this.buttonsContainer.appendChild(buttonDiv)
      buttonDiv.addEventListener('mouseenter', () => {
        buttonDiv.classList.add('button-hover')
      })
      buttonDiv.addEventListener('mouseleave', () => {
        buttonDiv.classList.remove('button-hover')
      })
      buttonDiv.addEventListener('mousedown', () => {
        buttonDiv.classList.add('button-active')
        cb(img)
      })
      buttonDiv.addEventListener('mouseup', () => {
        buttonDiv.classList.remove('button-active')
      })
      const img = new Image()
      img.classList.add('button-image')
      img.src = icon
      buttonDiv.appendChild(img)
    }
    addButton('data/dustin-w-Undo-icon.png', () => {
      const { UndoRedoManager } = window.zeaUx
      UndoRedoManager.getInstance().undo()
    })
    addButton('data/dustin-w-Redo-icon.png', () => {
      const { UndoRedoManager } = window.zeaUx
      UndoRedoManager.getInstance().redo()
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
    //   this.renderer.getXRViewport().then((xrvp) => {
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

    //     const result = this.renderer.raycast(rayXfo, ray, dist, area)
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
   * Sets the renderer to the UI so it can support VR actions.
   * @param {GLRenderer} renderer
   */
  setRenderer(renderer) {
    this.renderer = renderer
  }

  /**
   * Sets the ToolManager to the UI so it can configure the tool buttons.
   * @param {ToolManager} toolManager
   */
  setToolManager(toolManager) {
    this.toolManager = toolManager

    let activeTool = null

    const addToolButton = (name, icon) => {
      const tool = toolManager.tools[name]
      const elem = document.createElement('button')
      elem.classList.add('button')
      let toolActive = false
      elem.addEventListener('mousedown', (event) => {
        elem.classList.add('button-mousedown')
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
        event.stopPropagation()
        event.preventDefault()
      })

      elem.addEventListener('mouseup', (event) => {
        elem.classList.remove('button-mousedown')
        event.stopPropagation()
        event.preventDefault()
      })

      tool.on('activatedChanged', (event) => {
        if (event.activated) {
          if (tool.colorParam) {
            tool.colorParam.setValue(color)
          }

          elem.classList.add('button-active')
          toolActive = true
        } else {
          elem.classList.remove('button-active')
          toolActive = false
        }
      })

      elem.addEventListener('mouseenter', (event) => {
        elem.classList.add('button-hover')
        event.stopPropagation()
        event.preventDefault()
      })

      elem.addEventListener('mouseleave', (event) => {
        elem.classList.remove('button-hover')
        event.stopPropagation()
        event.preventDefault()
      })

      this.buttonsContainer.appendChild(elem)

      if (icon) {
        const img = new Image()
        img.classList.add('button-image')
        img.src = icon
        elem.appendChild(img)
      } else {
        const toolLabelSpan = document.createElement('span')
        toolLabelSpan.classList.add('label')
        const toolLabel = document.createTextNode(name)
        elem.appendChild(toolLabelSpan)
        toolLabelSpan.appendChild(toolLabel)
      }
    }

    // for (const key in toolManager.tools) {
    //   if (key == 'VRViewManipulator') continue
    //   if (key == 'VRHoldObjectsTool') continue
    //   addToolButton(key)
    // }
    addToolButton('dropUserTool', 'data/Maps-Street-View-icon.png')
    addToolButton('VRHoldObjectsTool', 'data/grab-icon.png')
    addToolButton('HandHeldTool', 'data/wrench-icon.png')
    addToolButton('Freehand Line Tool', 'data/pen-tool.png')
    // addToolButton('Create Cuboid', 'data/create-cuboid-icon.png')
    // addToolButton('Create Sphere', 'data/create-sphere-icon.png')
    // addToolButton('Create Cone', 'data/create-cone-icon.png')

    let color = new Color('#FFD800')
    const addColorButton = (icon, cb) => {
      const buttonDiv = document.createElement('button')
      buttonDiv.classList.add('button')
      this.buttonsContainer.appendChild(buttonDiv)
      buttonDiv.addEventListener('mouseenter', () => {
        buttonDiv.classList.add('button-hover')
      })
      buttonDiv.addEventListener('mouseleave', () => {
        buttonDiv.classList.remove('button-hover')
      })
      buttonDiv.addEventListener('mousedown', () => {
        activeButtonDiv.classList.remove('button-active')
        buttonDiv.classList.add('button-active')
        activeButtonDiv = buttonDiv
        cb(buttonDiv)

        if (activeTool && activeTool.colorParam) {
          activeTool.colorParam.setValue(color)
        }
      })
      buttonDiv.addEventListener('mouseup', () => {})
      const img = new Image()
      img.classList.add('button-image')
      img.src = icon
      buttonDiv.appendChild(img)
      return buttonDiv
    }

    addColorButton('data/color-red.png', (buttonDiv) => {
      color = new Color(1, 0, 0)
    })
    addColorButton('data/color-green.png', (buttonDiv) => {
      color = new Color(0, 1, 0)
    })
    addColorButton('data/color-blue.png', (buttonDiv) => {
      color = new Color(0, 0, 1)
    })
    let activeButtonDiv = addColorButton('data/color-yellow.png', (buttonDiv) => {
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
