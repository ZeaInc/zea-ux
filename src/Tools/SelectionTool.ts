import {
  Vec2,
  Color,
  Xfo,
  GeomItem,
  Material,
  Rect,
  BaseTool,
  TreeItem,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
  GLBaseViewport,
} from '@zeainc/zea-engine'

import Handle from '../Handles/Handle'
import { AppData } from '../../types/types'
import { SelectionManager } from '..'
import { GLViewport } from '@zeainc/zea-engine'

/**
 * Class representing a selection tool.
 *
 * @extends BaseTool
 */
class SelectionTool extends BaseTool {
  private appData: AppData
  private dragging: boolean
  private selectionRect: Rect
  private selectionManager: SelectionManager
  private selectionRectMat: Material
  private selectionRectXfo: Xfo
  private rectItem: GeomItem
  private pointerDownPos: Vec2
  selectionFilterFn: (treeItem: TreeItem) => TreeItem | null = null
  /**
   * Creates an instance of SelectionTool.
   *
   * @param appData - The appData value
   */
  constructor(appData: AppData) {
    super()

    if (!appData) console.error('App data not provided to tool')
    this.appData = appData
    this.dragging = false
    if (!appData.selectionManager)
      console.error('`SelectionTool` requires `SelectionManager` to be provided in the `appData` object')
    this.selectionManager = appData.selectionManager

    this.selectionRect = new Rect(1, 1)
    this.selectionRectMat = new Material('marker', 'ScreenSpaceShader')
    this.selectionRectMat.getParameter('BaseColor').value = new Color('#03E3AC')
    this.selectionRectXfo = new Xfo()
    this.selectionRectXfo.sc.set(0, 0, 0)

    this.rectItem = new GeomItem('selectionRect', this.selectionRect, this.selectionRectMat)
    this.rectItem.visibleParam.value = false
    this.appData.renderer.addTreeItem(this.rectItem)
  }

  /**
   * Activates selection tool.
   */
  activateTool(): void {
    super.activateTool()
  }

  /**
   * Deactivates the selection tool.
   */
  deactivateTool(): void {
    super.deactivateTool()
    this.selectionRectXfo.sc.set(0, 0, 0)
    this.rectItem.globalXfoParam.value = this.selectionRectXfo
    this.rectItem.visibleParam.value = false
  }
  /**
   * Activates selection tool.
   */
  setSelectionManager(selectionManager: SelectionManager): void {
    this.selectionManager = selectionManager
  }

  setSelectionFilter(fn: (treeItem: TreeItem) => TreeItem | null): void {
    this.selectionFilterFn = fn
  }

  /**
   *
   *
   * @param viewport - The viewport value
   * @param delta - The delta value
   */
  private resizeRect(viewport: GLBaseViewport, delta: Vec2): void {
    const width = viewport.getWidth()
    const height = viewport.getHeight()
    const sc = new Vec2((1 / width) * 2, (1 / height) * 2)
    const size = delta.multiply(sc)
    this.selectionRectXfo.sc.set(Math.abs(size.x), Math.abs(size.y), 1)

    const center = this.pointerDownPos.subtract(delta.scale(0.5))
    const tr = center.multiply(sc).subtract(new Vec2(1, 1))

    this.selectionRectXfo.tr.x = tr.x
    this.selectionRectXfo.tr.y = -tr.y
    this.rectItem.globalXfoParam.value = this.selectionRectXfo
  }

  /**
   *
   *
   * @param event - The event param.
   * @private
   */
  onPointerDoublePress(event: ZeaPointerEvent): void {}

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the tool.
   *
   * @param event - The event param.
   * @return {boolean} The return value.
   */
  onPointerDown(event: ZeaPointerEvent): void {
    if (event instanceof ZeaTouchEvent || (event instanceof ZeaMouseEvent && event.button == 0)) {
      this.pointerDownPos = event.pointerPos.scale(window.devicePixelRatio)
      this.dragging = false
      event.stopPropagation()
    }
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside it.
   *
   * @param event - The event param.
   * @return {boolean} The return value.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    if (!(event instanceof ZeaMouseEvent) && !(event instanceof ZeaTouchEvent)) {
      console.warn('not handling VR')
      return
    }
    if (this.pointerDownPos) {
      const pointerPos = event.pointerPos.scale(window.devicePixelRatio)
      const delta = this.pointerDownPos.subtract(pointerPos)
      const dist = delta.length()
      // dragging only is activated after 4 pixels.
      // This is to avoid causing as rect selection for nothing.
      if (dist > 4) {
        this.dragging = true
        // Start drawing the selection rectangle on screen.
        this.rectItem.visibleParam.value = true
        this.resizeRect(event.viewport, delta)
      }
      event.stopPropagation()
    } else {
      if (this.selectionManager.pickingModeActive()) {
        if (event.intersectionData) {
          this.selectionManager.pickFilter(event.intersectionData.geomItem)
        } else {
          this.selectionManager.pickFilter(null)
        }
      }
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the tool.
   *
   * @param event - The event param.
   * @return {boolean} The return value.
   */
  onPointerUp(event: ZeaPointerEvent): void {
    if ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && this.pointerDownPos) {
      if (this.dragging) {
        this.rectItem.visibleParam.value = false
        const pointerUpPos = event.pointerPos.scale(window.devicePixelRatio)
        const tl = new Vec2(
          Math.min(this.pointerDownPos.x, pointerUpPos.x),
          Math.min(this.pointerDownPos.y, pointerUpPos.y)
        )
        const br = new Vec2(
          Math.max(this.pointerDownPos.x, pointerUpPos.x),
          Math.max(this.pointerDownPos.y, pointerUpPos.y)
        )

        const viewport = event.viewport as GLViewport
        let geomItems: Array<TreeItem> = Array.from(viewport.getGeomItemsInRect(tl, br)) // TODO: check, using Array.from() since we have a Set<>

        // Remove all the scene widgets. (UI elements should not be selectable.)
        geomItems = geomItems.filter((geomItem) => geomItem != this.rectItem && !(geomItem.parent instanceof Handle))

        if (this.selectionFilterFn) {
          const filteredGeomItems: Array<TreeItem> = []
          geomItems.forEach((geomItem) => {
            const filteredItem = this.selectionFilterFn(geomItem)
            if (filteredItem) filteredGeomItems.push(filteredItem)
          })
          geomItems = filteredGeomItems
        }

        if (!this.selectionManager) throw 'Please set the Selection Manager on the Selection Tool before using it.'
        if (this.selectionManager.pickingModeActive()) {
          this.selectionManager.pick(geomItems)
        } else {
          const geomItemsSet: Set<TreeItem> = new Set(geomItems)

          if (!event.shiftKey) {
            this.selectionManager.selectItems(geomItemsSet, !event.ctrlKey)
          } else {
            this.selectionManager.deselectItems(geomItemsSet)
          }

          this.selectionRectXfo.sc.set(0, 0, 0)
          this.rectItem.globalXfoParam.value = this.selectionRectXfo
        }
      } else {
        const viewport = event.viewport as GLViewport
        const pointerUpPos = event.pointerPos
        const intersectionData = viewport.getGeomDataAtPos(pointerUpPos, undefined) // TODO: check if this was intended
        if (intersectionData != undefined && !(intersectionData.geomItem.getOwner() instanceof Handle)) {
          let treeItem = intersectionData.geomItem
          if (this.selectionFilterFn) treeItem = this.selectionFilterFn(treeItem)

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
   * @param event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonDown(event: XRControllerEvent): void {
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
