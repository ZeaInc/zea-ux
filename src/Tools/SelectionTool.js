import { Vec2, Color, Xfo, GeomItem, Material, Rect } from '@zeainc/zea-engine'

import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import BaseTool from './BaseTool'
import Handle from '../Handles/Handle'

/**
 * Class representing a selection tool.
 *
 * @extends BaseTool
 */
class SelectionTool extends BaseTool {
  /**
   * Creates an instance of SelectionTool.
   *
   * @param {object} appData - The appData value
   */
  constructor(appData) {
    super(appData)

    this.dragging = false
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

  /**
   * Activates selection tool.
   */
  setSelectionManager(selectionManager) {
    this.selectionManager = selectionManager
  }

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
    this.rectItem.getParameter('GlobalXfo').setValue(this.selectionRectXfo)
    this.rectItem.getParameter('Visible').setValue(false)
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
    this.rectItem.getParameter('GlobalXfo').setValue(this.selectionRectXfo)
  }

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the tool.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerDown(event) {
    if (event.button == 0 && !event.altKey) {
      this.pointerDownPos = event.pointerPos
      this.dragging = false

      return true
    }

    return false
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside it.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerMove(event) {
    if (this.pointerDownPos) {
      const delta = this.pointerDownPos.subtract(event.pointerPos)
      if (this.dragging) {
        this.__resizeRect(event.viewport, delta)
      }
      const dist = delta.length()
      // dragging only is activated after 4 pixels.
      // This is to avoid causing as rect selection for nothing.
      if (dist > 4) {
        this.dragging = true
        // Start drawing the selection rectangle on screen.
        this.rectItem.getParameter('Visible').setValue(true)
        this.__resizeRect(event.viewport, delta)
      }
    }
    return true
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the tool.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerUp(event) {
    if (this.pointerDownPos) {
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
        const geomItems = event.viewport.getGeomItemsInRect(tl, br)

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
          this.rectItem.getParameter('GlobalXfo').setValue(this.selectionRectXfo)
        }
      } else {
        const intersectionData = event.viewport.getGeomDataAtPos(event.pointerPos)
        if (intersectionData != undefined && !(intersectionData.geomItem.getOwner() instanceof Handle)) {
          if (this.selectionManager.pickingModeActive()) {
            this.selectionManager.pick(intersectionData.geomItem)
          } else {
            if (!event.shiftKey) {
              this.selectionManager.toggleItemSelection(intersectionData.geomItem, !event.ctrlKey)
            } else {
              const items = new Set()
              items.add(intersectionData.geomItem)
              this.selectionManager.deselectItems(items)
            }
          }
        } else {
          this.selectionManager.clearSelection()
        }
      }

      this.pointerDownPos = undefined
      return true
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
  onVRControllerButtonDown(event) {
    if (event.button == 1) {
      if (!this.selectionManager) throw 'Please set the Selection Manager on the Selection Tool before using it.'
      const intersectionData = event.controller.getGeomItemAtTip()
      if (intersectionData != undefined && !(intersectionData.geomItem.getOwner() instanceof Handle)) {
        this.selectionManager.toggleItemSelection(intersectionData.geomItem)
        return true
      }
    }
  }
}

UndoRedoManager.registerChange('SelectionTool', SelectionTool)

export default SelectionTool
export { SelectionTool }
