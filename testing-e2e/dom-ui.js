const { Ray, Xfo, Vec3, Color } = window.zeaEngine

/**
 * This sample UI class shows how to build a custom UI for VR interfaces.
 *
 * @extends {HTMLElement}
 */
class DomUI extends HTMLElement {
  /**
   * Creates an instance of DomUI.
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
      const button = document.createElement('button')
      button.classList.add('button')
      button.classList.add('widget')
      this.buttonsContainer.appendChild(button)
      button.addEventListener('mouseenter', () => {
        button.classList.add('button-hover')
      })
      button.addEventListener('mouseleave', () => {
        button.classList.remove('button-hover')
      })
      button.addEventListener('mousedown', () => {
        button.classList.add('button-active')
        cb(img)
      })
      button.addEventListener('mouseup', () => {
        button.classList.remove('button-active')
      })
      const img = new Image()
      img.classList.add('button-image')
      img.src = icon
      button.appendChild(img)
    }

    const addSlider = (cb) => {
      const sliderContainer = document.createElement('div')
      sliderContainer.classList.add('slidecontainer')
      sliderContainer.classList.add('widget')
      const slider = document.createElement('input')
      slider.setAttribute('type', 'range')
      slider.classList.add('slider')
      sliderContainer.appendChild(slider)
      this.buttonsContainer.appendChild(sliderContainer)
      slider.addEventListener('mouseenter', () => {
        slider.classList.add('button-hover')
      })
      slider.addEventListener('mouseleave', () => {
        slider.classList.remove('button-hover')
      })
      let dragging = false
      let startX
      let classValue = `value${slider.value}`
      sliderContainer.classList.add(classValue)
      slider.addEventListener('mousedown', (event) => {
        dragging = true
        startX = event.clientX
        slider.classList.add('button-active')
      })
      slider.addEventListener('mouseup', () => {
        dragging = false
        slider.classList.remove('button-active')
      })
      slider.addEventListener('mousemove', (event) => {
        if (dragging) {
          const value = event.clientX - startX
          slider.value = value
          sliderContainer.classList.remove(classValue)
          classValue = `value${slider.value}`
          sliderContainer.classList.add(classValue)
          cb(slider.value)
          console.log('dragging', value)
        }
      })
      // slider.addEventListener('input', () => {
      //   sliderContainer.classList.remove(classValue)
      //   classValue = `value${slider.value}`
      //   sliderContainer.classList.add(classValue)
      //   cb(slider.value)
      // })
    }

    addSlider((value) => {
      console.log(value)
    })
    addButton('data/dustin-w-Undo-icon.png', () => {
      const { UndoRedoManager } = window.zeaUx
      UndoRedoManager.getInstance().undo()
    })
    addButton('data/dustin-w-Redo-icon.png', () => {
      const { UndoRedoManager } = window.zeaUx
      UndoRedoManager.getInstance().redo()
    })

    const styleTag = document.createElement('style')
    styleTag.appendChild(
      document.createTextNode(`

#contentDiv {
  // position: absolute;
  // top: 0px;
  // left: 0px;
  width: 280px;
  user-select: none;
}

.button {
  border: 2px solid #333333;
  width: 90px;
  height: 90px; 
  border-radius: 15px;
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

.label {
  color: black;
}

.slidecontainer {
  width: 100%; /* Width of the outside container */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
}


        `)
    )
    shadowRoot.appendChild(styleTag)
  }
}
window.customElements.define('dom-ui', DomUI)
