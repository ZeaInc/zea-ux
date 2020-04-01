import {
  SystemDesc,
  Float32,
  Signal,
  Vec2,
  Vec3,
  Quat,
  Color,
  Xfo,
  Ray,
  ValueSetMode,
  BooleanParameter,
  NumberParameter,
  ColorParameter,
  ItemFlags,
  BaseItem,
  TreeItem,
  GeomItem,
  Material,
  Lines,
  Rect,
  Cross,
  Cylinder,
  Cuboid,
  Sphere,
  Cone,
} from '@zeainc/zea-engine'

import Change from '../../undoredo/Change.js'
import UndoRedoManager from '../../undoredo/UndoRedoManager.js'

/**
 * Class representing a name value change.
 * @extends Change
 */
class NameValueChange extends Change {
  /**
   * Create a name value change.
   * @param {any} item - The item value.
   * @param {any} newValue - The newValue value.
   */
  constructor(item, newValue) {
    if (item) {
      super(item ? item.getName() + ' Name Changed' : 'NameValueChange')
      this.__prevName = item.getName()
      this.__item = item
      if (newValue != undefined) {
        this.__nextName = newValue
        this.__item.setName(this.__nextName)
      }
    } else {
      super()
    }
  }

  /**
   * The undo method.
   */
  undo() {
    if (!this.__item) return
    this.__item.setName(this.__prevName)
  }

  /**
   * The redo method.
   */
  redo() {
    if (!this.__item) return
    this.__item.setName(this.__nextName)
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (!this.__item) return
    this.__nextName = updateData.value
    this.__item.setName(this.__nextName)
    this.updated.emit(updateData)
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   * @return {any} The return value.
   */
  toJSON(context) {
    const itemPath = this.__item.getPath().slice()
    itemPath.pop()
    itemPath.push(this.__prevName)
    const j = {
      name: this.name,
      nextName: this.__nextName,
      itemPath,
    }
    return j
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   */
  fromJSON(j, context) {
    const sceneRoot = context.appData.scene.getRoot()
    const item = sceneRoot.resolvePath(j.itemPath, 1)
    if (!item || !(item instanceof BaseItem)) {
      console.warn('resolvePath is unable to resolve', j.itemPath)
      return
    }
    this.__item = item
    this.__prevName = this.__item.getName()
    this.__nextName = j.nextName
    this.__item.setName(this.__nextName, ValueSetMode.REMOTEUSER_SETVALUE)

    this.name = this.__item.getName() + ' Changed'
  }

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    if (!this.__item) return
    this.__nextName = j.value
    this.__item.setName(this.__nextName, ValueSetMode.REMOTEUSER_SETVALUE)
  }
}

UndoRedoManager.registerChange('NameValueChange', NameValueChange)

/** Class representing a name widget. */
export default class NameWidget {
  /**
   * Create a name widget.
   * @param {any} item - The item value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(item, parentDomElem, appData) {
    const input = document.createElement('input')
    input.className = 'mdl-textfield__input'
    input.setAttribute('type', 'text')
    input.setAttribute('value', item.getName())
    input.setAttribute('tabindex', 0)

    parentDomElem.appendChild(input)

    // ///////////////////////////
    // Handle Changes.

    let change
    let remoteUserEditedHighlightId
    item.nameChanged.connect((name, oldName, mode) => {
      if (!change) {
        input.value = item.getName()

        if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
          input.classList.add('user-edited')
          if (remoteUserEditedHighlightId)
            clearTimeout(remoteUserEditedHighlightId)
          remoteUserEditedHighlightId = setTimeout(() => {
            input.classList.remove('user-edited')
            remoteUserEditedHighlightId = null
          }, 1500)
        }
      }
    })

    const valueChange = () => {
      const value = input.value
      if (!change) {
        change = new NameValueChange(item, value)
        appData.undoRedoManager.addChange(change)
      } else {
        change.update({ value })
      }
    }

    const valueChangeEnd = () => {
      valueChange()
      change = undefined
    }

    input.addEventListener('input', valueChange)
    input.addEventListener('change', valueChangeEnd)
  }
}
