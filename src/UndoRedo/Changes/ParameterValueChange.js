import { Parameter } from '@zeainc/zea-engine'
import UndoRedoManager from '../UndoRedoManager'
import Change from '../Change'

/**
 * Represents a `Change` class for storing `Parameter` values.
 *
 * **Events**
 * * **updated:** Triggered when the `ParameterValueChange` value is updated.
 *
 * @extends Change
 */
class ParameterValueChange extends Change {
  /**
   * Creates an instance of ParameterValueChange.
   *
   * @param {Parameter} param - The param value.
   * @param {object|string|number|any} newValue - The newValue value.
   */
  constructor(param, newValue) {
    if (param) {
      super(param ? param.getName() + ' Changed' : 'ParameterValueChange')
      this.__prevValue = param.getValue()
      this.__param = param
      if (newValue != undefined) {
        this.__nextValue = newValue
        this.__param.setValue(this.__nextValue)
      }
    } else {
      super()
    }

    this.suppressPrimaryChange = false
    this.secondaryChanges = []
    this.secondaryChangesStack = []
  }

  /**
   * Adds a new secondary change onto this Change object. The secondary changes can contain more secondary changes, creating a tree of changes all generated from a sigle user action.
   *
   * This system is used to track all the possible changes made to a scene by a single user action.
   * E.g. if a user moves a selection of objects, The change in the global Xfo for each object is stored as a secondary change on the main change created for the movement of the SelectionGroup
   * If the moved items were driven by keyframe tracks, and the movement generated new keyframes, then secondary changes for those keyframes would be stored in each change for the modification of the GlobalXfo
   *
   * If the user presses undo, then all changes withing the tree must be reverted.
   *
   * @param {Change} secondaryChange - The change to make as the new top of the stack. new secondary changes will be added to that if needed.
   */
  addSecondaryChange(secondaryChange) {
    const index = this.secondaryChanges.length
    secondaryChange.on('updated', (updateData) => {
      this.emit('updated', {
        secondaryChange: {
          index,
          updateData,
        },
      })
    })
    this.secondaryChanges.push(secondaryChange)
    this.emit('updated', {
      secondaryChangeAdded: {
        changeClass: UndoRedoManager.getChangeClassName(secondaryChange),
        changeData: secondaryChange.toJSON(),
      },
      suppressPrimaryChange: this.suppressPrimaryChange,
    })
    return index
  }

  /**
   * Returns the current top of the stack.
   *
   * @return {Change} The Change that was currently the top of the stack.
   */
  topChangeStack() {
    if (this.secondaryChangesStack.length == 0) return this
    else return this.secondaryChangesStack[this.secondaryChangesStack.length - 1]
  }

  /**
   * Pushes a new change onto the stack. Subsequent calls to topChangeStack will then return this change.
   *
   * @param {Change} secondaryChange - The change to make as the new top of the stack. new secondary changes will be added to that if needed.
   */
  pushSecondaryChange(secondaryChange) {
    if (!this.secondaryChanges.includes(secondaryChange))
      console.error(
        'A secondary change must already be added to a ParameterValueChange instance before being pushed on the stack'
      )
    this.secondaryChangesStack.push(secondaryChange)
  }

  /**
   * Pops the current top of the secondary change stack so that the previous value is now the top.
   * Note: only the owner of the secondary change should pop it off the stack.
   * Always check that the returned value is the change you pushed on the stack earlier.
   *
   * @return {Change} The Change that was previously the top of the stack.
   */
  popSecondaryChange() {
    return this.secondaryChangesStack.pop()
  }

  /**
   * Rollbacks the value of the parameter to the previous one, passing it to the redo stack in case you wanna recover it later on.
   */
  undo() {
    if (!this.__param) return

    if (!this.suppressPrimaryChange) {
      this.__param.setValue(this.__prevValue)
    }

    this.secondaryChanges.forEach((change) => change.undo())
  }

  /**
   * Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack
   * and updating the parameter with the new value.
   */
  redo() {
    if (!this.__param) return
    if (!this.suppressPrimaryChange) {
      console.log('redo:', this.__param.getPath(), this.__nextValue.tr.toString())
      this.__param.setValue(this.__nextValue)
    }

    this.secondaryChanges.forEach((change) => change.redo())
  }

  /**
   * Updates the state of the current parameter change value.
   *
   * @param {Parameter} updateData - The updateData param.
   */
  update(updateData) {
    if (!this.__param) return
    if (updateData.value != undefined) {
      this.__nextValue = updateData.value
      this.__param.setValue(this.__nextValue)
    }
    this.emit('updated', {
      value: this.__nextValue,
    })
  }

  /**
   * Serializes `Parameter` instance value as a JSON object, allowing persistence/replication.
   *
   * @param {object} context - The context param.
   * @return {object} The return value.
   */
  toJSON(context) {
    const j = {
      name: this.name,
      paramPath: this.__param.getPath(),
    }

    if (!this.suppressPrimaryChange) {
      if (this.__nextValue != undefined) {
        if (this.__nextValue.toJSON) {
          j.value = this.__nextValue.toJSON()
        } else {
          j.value = this.__nextValue
        }
      }
    }

    j.suppressPrimaryChange = this.suppressPrimaryChange
    j.secondaryChanges = this.secondaryChanges.map((secondaryChange) => {
      return {
        changeClass: UndoRedoManager.getChangeClassName(change),
        changeData: secondaryChange.toJSON(context),
      }
    })
    return j
  }

  /**
   * Restores `Parameter` instance's state with the specified JSON object.
   *
   * @param {object} j - The j param.
   * @param {object} context - The context param.
   */
  fromJSON(j, context) {
    const param = context.appData.scene.getRoot().resolvePath(j.paramPath, 1)
    if (!param || !(param instanceof Parameter)) {
      console.warn('resolvePath is unable to resolve', j.paramPath)
      return
    }
    this.__param = param
    this.name = j.name

    if (!j.suppressPrimaryChange) {
      this.__prevValue = this.__param.getValue()
      if (this.__prevValue.clone) this.__nextValue = this.__prevValue.clone()
      else this.__nextValue = this.__prevValue
      if (j.value) {
        if (this.__nextValue.fromJSON) this.__nextValue.fromJSON(j.value)
        else this.__nextValue = j.value
        this.__param.setValue(this.__nextValue)
      }
    }

    if (j.secondaryChanges) {
      this.secondaryChange = j.secondaryChanges.map((data) => {
        const change = UndoRedoManager.getInstance().constructChange(data.changeClass)
        change.fromJSON(data.changeData, context)
      })
    }
  }

  /**
   * Updates the state of an existing identified `Parameter` through replication.
   *
   * @param {object} j - The j param.
   */
  changeFromJSON(j) {
    if (!this.__param) return
    if (j.value) {
      if (this.__nextValue.fromJSON) this.__nextValue.fromJSON(j.value)
      else this.__nextValue = j.value
      this.__param.setValue(this.__nextValue)
    }

    if (j.secondaryChangeAdded) {
      const data = j.secondaryChangeAdded
      const change = UndoRedoManager.getInstance().constructChange(data.changeClass)
      change.fromJSON(data.changeData, context)
      this.secondaryChanges.push(change)
      if (j.suppressPrimaryChange) this.suppressPrimaryChange = j.suppressPrimaryChange
    }
    if (j.secondaryChange) {
      const secondaryChange = updateData.secondaryChange
      this.secondaryChanges[secondaryChange.index].update(secondaryChange.updateData)
    }
  }
}

UndoRedoManager.registerChange('ParameterValueChange', ParameterValueChange)

export default ParameterValueChange
export { ParameterValueChange }
