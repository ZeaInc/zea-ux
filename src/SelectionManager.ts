import { EventEmitter, Color, TreeItem, GLRenderer, Xfo, EventEmitterEventMap, BaseEvent } from '@zeainc/zea-engine'
import { AppData } from '../types/types'
import XfoHandle from './Handles/XfoHandle'
import SelectionGroup from './SelectionGroup'
import SelectionGroupXfoOperator from './SelectionGroupXfoOperator'
import SelectionChange from './UndoRedo/Changes/SelectionChange'
import UndoRedoManager from './UndoRedo/UndoRedoManager'
import { Change } from './UndoRedo'
import HandlePivotModeChange from './UndoRedo/Changes/HandlePivotModeChange'

class SelectionChangedEvent extends BaseEvent {
  constructor(public prevSelection: Set<TreeItem>, public selection: Set<TreeItem>) {
    super()
  }
}
class LeadSelectionChangedEvent extends BaseEvent {
  constructor(public leadSelection: TreeItem) {
    super()
  }
}

interface SelectionManagerEventMap extends EventEmitterEventMap {
  selectionChanged: SelectionChangedEvent
  leadSelectionChanged: LeadSelectionChangedEvent
  pivotModeChanged: BaseEvent
}

/**
 * Class representing a selection manager
 *
 * **Events**
 * **leadSelectionChanged:** Triggered when selecting one item.
 * **selectionChanged:** Triggered when the selected objects change.
 * **pivotModeChanged:** Triggered when the pivot mode changes.
 *
 * @extends {EventEmitter}
 */
class SelectionManager extends EventEmitter {
  appData: AppData
  leadSelection: TreeItem = undefined
  selectionGroup: SelectionGroup
  xfoHandle: XfoHandle
  xfoHandleVisible: boolean
  renderer: GLRenderer
  pickFilter: (treeItem: TreeItem) => TreeItem
  pickCB: (treeItem: TreeItem) => void

  /**
   * Creates an instance of SelectionManager.
   *
   * @param appData - The options object.
   * @param [options={}] - The appData value.
   *  enableXfoHandles - enables display Xfo Gizmo handles when items are selected.
   *  selectionOutlineColor - enables highlight color to use to outline selected items.
   *  branchSelectionOutlineColor - enables highlight color to use to outline selected items.
   */
  constructor(appData: AppData, options: any = {}) {
    super()
    this.appData = appData

    this.selectionGroup = new SelectionGroup(options)

    let prevPivotMode = this.selectionGroup.pivotMode
    this.selectionGroup.on('pivotModeChanged', () => {
      const newPivotMode = this.selectionGroup.pivotMode
      if (newPivotMode != SelectionGroupXfoOperator.HANDLE_CENTER_MODES.manual) {
        prevPivotMode = newPivotMode
      }
      this.emit('pivotModeChanged')
    })
    this.on('leadSelectionChanged', () => {
      // Restore the pivot mode to before it was set to manual
      const pivotMode = this.selectionGroup.pivotMode
      if (pivotMode == SelectionGroupXfoOperator.HANDLE_CENTER_MODES.manual) {
        this.selectionGroup.pivotMode = prevPivotMode
      }
    })

    if (options.enableXfoHandles === true) {
      this.xfoHandle = new XfoHandle()
      this.xfoHandle.setSelectionGroup(this.selectionGroup)

      this.xfoHandle.setVisible(false)
      this.xfoHandle.highlightColorParam.value = new Color(1, 1, 0)
      this.xfoHandleVisible = true

      this.selectionGroup.addChild(this.xfoHandle)
    }

    if (this.appData.renderer) {
      this.setRenderer(this.appData.renderer)
    }
  }

  /**
   * Adds specified the renderer to the `SelectionManager` and attaches the `SelectionGroup`.
   *
   * @param renderer - The renderer param.
   */
  setRenderer(renderer: GLRenderer): void {
    if (this.renderer == renderer) {
      console.warn(`Renderer already set on SelectionManager`)
      return
    }
    this.renderer = renderer
    this.renderer.addTreeItem(this.selectionGroup)
  }

  /**
   * Displays handles depending on the specified mode(Move, Rotate, Scale).
   * If nothing is specified, it hides all of them.
   * @deprecated
   * @param enabled - The mode of the Xfo parameter
   */
  showHandles(enabled: boolean): void {
    this.xfoHandleVisible = enabled
  }

  /**
   * Sets the mode that controls where the Xfo handle is centered relative to the selection.
   *
   * | Mode | Behavior |
   * | --- | --- |
   * | `objectOrigin` | Handle is placed at the object's origin (default) |
   * | `objectCentroid` | Handle is placed at the center of the selection's bounding box |
   * | `manual` | Handle is placed at a manually specified position |
   * @param mode - One of the keys from `SelectionGroupXfoOperator.HANDLE_CENTER_MODES`
   */
  set pivotMode(mode: 'objectOrigin' | 'objectCentroid' | 'manual') {
    const modes = SelectionGroupXfoOperator.HANDLE_CENTER_MODES
    if (mode in modes) {
      const change = new HandlePivotModeChange(this.selectionGroup, mode)
      UndoRedoManager.getInstance().addChange(change)
    } else {
      console.warn(`Unknown handle center mode: "${mode}"`)
    }
  }

  get pivotMode(): 'objectOrigin' | 'objectCentroid' | 'manual' {
    const modes = SelectionGroupXfoOperator.HANDLE_CENTER_MODES
    const modeIndex = this.selectionGroup.pivotMode
    return Object.keys(modes)[modeIndex] as 'objectOrigin' | 'objectCentroid' | 'manual'
  }

  set pivotXfo(xfo: Xfo) {
    this.selectionGroup.pivotXfo = xfo
  }
  get pivotXfo(): Xfo {
    return this.selectionGroup.pivotXfo
  }

  /**
   * Determines if the Xfo Manipulation handle should be displayed or not.
   */
  updateHandleVisibility(): void {
    if (!this.xfoHandle) return
    const selection = this.selectionGroup.getItems()
    const visible = Array.from(selection).length > 0
    this.xfoHandle.setVisible(visible && this.xfoHandleVisible)
    this.renderer.requestRedraw()
  }

  /**
   * Returns an array with the selected items.
   *
   * @return - The return value.
   */
  getSelection(): Set<TreeItem> {
    return this.selectionGroup.getItems()
  }

  /**
   * Sets a new selection of items in the `SelectionManager`
   *
   * @param newSelection - The newSelection param
   * @param [createUndo=true] - The createUndo param
   */
  setSelection(newSelection: Set<TreeItem>, createUndo = true, parentChange?: Change): void {
    const selection: Set<TreeItem> = new Set(this.selectionGroup.getItems())
    const prevSelection = new Set(selection)
    for (const treeItem of newSelection) {
      if (!selection.has(treeItem)) {
        treeItem.setSelected(true)
        selection.add(treeItem)
      }
    }
    for (const treeItem of selection) {
      if (!newSelection.has(treeItem)) {
        treeItem.setSelected(false)
        selection.delete(treeItem)
      }
    }

    this.selectionGroup.setItems(selection)

    // Deselecting can change the lead selected item.
    if (selection.size > 0) this.setLeadSelection(selection.values().next().value)
    else this.setLeadSelection()
    this.updateHandleVisibility()

    if (createUndo) {
      const change = new SelectionChange(this, prevSelection, selection)
      if (parentChange) parentChange.addSecondaryChange(change)
      else UndoRedoManager.getInstance().addChange(change)
    }

    this.emit('selectionChanged', new SelectionChangedEvent(prevSelection, selection))
  }

  /**
   * @param treeItem - The treeItem value
   */
  private setLeadSelection(treeItem?: TreeItem): void {
    if (this.leadSelection != treeItem) {
      this.leadSelection = treeItem
      this.emit('leadSelectionChanged', new LeadSelectionChangedEvent(treeItem))
    }
  }

  /**
   * The toggleItemSelection method.
   *
   * @param treeItem - The treeItem param.
   * @param replaceSelection - The replaceSelection param.
   */
  toggleItemSelection(treeItem: TreeItem, replaceSelection = true, createUndo = true, parentChange?: Change): void {
    const selection = new Set(this.selectionGroup.getItems())
    const prevSelection = new Set(selection)

    // Avoid clearing the selection when we have the
    // item already selected and are deselecting it.
    // (to clear all selection)
    if (replaceSelection && !(selection.size == 1 && selection.has(treeItem))) {
      let clear = true
      if (selection.has(treeItem)) {
        let count = 1
        treeItem.traverse((subTreeItem) => {
          if (selection.has(subTreeItem)) {
            count++
          }
        })
        // Note: In some cases, the item is currently selected, and
        // its children make up all the selected items. In that case
        // the user intends to deselect the item and all its children.
        // Avoid cleaning here, so the deselection can occur.
        clear = count != selection.size
      }

      if (clear) {
        Array.from(selection).forEach((item: TreeItem) => {
          item.setSelected(false)
        })
        selection.clear()
      }
    }

    let sel
    if (!selection.has(treeItem)) {
      treeItem.setSelected(true)
      selection.add(treeItem)
      sel = true
    } else {
      treeItem.setSelected(false)
      selection.delete(treeItem)
      sel = false
    }

    // const preExpandSelSize = selection.size;

    // Now expand the selection to the subtree.
    // treeItem.traverse((subTreeItem)=>{
    //   if (sel) {
    //     if(!selection.has(subTreeItem)) {
    //       // subTreeItem.setSelected(true);
    //       selection.add(subTreeItem);
    //       // this.selectionGroup.addItem(treeItem);
    //     }
    //   }
    //   else {
    //     if(selection.has(subTreeItem)) {
    //       subTreeItem.setSelected(false);
    //       selection.delete(subTreeItem);
    //       // this.selectionGroup.removeItem(treeItem);
    //     }
    //   }
    // })

    this.selectionGroup.setItems(selection)

    if (sel && selection.size === 1) {
      this.setLeadSelection(treeItem)
    } else if (!sel) {
      // Deselecting can change the lead selected item.
      if (selection.size === 1) this.setLeadSelection(selection.values().next().value)
      else if (selection.size === 0) this.setLeadSelection()
    }

    if (createUndo) {
      const change = new SelectionChange(this, prevSelection, selection)
      if (parentChange) parentChange.addSecondaryChange(change)
      else UndoRedoManager.getInstance().addChange(change)
    }

    this.updateHandleVisibility()
    this.emit('selectionChanged', { prevSelection, selection })
  }

  /**
   * Clears selection state by removing previous selected items and the Xfo handlers.
   *
   * @param createUndo - The createUndo param.
   * @return {boolean} - The return value.
   */
  clearSelection(createUndo = true, parentChange?: Change): void {
    const selection: Set<TreeItem> = new Set(this.selectionGroup.getItems())
    if (selection.size == 0) return
    let prevSelection
    if (createUndo) {
      prevSelection = new Set(selection)
    }
    for (const treeItem of selection) {
      treeItem.setSelected(false)
    }
    selection.clear()
    this.selectionGroup.setItems(selection)
    this.setLeadSelection()
    this.updateHandleVisibility()

    if (createUndo) {
      const change = new SelectionChange(this, prevSelection, selection)
      if (parentChange) parentChange.addSecondaryChange(change)
      else UndoRedoManager.getInstance().addChange(change)
    }

    this.emit('selectionChanged', { selection, prevSelection })
  }

  /**
   * Selects the specified items replacing previous selection or concatenating new items to it.
   *
   * @param treeItems - The treeItems param.
   * @param replaceSelection - The replaceSelection param.
   */
  selectItems(treeItems: Set<TreeItem>, replaceSelection = true, createUndo = true, parentChange?: Change): void {
    const selection = new Set(this.selectionGroup.getItems())
    const prevSelection = new Set(selection)

    if (replaceSelection) {
      selection.clear()
    }

    for (const treeItem of treeItems) {
      if (!selection.has(treeItem)) {
        treeItem.setSelected(true)
        selection.add(treeItem)
      }
    }

    this.selectionGroup.setItems(selection)
    if (selection.size === 1) {
      this.setLeadSelection(selection.values().next().value)
    } else if (selection.size === 0) {
      this.setLeadSelection()
    }
    this.updateHandleVisibility()

    if (createUndo) {
      const change = new SelectionChange(this, prevSelection, selection)
      if (parentChange) parentChange.addSecondaryChange(change)
      else UndoRedoManager.getInstance().addChange(change)
    }

    this.emit('selectionChanged', { prevSelection, selection })
  }

  /**
   * Deselects the specified items from the selection group.
   *
   * @param treeItems - The treeItems param.
   */
  deselectItems(treeItems: Set<TreeItem>, createUndo = true, parentChange?: Change): void {
    const selection = new Set(this.selectionGroup.getItems())
    const prevSelection = new Set(selection)

    for (const treeItem of treeItems) {
      if (selection.has(treeItem)) {
        treeItem.setSelected(false)
        selection.delete(treeItem)
      }
    }

    this.selectionGroup.setItems(selection)

    if (selection.size === 1) {
      this.setLeadSelection(selection.values().next().value)
    } else if (selection.size === 0) {
      this.setLeadSelection()
    }
    this.updateHandleVisibility()

    if (createUndo) {
      const change = new SelectionChange(this, prevSelection, selection)
      if (parentChange) parentChange.addSecondaryChange(change)
      else UndoRedoManager.getInstance().addChange(change)
    }

    this.emit('selectionChanged', { prevSelection, selection })
  }

  // ////////////////////////////////////
  /**
   * The startPickingMode method.
   *
   * @param label - The label param.
   * @param fn - The fn param.
   * @param filterFn - The filterFn param.
   * @param count - The count param.
   */
  startPickingMode(fn: (treeItem: TreeItem) => void, filterFn: (treeItem: TreeItem) => TreeItem | null): void {
    this.pickCB = fn
    this.pickFilter = filterFn
  }

  /**
   * The pickingModeActive method.
   *
   * @return {boolean} The return value.
   */
  pickingModeActive(): boolean {
    return !!this.pickCB && !!this.pickFilter
  }

  /**
   * The endPickingMode method.
   */
  endPickingMode(): void {
    this.pickCB = undefined
    this.pickFilter = undefined
  }

  /**
   * The pick method.
   * @param item - The item param.
   */
  pick(item: TreeItem | Array<TreeItem>): void {
    if (this.pickCB) {
      if (Array.isArray(item)) {
        item.forEach((elem) => {
          const filtered = this.pickFilter ? this.pickFilter(elem) : elem
          if (filtered) this.pickCB(filtered)
        })
      } else {
        const filtered = this.pickFilter ? this.pickFilter(item) : item
        if (filtered) this.pickCB(filtered)
      }
    }
  }

  // #region Event Emitter Interfaces

  on<K extends keyof SelectionManagerEventMap>(
    eventName: K,
    callback: (event?: SelectionManagerEventMap[K]) => void
  ): number {
    return super.on(eventName as any, callback)
  }

  off<K extends keyof SelectionManagerEventMap>(
    eventName: K,
    listenerOrId: number | ((event?: SelectionManagerEventMap[K]) => void)
  ) {
    return super.off(eventName as any, listenerOrId)
  }

  emit<K extends keyof SelectionManagerEventMap>(eventName: K, event?: SelectionManagerEventMap[K]): void {
    super.emit(eventName as any, event)
  }

  // #endregion
}

export default SelectionManager
export { SelectionManager }
