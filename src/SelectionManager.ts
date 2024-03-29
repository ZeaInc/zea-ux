import { EventEmitter, Color, TreeItem, GLRenderer } from '@zeainc/zea-engine'
import { AppData } from '../types/types'
import XfoHandle from './Handles/XfoHandle'
import SelectionGroup from './SelectionGroup'
import SelectionChange from './UndoRedo/Changes/SelectionChange'
import UndoRedoManager from './UndoRedo/UndoRedoManager'
import { Change } from './UndoRedo'

/**
 * Class representing a selection manager
 *
 * **Events**
 * **leadSelectionChanged:** Triggered when selecting one item.
 * **selectionChanged:** Triggered when the selected objects change.
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
   * Sets initial Xfo mode of the selection group.
   *
   * @see `KinematicGroup` class documentation
   *
   * @param mode - The Xfo mode
   */
  setXfoMode(mode: number): void {
    if (this.xfoHandle) {
      this.selectionGroup.initialXfoModeParam.value = mode
    }
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

    this.emit('selectionChanged', { prevSelection, selection })
  }

  /**
   * @param treeItem - The treeItem value
   */
  private setLeadSelection(treeItem?: TreeItem): void {
    if (this.leadSelection != treeItem) {
      this.leadSelection = treeItem
      this.emit('leadSelectionChanged', { treeItem })
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
}

export default SelectionManager
export { SelectionManager }
