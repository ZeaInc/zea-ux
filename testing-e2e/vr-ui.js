const { Ray, Xfo, Vec3, Color } = window.zeaEngine
class VRUI extends HTMLElement {
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
      const buttonDiv = document.createElement('div')
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
    addButton('data/view_1_1.png', (img) => {
      this.renderer.getXRViewport().then((xrvp) => {
        const stageXfo = xrvp.getXfo()
        const headLocalXfo = xrvp.getVRHead().getXfo()
        const headXfo = xrvp.getVRHead().getTreeItem().getParameter('GlobalXfo').getValue()
        // const curreHeadHeight = stageXfo.tr.z + stageXfo.sc.z * 1.7
        // stageXfo.tr.z = curreHeadHeight - 1.7
        // const curreHeadPos = stageXfo.tr.add(new Vec3(0, 0, 1.7 * stageXfo.sc.z))
        stageXfo.sc.set(1, 1, 1)
        // const delta = stageXfo.multiply(headLocalXfo).tr.subtract(headXfo.tr)
        const delta = headXfo.tr.subtract(stageXfo.multiply(headLocalXfo).tr)
        stageXfo.tr.addInPlace(delta)

        // Now cast a ray straight down to te
        const ray = new Ray()
        ray.start = headXfo.tr
        ray.dir.set(0, 0, -1)
        const dist = 10
        const area = 0.5
        const rayXfo = new Xfo()
        rayXfo.setLookAt(ray.start, ray.start.add(ray.dir), new Vec3(0, 0, 1))

        const result = this.renderer.raycast(rayXfo, ray, dist, area)
        if (result) {
          const worldPos = ray.pointAtDist(result.dist)
          stageXfo.tr.z += worldPos.z - stageXfo.tr.z
        }

        xrvp.setXfo(stageXfo)
      })
    })

    const styleTag = document.createElement('style')
    styleTag.appendChild(
      document.createTextNode(`

#contentDiv {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 280px;
}

.button {
  border: 2px solid #333333;
  width: 90px;
  height: 90px; 
  border-radius: 15px;
  background-color: #FFFFFF;
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

#toolsContainer {
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  display: inline-block;
}
.tool {
  border: 2px solid #333333;
  width: 90px;
  height: 90px; 
  border-radius: 15px;
  background-color: #FFFFFF;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-hover {
  background: #D8D8D8;
}

.button-active {
  background: #C1C1C1;
}

.label {
  color: black;
}
        `)
    )
    shadowRoot.appendChild(styleTag)
  }

  setRenderer(renderer) {
    this.renderer = renderer
  }

  setToolManager(toolManager) {
    this.toolManager = toolManager

    const addToolButton = (name, icon) => {
      const tool = toolManager.tools[name]
      const toolDiv = document.createElement('div')
      toolDiv.classList.add('tool')
      let toolActive = false
      toolDiv.addEventListener('mousedown', () => {
        if (!toolActive) {
          while (toolManager.activeToolName() != 'VRUITool') toolManager.popTool()
          toolManager.pushTool(name)
        } else {
          while (toolManager.activeToolName() != name) toolManager.popTool()
          if (toolManager.activeToolName() == name) toolManager.popTool()
        }
      })

      tool.on('activatedChanged', (event) => {
        if (event.activated) {
          if (tool.colorParam) tool.colorParam.setValue(color)

          toolDiv.classList.add('button-active')
          toolActive = true
        } else {
          toolDiv.classList.remove('button-active')
          toolActive = false
        }
      })

      toolDiv.addEventListener('mouseenter', () => {
        toolDiv.classList.add('button-hover')
      })

      toolDiv.addEventListener('mouseleave', () => {
        toolDiv.classList.remove('button-hover')
      })

      this.buttonsContainer.appendChild(toolDiv)

      if (icon) {
        const img = new Image()
        img.classList.add('button-image')
        img.src = icon
        toolDiv.appendChild(img)
      } else {
        const toolLabelSpan = document.createElement('span')
        toolLabelSpan.classList.add('label')
        const toolLabel = document.createTextNode(name)
        toolDiv.appendChild(toolLabelSpan)
        toolLabelSpan.appendChild(toolLabel)
      }
    }

    // for (const key in toolManager.tools) {
    //   if (key == 'VRViewManipulator') continue
    //   if (key == 'VRHoldObjectsTool') continue
    //   addToolButton(key)
    // }
    addToolButton('VRHoldObjectsTool', 'data/grab-icon.png')
    addToolButton('Freehand Line Tool', 'data/pen-tool.png')
    addToolButton('Create Cuboid', 'data/create-cuboid-icon.png')
    addToolButton('Create Sphere', 'data/create-sphere-icon.png')
    addToolButton('Create Cone', 'data/create-cone-icon.png')

    let color = new Color('#FFD800')
    const addColorButton = (icon, cb) => {
      const buttonDiv = document.createElement('div')
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

        const tool = toolManager.activeTool()
        if (tool && tool.colorParam) tool.colorParam.setValue(color)
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
  setSessionRecorder(sessionRecorder) {
    this.sessionRecorder = sessionRecorder
  }
}
window.customElements.define('vr-ui', VRUI)
