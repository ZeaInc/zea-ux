import UndoRedoManager from '../UndoRedoManager'
import { Change } from '../Change'
import { Xfo } from '@zeainc/zea-engine'
import { SelectionGroup } from '../../SelectionGroup'
import { SelectionGroupXfoOperator } from '../../SelectionGroupXfoOperator'

class HandlePivotChange extends Change {
  prevMode: number
  baseXfo: Xfo
  prevXfo: Xfo
  newXfo: Xfo
  constructor(public selectionGroup?: SelectionGroup) {
    super()
    if (!selectionGroup) {
      return
    }
    this.prevMode = selectionGroup.pivotMode
    this.prevXfo = this.baseXfo = selectionGroup.pivotXfo
    this.newXfo = selectionGroup.pivotXfo

    if (this.prevMode !== SelectionGroupXfoOperator.HANDLE_CENTER_MODES.manual) {
      this.selectionGroup.pivotMode = SelectionGroupXfoOperator.HANDLE_CENTER_MODES.manual
    }
  }

  setDeltaXfo(deltaXfo: Xfo) {
    this.newXfo = this.baseXfo.clone()
    this.newXfo.tr = deltaXfo.tr.add(this.newXfo.tr)
    this.newXfo.ori = deltaXfo.ori.multiply(this.newXfo.ori)
    this.newXfo.sc = deltaXfo.sc.multiply(this.newXfo.sc)
    this.selectionGroup.pivotXfo = this.newXfo
  }

  undo(): void {
    this.selectionGroup.pivotXfo = this.prevXfo
    this.selectionGroup.pivotMode = this.prevMode
  }

  redo(): void {
    this.selectionGroup.pivotXfo = this.newXfo
    this.selectionGroup.pivotMode = SelectionGroupXfoOperator.HANDLE_CENTER_MODES.manual
  }
}
UndoRedoManager.registerChange('HandlePivotChange', HandlePivotChange)

export default HandlePivotChange
export { HandlePivotChange }
