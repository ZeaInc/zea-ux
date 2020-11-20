import { EventEmitter, Color } from '@zeainc/zea-engine'
import XfoHandle from './Handles/XfoHandle'
import SelectionGroup from './SelectionGroup'
import SelectionChange from './UndoRedo/Changes/SelectionChange'
import SelectionVisibilityChange from './UndoRedo/Changes/SelectionVisibilityChange'
import UndoRedoManager from './UndoRedo/UndoRedoManager'

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
  /**
   * Creates an instance of SelectionManager.
   *
   * @param {object} appData - The options object.
   * @param {object} [options={}] - The appData value.
   */
  constructor(appData, options = {}) {
    super()
    this.appData = appData
    this.leadSelection = undefined
    this.selectionGroup = new SelectionGroup(options)

    if (options.enableXfoHandles === true) {
      const size = 0.1
      const thickness = size * 0.02
      this.xfoHandle = new XfoHandle(size, thickness)
      this.xfoHandle.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false)
      this.xfoHandle.setVisible(false)
      this.xfoHandle.getParameter('HighlightColor').setValue(new Color(1, 1, 0))
      this.selectionGroup.addChild(this.xfoHandle)
    }

    if (this.appData.renderer) {
      this.setRenderer(this.appData.renderer)
    }
  }

  /**
   * Adds specified the renderer to the `SelectionManager` and attaches the `SelectionGroup`.
   *
   * @param {GLBaseRenderer} renderer - The renderer param.
   */
  setRenderer(renderer) {
    if (this.__renderer == renderer) {
      console.warn(`Renderer already set on SelectionManager`)
      return
    }
    this.__renderer = renderer
    this.__renderer.addTreeItem(this.selectionGroup)
  }

  /**
   * Sets initial Xfo mode of the selection group.
   *
   * @see `Group` class documentation
   *
   * @param {number} mode - The Xfo mode
   */
  setXfoMode(mode) {
    if (this.xfoHandle) {
      this.selectionGroup.getParameter('InitialXfoMode').setValue(mode)
    }
  }

  /**
   * Displays handles depending on the specified mode(Move, Rotate, Scale).
   * If nothing is specified, it hides all of them.
   *
   * @param {number} handleManipulationMode - The mode of the Xfo parameter
   */
  showHandles(handleManipulationMode) {
    if (this.xfoHandle && this.currMode != handleManipulationMode) {
      this.currMode = handleManipulationMode
      // eslint-disable-next-line guard-for-in
      for (const key in this.handleGroup) {
        this.handleGroup[key].emit(handleManipulationMode == key)
      }
      this.xfoHandle.showHandles(handleManipulationMode)
    }
  }

  /**
   * Determines if the Xfo Manipulation handle should be displayed or not.
   */
  updateHandleVisibility() {
    if (!this.xfoHandle) return
    const selection = this.selectionGroup.getItems()
    const visible = Array.from(selection).length > 0
    this.xfoHandle.setVisible(visible)
    this.__renderer.requestRedraw()
  }

  /**
   * Returns an array with the selected items.
   *
   * @return {array} - The return value.
   */
  getSelection() {
    return this.selectionGroup.getItems()
  }

  /**
   * Sets a new selection of items in the `SelectionManager`
   *
   * @param {Set} newSelection - The newSelection param
   * @param {boolean} [createUndo=true] - The createUndo param
   */
  setSelection(newSelection, createUndo = true) {
    const selection = new Set(this.selectionGroup.getItems())
    const prevSelection = new Set(selection)
    for (const treeItem of newSelection) {
      if (!selection.has(treeItem)) {
        // treeItem.setSelected(true);
        selection.add(treeItem)
      }
    }
    for (const treeItem of selection) {
      if (!newSelection.has(treeItem)) {
        // treeItem.setSelected(false);
        selection.delete(treeItem)
      }
    }

    this.selectionGroup.setItems(selection)

    // Deselecting can change the lead selected item.
    if (selection.size > 0) this.__setLeadSelection(selection.values().next().value)
    else this.__setLeadSelection()
    this.updateHandleVisibility()

    if (createUndo) {
      const change = new SelectionChange(this, prevSelection, selection)
      UndoRedoManager.getInstance().addChange(change)
    }

    this.emit('selectionChanged', { prevSelection, selection })
  }

  /**
   *
   * @param {TreeItem} treeItem - The treeItem value
   * @private
   */
  __setLeadSelection(treeItem) {
    if (this.leadSelection != treeItem) {
      this.leadSelection = treeItem
      this.emit('leadSelectionChanged', { treeItem })
    }
  }

  /**
   * The toggleItemSelection method.
   *
   * @param {TreeItem} treeItem - The treeItem param.
   * @param {boolean} replaceSelection - The replaceSelection param.
   */
  toggleItemSelection(treeItem, replaceSelection = true) {
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
        // Array.from(selection).forEach(item => {
        //   item.setSelected(false);
        // });
        selection.clear()
      }
    }

    let sel
    if (!selection.has(treeItem)) {
      // treeItem.setSelected(true);
      selection.add(treeItem)
      sel = true
    } else {
      // treeItem.setSelected(false);
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
      this.__setLeadSelection(treeItem)
    } else if (!sel) {
      // Deselecting can change the lead selected item.
      if (selection.size === 1) this.__setLeadSelection(selection.values().next().value)
      else if (selection.size === 0) this.__setLeadSelection()
    }

    const change = new SelectionChange(this, prevSelection, selection)
    UndoRedoManager.getInstance().addChange(change)

    this.updateHandleVisibility()
    this.emit('selectionChanged', { prevSelection, selection })
  }

  /**
   * Clears selection state by removing previous selected items and the Xfo handlers.
   *
   * @param {boolean} newChange - The newChange param.
   * @return {boolean} - The return value.
   */
  clearSelection(newChange = true) {
    const selection = new Set(this.selectionGroup.getItems())
    if (selection.size == 0) return false
    let prevSelection
    if (newChange) {
      prevSelection = new Set(selection)
    }
    // for (const treeItem of selection) {
    //   treeItem.setSelected(false);
    // }
    selection.clear()
    this.selectionGroup.setItems(selection)
    this.updateHandleVisibility()
    if (newChange) {
      const change = new SelectionChange(this, prevSelection, selection)
      UndoRedoManager.getInstance().addChange(change)
      this.emit('selectionChanged', { selection, prevSelection })
    }
    return true
  }

  /**
   * Selects the specified items replacing previous selection or concatenating new items to it.
   *
   * @param {array} treeItems - The treeItems param.
   * @param {boolean} replaceSelection - The replaceSelection param.
   */
  selectItems(treeItems, replaceSelection = true) {
    const selection = new Set(this.selectionGroup.getItems())
    const prevSelection = new Set(selection)

    if (replaceSelection) {
      selection.clear()
    }

    for (const treeItem of treeItems) {
      if (!treeItem.getSelected()) {
        selection.add(treeItem)
      }
    }

    const change = new SelectionChange(this, prevSelection, selection)

    UndoRedoManager.getInstance().addChange(change)

    this.selectionGroup.setItems(selection)
    if (selection.size === 1) {
      this.__setLeadSelection(selection.values().next().value)
    } else if (selection.size === 0) {
      this.__setLeadSelection()
    }
    this.updateHandleVisibility()
    this.emit('selectionChanged', { prevSelection, selection })
  }

  /**
   * Deselects the specified items from the selection group.
   *
   * @param {array} treeItems - The treeItems param.
   */
  deselectItems(treeItems) {
    const selection = this.selectionGroup.getItems()
    const prevSelection = new Set(selection)

    for (const treeItem of treeItems) {
      if (treeItem.getSelected()) {
        // treeItem.setSelected(false);
        selection.delete(selectedParam)
        // treeItem.traverse((subTreeItem)=>{
        //   if(!selection.has(subTreeItem)) {
        //     subTreeItem.setSelected(false);
        //     selection.delete(treeItem);
        //   }
        // })
      }
    }

    this.selectionGroup.setItems(selection)
    const change = new SelectionChange(this, prevSelection, selection)

    UndoRedoManager.getInstance().addChange(change)

    if (selection.size === 1) {
      this.__setLeadSelection(selection.values().next().value)
    } else if (selection.size === 0) {
      this.__setLeadSelection()
    }
    this.updateHandleVisibility()
    this.emit('selectionChanged', { prevSelection, selection })
  }

  /**
   * Toggles selection visibility, if the visibility is `true`then sets it to `false` and vice versa.
   */
  toggleSelectionVisibility() {
    if (this.leadSelection) {
      const selection = this.selectionGroup.getItems()
      const state = !this.leadSelection.getVisible()
      const change = new SelectionVisibilityChange(selection, state)
      UndoRedoManager.getInstance().addChange(change)
    }
  }

  // ////////////////////////////////////
  /**
   * The startPickingMode method.
   *
   * @param {string} label - The label param.
   * @param {function} fn - The fn param.
   * @param {function} filterFn - The filterFn param.
   * @param {number} count - The count param.
   */
  startPickingMode(label, fn, filterFn, count) {
    // Display this in a status bar.
    console.log(label)
    this.__pickCB = fn
    this.__pickFilter = filterFn
    this.__pickCount = count
    this.__picked = []
  }

  /**
   * The pickingFilter method.
   *
   * @param {TreeItem} item - The item param.
   * @return {any} The return value.
   */
  pickingFilter(item) {
    return this.__pickFilter(item)
  }

  /**
   * The pickingModeActive method.
   *
   * @return {boolean} The return value.
   */
  pickingModeActive() {
    return this.__pickCB != undefined
  }

  /**
   * The cancelPickingMode method.
   */
  cancelPickingMode() {
    this.__pickCB = undefined
  }

  /**
   * The pick method.
   * @param {TreeItem} item - The item param.
   */
  pick(item) {
    if (this.__pickCB) {
      if (Array.isArray(item)) {
        if (this.__pickFilter) this.__picked = this.__picked.concat(item.filter(this.__pickFilter))
        else this.__picked = this.__picked.concat(item)
      } else {
        if (this.__pickFilter && !this.__pickFilter(item)) return
        this.__picked.push(item)
      }
      if (this.__picked.length == this.__pickCount) {
        this.__pickCB(this.__picked)
        this.__pickCB = undefined
      }
    }
  }
}

export default SelectionManager
export { SelectionManager }
