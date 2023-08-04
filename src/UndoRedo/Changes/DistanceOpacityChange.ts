import { Vec3, Xfo } from '@zeainc/zea-engine'
import { UndoRedoManager } from '../..'
import Change from '../Change'
import SelectionXfoChange from './SelectionXfoChange'

class DistanceOpacityChange extends Change {
  constructor(public baseXfo: Xfo) {
    super('DistanceOpacityChange')

    if (!baseXfo) return

    this.baseXfo = baseXfo
  }

  toJSON(context: Record<any, any>): Record<any, any> {
    const j = super.toJSON(context)
    j.baseXfoJson = this.baseXfo.toJSON()

    return j
  }

  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
    super.fromJSON(j, context)

    this.baseXfo = new Xfo()
    this.baseXfo.fromJSON(j.baseXfoJson)
  }

  setPrimaryChange(change: Change) {
    if (change instanceof SelectionXfoChange) {
      const isSupressed = localStorage.getItem('is-change-supressed')
      change.supressed = !!isSupressed

      change.on('updated', ({ newBase }) => {
        const _newBase = newBase as Xfo
        const dragVec = _newBase.tr.subtract(this.baseXfo.tr)
        const opacity = 1 - (dragVec.length() % 1)

        change.treeItems.forEach((treeItem) => {
          treeItem.opacityParam.value = opacity
        })
      })
    }
  }
}

UndoRedoManager.registerChange('DistanceOpacityChange', DistanceOpacityChange)

export default DistanceOpacityChange
export { DistanceOpacityChange }
