import UndoRedoManager from '../UndoRedoManager'
import { SelectionGroupXfoOperator } from '../../SelectionGroupXfoOperator'
import { Change } from '../Change'
import { SelectionGroup } from '../../SelectionGroup'

class HandlePivotModeChange extends Change {
  prevMode: number
  newMode: number
  constructor(public selectionGroup?: SelectionGroup, public mode?: 'objectOrigin' | 'objectCentroid' | 'manual') {
    super()

    if (!selectionGroup) {
      return
    }
    const modes = SelectionGroupXfoOperator.HANDLE_CENTER_MODES
    this.prevMode = selectionGroup.pivotMode
    this.newMode = modes[this.mode]

    this.selectionGroup.pivotMode = this.newMode
  }

  undo(): void {
    this.selectionGroup.pivotMode = this.prevMode
  }

  redo(): void {
    this.selectionGroup.pivotMode = this.newMode
  }
}

UndoRedoManager.registerChange('HandlePivotModeChange', HandlePivotModeChange)
export default HandlePivotModeChange
