
class VRUI extends HTMLElement {

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    this.contentDiv = document.createElement('div')
    this.contentDiv.id = 'toolsContainer'
    shadowRoot.appendChild(this.contentDiv)

    const styleTag = document.createElement('style')
    styleTag.appendChild(
        document.createTextNode(`
#toolsContainer {
  display: flex;
  width: 210px;
  height: 500px;
  flex-wrap: wrap;
  flex-direction: row;
  display: inline-block;
}
.tool {
  border: 2px solid #333333;
  width: 200px;
  height: 200px; 
  background-color: #FFFFFF;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tool-label {
  color: black;
}
        `)
    )
    shadowRoot.appendChild(styleTag)
  }
    
  set toolManager(toolManager) {
    // this.toolManager = toolManager

    const addToolButton = (name) => {
      const toolDiv = document.createElement('div')
      toolDiv.classList.add('tool')
      toolDiv.addEventListener('click', () => {
        this.toolManager.pushTool(name)
      })
      this.contentDiv.appendChild(toolDiv)

      const toolLabelSpan = document.createElement('span')
      toolLabelSpan.classList.add('tool-label')
      const toolLabel = document.createTextNode(name)
      toolDiv.appendChild(toolLabelSpan)
      toolLabelSpan.appendChild(toolLabel)
    }

    for (const key in toolManager.tools){
      addToolButton(key)
    }
  }
}
window.customElements.define('vr-ui', VRUI);