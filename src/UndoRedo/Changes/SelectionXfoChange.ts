import { Parameter, TreeItem, Xfo } from '@zeainc/zea-engine'
import UndoRedoManager from '../UndoRedoManager'
import Change from '../Change'

/**
 * Represents a `Change` class for storing `Parameter` values.
 *
 * **Events**
 * * **updated:** Triggered when the `SelectionXfoChange` value is updated.
 *
 * @extends Change
 */
class SelectionXfoChange extends Change {
  treeItems: TreeItem[] = []
  baseXfo: Xfo
  localXfos: Xfo[] = []
  prevValues: Xfo[] = []
  newValues: Xfo[] = []
  /**
   * Creates an instance of SelectionXfoChange.
   *
   * @param param - The Parameter object that is modified by this change.
   * @param newValue - The newValue value.
   */
  constructor(treeItems: TreeItem[], baseXfo: Xfo) {
    super('SelectionXfoChange')

    this.treeItems = treeItems

    this.baseXfo = baseXfo
    const invBaseXfo = baseXfo.inverse()
    this.treeItems.forEach((treeItem: TreeItem) => {
      this.localXfos.push(invBaseXfo.multiply(treeItem.globalXfoParam.value))
      this.prevValues.push(treeItem.globalXfoParam.value)
      this.newValues.push(treeItem.globalXfoParam.value)
    })
  }

  setDeltaXfo(delta: Xfo) {
    // Add the values in global space.
    const newBase = this.baseXfo.clone()
    newBase.tr = delta.tr.add(newBase.tr)
    newBase.ori = delta.ori.multiply(newBase.ori)
    newBase.sc = delta.sc.multiply(newBase.sc)

    this.prevValues.forEach((prevValue: Xfo, index: number) => {
      const newValue = newBase.multiply(this.localXfos[index])
      this.newValues[index] = newValue

      this.treeItems[index].globalXfoParam.value = this.newValues[index].clone()
    })

    this.emit('updated')
  }

  setDone() {
    this.emit('done')
  }

  /**
   * Rollbacks the value of the parameter to the previous one, passing it to the redo stack in case you wanna recover it later on.
   */
  undo(): void {
    this.treeItems.forEach((treeItem: TreeItem, index: number) => {
      treeItem.globalXfoParam.value = this.prevValues[index]
    })
  }

  /**
   * Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack
   * and updating the parameter with the new value.
   */
  redo(): void {
    this.treeItems.forEach((treeItem: TreeItem, index: number) => {
      treeItem.globalXfoParam.value = this.newValues[index]
    })
  }

  /**
   * Updates the state of the current parameter change value.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<string, any>): void {
    this.newValues = updateData.newValues
    this.treeItems.forEach((treeItem: TreeItem, index: number) => {
      treeItem.globalXfoParam.value = this.newValues[index]
    })

    this.emit('updated', updateData)
  }

  /**
   * Serializes `Parameter` instance value as a JSON object, allowing persistence/replication.
   *
   * @param context - The context param.
   * @return {object} The return value.
   */
  toJSON(context: Record<any, any>): Record<any, any> {
    const j: Record<any, any> = {
      name: this.name,
      treeItems: [],
      prevValues: [],
      newValues: [],
    }

    this.treeItems.forEach((treeItem: TreeItem, index: number) => {
      j.treeItems[index] = this.treeItems[index].getPath()
      j.prevValues[index] = this.prevValues[index].toJSON()
      j.newValues[index] = this.newValues[index].toJSON()
    })

    return j
  }

  /**
   * Restores `Parameter` instance's state with the specified JSON object.
   *
   * @param j - The j param.
   * @param context - The context param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): Record<any, any> {
    const param = context.appData.scene.getRoot().resolvePath(j.paramPath, 1)
    if (!param || !(param instanceof Parameter)) {
      console.warn('resolvePath is unable to resolve', j.paramPath)
      return
    }

    j.treeItems.forEach((path: string[], index: number) => {
      this.treeItems[index] = context.appData.scene.getRoot().resolvePath(path, 1)
      if (!this.prevValues[index]) this.prevValues[index] = new Xfo()
      this.prevValues[index].fromJSON(j.prevValues[index])
      if (!this.newValues[index]) this.newValues[index] = new Xfo()
      this.newValues[index].fromJSON(j.newValues[index])
    })
  }

  /**
   * Updates the state of an existing identified `Parameter` through replication.
   *
   * @param j - The j param.
   */
  updateFromJSON(j: Record<any, any>): void {
    j.treeItems.forEach((path: string[], index: number) => {
      this.prevValues[index].fromJSON(j.prevValues[index])
      this.newValues[index].fromJSON(j.newValues[index])
    })
  }
}

// @ts-ignore
UndoRedoManager.registerChange('SelectionXfoChange', SelectionXfoChange)

export default SelectionXfoChange
export { SelectionXfoChange }
