import { Vec2, Color, Xfo, GeomItem, Material, Rect, BaseTool, TreeItem } from '@zeainc/zea-engine'

import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import Handle from '../Handles/Handle'
import { AppData } from '../../types/temp'
import { SelectionManager } from '..'
import { ZeaMouseEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaMouseEvent'
import { ZeaTouchEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaTouchEvent'
import { XRControllerEvent } from '@zeainc/zea-engine/dist/Utilities/Events/XRControllerEvent'
import { ZeaPointerEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaPointerEvent'

/**
 * Class representing a selection tool.
 *
 * @extends BaseTool
 */
class SelectionTool extends BaseTool {
  appData: AppData
  dragging: boolean
  selectionRect: Rect
  selectionManager: SelectionManager
  selectionRectMat: Material
  selectionRectXfo: Xfo
  rectItem: GeomItem
  __selectionFilterFn: any
  pointerDownPos: Vec2
  /**
   * Creates an instance of SelectionTool.
   *
   * @param {object} appData - The appData value
   */
  constructor(appData) {
    super()

    if (!appData) console.error('App data not provided to tool')
    this.appData = appData
    this.dragging = false
    if (!appData.selectionManager)
      console.error('`SelectionTool` requires `SelectionManager` to be provided in the `appData` object')
    this.selectionManager = appData.selectionManager

    this.selectionRect = new Rect(1, 1)
    this.selectionRectMat = new Material('marker', 'ScreenSpaceShader')
    this.selectionRectMat.getParameter('BaseColor').setValue(new Color('#03E3AC'))
    this.selectionRectXfo = new Xfo()
    this.selectionRectXfo.tr.set(0.5, 0.5, 0)
    this.selectionRectXfo.sc.set(0, 0, 0)

    this.rectItem = new GeomItem('selectionRect', this.selectionRect, this.selectionRectMat)
    this.rectItem.getParameter('Visible').setValue(false)
    this.appData.renderer.addTreeItem(this.rectItem)
  }

  // /**
  //  * activate this tool
  //  */
  // activateTool() {
  //   super.activateTool()
  //   this.prevCursor = this.appData.renderer.getGLCanvas().style.cursor
  //   this.appData.renderer.getGLCanvas().style.cursor = 'auto'
  // }

  // /**
  //  * Disables tool usage.
  //  */
  // deactivateTool() {
  //   super.deactivateTool()
  //   this.appData.renderer.getGLCanvas().style.cursor = this.prevCursor
  // }
  /**
   * Activates selection tool.
   */
  activateTool() {
    super.activateTool()
  }

  /**
   * Deactivates the selection tool.
   */
  deactivateTool() {
    super.deactivateTool()
    this.selectionRectXfo.sc.set(0, 0, 0)
    this.rectItem.globalXfoParam.setValue(this.selectionRectXfo)
    this.rectItem.getParameter('Visible').setValue(false)
  }
  /**
   * Activates selection tool.
   */
  setSelectionManager(selectionManager) {
    this.selectionManager = selectionManager
  }

  setSelectionFilter(fn) {
    this.__selectionFilterFn = fn
  }

  /**
   *
   *
   * @param {GLViewport} viewport - The viewport value
   * @param {*} delta - The delta value
   * @private
   */
  __resizeRect(viewport, delta) {
    const sc = new Vec2((1 / viewport.getWidth()) * 2, (1 / viewport.getHeight()) * 2)
    const size = delta.multiply(sc)
    this.selectionRectXfo.sc.set(Math.abs(size.x), Math.abs(size.y), 1)

    const center = this.pointerDownPos.subtract(delta.scale(0.5))
    const tr = center.multiply(sc).subtract(new Vec2(1, 1))

    this.selectionRectXfo.tr.x = tr.x
    this.selectionRectXfo.tr.y = -tr.y
    this.rectItem.globalXfoParam.setValue(this.selectionRectXfo)
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @private
   */
  onPointerDoublePress(event: ZeaPointerEvent) {}

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the tool.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerDown(event: ZeaPointerEvent) {
    if (event instanceof ZeaTouchEvent || (event instanceof ZeaMouseEvent && (event.button == 0 && !event.altKey))) {
      this.pointerDownPos = event.pointerPos
      this.dragging = false

      event.stopPropagation()
    }
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside it.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerMove(event: ZeaPointerEvent) {
    if (!(event instanceof ZeaMouseEvent) && !(event instanceof ZeaTouchEvent)) {
      console.warn("not handling VR")
      return
    }
    if (this.pointerDownPos) {
      const delta = this.pointerDownPos.subtract(event.pointerPos)
      const dist = delta.length()
      // dragging only is activated after 4 pixels.
      // This is to avoid causing as rect selection for nothing.
      if (dist > 4) {
        this.dragging = true
        // Start drawing the selection rectangle on screen.
        this.rectItem.getParameter('Visible').setValue(true)
        this.__resizeRect(event.viewport, delta)
      }
      event.stopPropagation()
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the tool.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerUp(event: ZeaPointerEvent) {
    if ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && this.pointerDownPos) {
      // event.viewport.renderGeomDataFbo();
      if (this.dragging) {
        this.rectItem.getParameter('Visible').setValue(false)
        const pointerUpPos = event.pointerPos
        const tl = new Vec2(
          Math.min(this.pointerDownPos.x, pointerUpPos.x),
          Math.min(this.pointerDownPos.y, pointerUpPos.y)
        )
        const br = new Vec2(
          Math.max(this.pointerDownPos.x, pointerUpPos.x),
          Math.max(this.pointerDownPos.y, pointerUpPos.y)
        )

        let geomItems = event.viewport.getGeomItemsInRect(tl, br)

        if (this.__selectionFilterFn) {
          const newSet = []
          for (let i = 0; i < geomItems.length; i++) {
            const treeItem = this.__selectionFilterFn(geomItems[i])
            if (!newSet.includes(treeItem)) {
              newSet.push(treeItem)
            }
          }
          geomItems = newSet
        }

        if (!this.selectionManager) throw 'Please set the Selection Manager on the Selection Tool before using it.'
        if (this.selectionManager.pickingModeActive()) {
          this.selectionManager.pick(geomItems)
        } else {
          // Remove all the scene widgets. (UI elements should not be selectable.)
          const regularGeomItems = new Set([...geomItems].filter((x) => !(x.getOwner() instanceof Handle)))

          if (!event.shiftKey) {
            this.selectionManager.selectItems(regularGeomItems, !event.ctrlKey)
          } else {
            this.selectionManager.deselectItems(regularGeomItems)
          }

          this.selectionRectXfo.sc.set(0, 0, 0)
          this.rectItem.globalXfoParam.setValue(this.selectionRectXfo)
        }
      } else {
        const intersectionData = event.viewport.getGeomDataAtPos(event.pointerPos)
        if (intersectionData != undefined && !(intersectionData.geomItem.getOwner() instanceof Handle)) {
          let treeItem = intersectionData.geomItem
          if (this.__selectionFilterFn) treeItem = this.__selectionFilterFn(treeItem)

          if (this.selectionManager.pickingModeActive()) {
            this.selectionManager.pick(treeItem)
          } else {
            if (!event.shiftKey) {
              this.selectionManager.toggleItemSelection(treeItem, !event.ctrlKey)
            } else {
              const items: Set<TreeItem> = new Set()
              items.add(treeItem)
              this.selectionManager.deselectItems(items)
            }
          }
        } else {
          this.selectionManager.clearSelection()
        }
      }
      this.pointerDownPos = undefined
      event.stopPropagation()
    }
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * Event fired when a VR controller button is pressed over a tool.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonDown(event: XRControllerEvent) {
    if (event.button == 1) {
      if (!this.selectionManager) throw 'Please set the Selection Manager on the Selection Tool before using it.'
      const intersectionData = event.controller.getGeomItemAtTip()
      if (intersectionData != undefined && !(intersectionData.geomItem.getOwner() instanceof Handle)) {
        this.selectionManager.toggleItemSelection(intersectionData.geomItem)
        event.stopPropagation()
      }
    }
  }
}

export { SelectionTool }
