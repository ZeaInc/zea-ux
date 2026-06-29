import {
  Color,
  BaseItem,
  TreeItem,
  SelectionSet,
  CloneContext,
  Xfo,
  BaseGroupEventMap,
  BaseEvent,
} from '@zeainc/zea-engine'
import SelectionGroupXfoOperator from './SelectionGroupXfoOperator.js'

interface SelectionGroupEventMap extends BaseGroupEventMap {
  pivotModeChanged: BaseEvent
}

/**
 * A specific type of `SelectionSet` class that contains/handles selection of one or more items from the scene.
 *
 * **Option parameter values**
 *
 * | Option | type | default | Description |
 * | --- | --- | --- | --- |
 * | selectionOutlineColor | `Color` | `new Color('#03e3ac'))`  and opacity of `0.1` | See `Color` documentation |
 * | branchSelectionOutlineColor | `Color` | `new Color('#81f1d5')` and opacity of `0.55` | See `Color` documentation |
 *
 * @extends {SelectionSet}
 */
class SelectionGroup extends SelectionSet {
  selectionGroupXfoOp: SelectionGroupXfoOperator

  /**
   * Creates an instance of SelectionGroup.
   *
   *
   * **Parameters**
   * @param options - Custom options for selection
   */
  constructor(options?: Record<string, any>) {
    super()

    const selectionColor = options.selectionOutlineColor
      ? options.selectionOutlineColor
      : new Color(3 / 255, 227 / 255, 172 / 255, 0.1)
    this.highlightColorParam.value = selectionColor
    this.itemsParam.setFilterFn((item) => item instanceof BaseItem)

    this.selectionGroupXfoOp = new SelectionGroupXfoOperator(this.globalXfoParam)
  }

  /**
   * Constructs a new selection group by copying the values from current one and returns it.
   *
   * @return - Cloned selection group.
   */
  clone(context?: CloneContext): BaseItem {
    const cloned = new SelectionGroup()
    cloned.copyFrom(this, context)
    return cloned
  }

  /**
   *
   * @param item -
   * @param index -
   * @private
   */
  bindItem(item: TreeItem, index: number): void {
    const highlightColor = this.highlightColorParam.value
    highlightColor.a = this.highlightFillParam.value
    item.addHighlight('selected' + this.getId(), highlightColor, true)
    this.selectionGroupXfoOp.addItem(item)
  }

  /**
   *
   * @param item -
   * @param index -
   * @private
   */
  unbindItem(item: TreeItem, index: number): void {
    item.removeHighlight('selected' + this.getId(), true)
    this.selectionGroupXfoOp.removeItem(item)
  }

  get pivotMode(): number {
    return this.selectionGroupXfoOp.pivotMode
  }

  set pivotMode(mode: number) {
    const modeChanged = this.selectionGroupXfoOp.pivotMode != mode
    this.selectionGroupXfoOp.pivotMode = mode
    if (modeChanged) {
      this.emit('pivotModeChanged')
    }
  }

  get pivotXfo(): Xfo {
    return this.selectionGroupXfoOp.pivotXfo
  }

  set pivotXfo(xfo: Xfo) {
    const modeChanged = this.selectionGroupXfoOp.pivotMode != SelectionGroupXfoOperator.HANDLE_CENTER_MODES.manual
    this.selectionGroupXfoOp.pivotXfo = xfo
    if (modeChanged) {
      this.emit('pivotModeChanged')
    }
  }

  // #region Event Emitter Interfaces

  on<K extends keyof SelectionGroupEventMap>(
    eventName: K,
    callback: (event?: SelectionGroupEventMap[K]) => void
  ): number {
    return super.on(eventName as any, callback)
  }

  off<K extends keyof SelectionGroupEventMap>(
    eventName: K,
    listenerOrId: number | ((event?: SelectionGroupEventMap[K]) => void)
  ) {
    return super.off(eventName as any, listenerOrId)
  }

  emit<K extends keyof SelectionGroupEventMap>(eventName: K, event?: SelectionGroupEventMap[K]): void {
    super.emit(eventName as any, event)
  }

  // #endregion
}

export default SelectionGroup
export { SelectionGroup }
