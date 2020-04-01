/** Class representing an action tree view. */
class ActionTreeView {
  /**
   * Create an action tree view.
   * @param {any} actionRegistry - The actionRegistry value.
   */
  constructor(actionRegistry) {
    this.actionRegistry = actionRegistry

    this.__existingItems = {}

    const domElement = document.createElement('div')
    document.body.appendChild(domElement)
    const ul = this._addUlTo(domElement, 'pure-menu-list')

    const actions = this.actionRegistry.getActions()
    actions.forEach((action) => {
      if (action.availableInVR == true) this._addMenuItem(ul, action)
    })
    this.actionRegistry.actionAdded.connect((action) => {
      if (action.availableInVR == true) this._addMenuItem(ul, action)
    })
  }

  // eslint-disable-next-line require-jsdoc
  _addSpanTo(domElement, className, innerHTML) {
    const span = document.createElement('span')
    span.className = className
    if (innerHTML) {
      span.innerHTML = innerHTML
    }
    domElement.appendChild(span)
    return span
  }

  // eslint-disable-next-line require-jsdoc
  _addMenuItem(domElement, action) {
    const a = document.createElement('a')
    a.href = '#'

    const classes = 'pure-menu-link VRUIElement'
    let activated = false
    a.className = classes

    a.addEventListener('mouseenter', (e) => {
      if (!activated) a.className = classes + ' HighlightedMenu'
    })
    a.addEventListener('mouseleave', (e) => {
      if (activated) a.className = classes + ' ActionedMenu'
      else a.className = classes
    })

    if (action.activatedChanged) {
      action.activatedChanged.connect((state) => {
        if (state) a.className = classes + ' ActionedMenu'
        else a.className = classes
        activated = state
      })
    } else {
      a.addEventListener('mousedown', (e) => {
        a.className = classes + ' ActionedMenu'
      })
      a.addEventListener('mouseup', (e) => {
        a.className = classes + ' HighlightedMenu'
      })
    }

    if (action.callback) {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        action.callback()
      })
    }

    domElement.appendChild(a)
    this._addSpanTo(a, 'ActionTitle', action.name)
    return a
  }

  // eslint-disable-next-line require-jsdoc
  _addUlTo(domElement, className, innerHTML) {
    const ul = document.createElement('ul')
    ul.className = className
    if (innerHTML) {
      ul.innerHTML = innerHTML
    }
    domElement.appendChild(ul)
    return ul
  }

  // eslint-disable-next-line require-jsdoc
  _addLiTo(domElement, className, innerHTML) {
    const li = document.createElement('li')
    li.className = className
    if (innerHTML) {
      li.innerHTML = innerHTML
    }
    domElement.appendChild(li)
    return li
  }
}

export { ActionTreeView }
