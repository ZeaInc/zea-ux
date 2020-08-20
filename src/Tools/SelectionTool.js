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

    this.selectionRect = new Rect(1, 1)
    this.selectionRectMat = new Material('marker', 'ScreenSpaceShader')
    this.selectionRectMat.getParameter('BaseColor').setValue(new Color('#03E3AC'))
    this.selectionRectXfo = new Xfo()
    this.selectionRectXfo.tr.set(0.5, 0.5, 0)
    this.selectionRectXfo.sc.set(0, 0, 0)
  }

  /**
   * Activates selection tool.
   */
  activateTool() {
    super.activateTool()

    if (!this.rectItem) {
      this.rectItem = new GeomItem('selectionRect', this.selectionRect, this.selectionRectMat)
      this.rectItem.getParameter('Visible').setValue(false)
      this.appData.renderer.addTreeItem(this.rectItem)
    }
  }

  /**
   * Deactivates the selection tool.
   */
  deactivateTool() {
    super.deactivateTool()
    this.selectionRectXfo.sc.set(0, 0, 0)
    this.rectItem.getParameter('GlobalXfo').setValue(this.selectionRectXfo)
  }

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the tool.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onMouseDown(event) {
    if (event.button == 0 && !event.altKey) {
      console.log('onMouseDown')
      this.mouseDownPos = event.mousePos
      this.dragging = false
      return true
    }
    return false
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

    const center = this.mouseDownPos.subtract(delta.scale(0.5))
    const tr = center.multiply(sc).subtract(new Vec2(1, 1))

    this.selectionRectXfo.tr.x = tr.x
    this.selectionRectXfo.tr.y = -tr.y
    this.rectItem.getParameter('GlobalXfo').setValue(this.selectionRectXfo)
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside it.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onMouseMove(event) {
    if (this.mouseDownPos) {
      const delta = this.mouseDownPos.subtract(event.mousePos)
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
   * @param {MouseEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onMouseUp(event) {
    if (this.mouseDownPos) {
      // event.viewport.renderGeomDataFbo();
      if (this.dragging) {
        this.rectItem.getParameter('Visible').setValue(false)
        const mouseUpPos = event.mousePos
        const tl = new Vec2(Math.min(this.mouseDownPos.x, mouseUpPos.x), Math.min(this.mouseDownPos.y, mouseUpPos.y))
        const br = new Vec2(Math.max(this.mouseDownPos.x, mouseUpPos.x), Math.max(this.mouseDownPos.y, mouseUpPos.y))
        const geomItems = event.viewport.getGeomItemsInRect(tl, br)

        if (this.appData.selectionManager.pickingModeActive()) {
          this.appData.selectionManager.pick(geomItems)
        } else {
          // Remove all the scene widgets. (UI elements should not be selectable.)
          const regularGeomItems = new Set([...geomItems].filter((x) => !(x.getOwner() instanceof Handle)))

          if (!event.shiftKey) {
            this.appData.selectionManager.selectItems(regularGeomItems, !event.ctrlKey)
          } else {
            this.appData.selectionManager.deselectItems(regularGeomItems)
          }

          this.selectionRectXfo.sc.set(0, 0, 0)
          this.rectItem.getParameter('GlobalXfo').setValue(this.selectionRectXfo)
        }
      } else {
        const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos)
        if (intersectionData != undefined && !(intersectionData.geomItem.getOwner() instanceof Handle)) {
          if (this.appData.selectionManager.pickingModeActive()) {
            this.appData.selectionManager.pick(intersectionData.geomItem)
          } else {
            if (!event.shiftKey) {
              this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem, !event.ctrlKey)
            } else {
              const items = new Set()
              items.add(intersectionData.geomItem)
              this.appData.selectionManager.deselectItems(items)
            }
          }
        } else {
          this.appData.selectionManager.clearSelection()
        }
      }

      this.mouseDownPos = undefined
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
      const intersectionData = event.controller.getGeomItemAtTip()
      if (intersectionData != undefined && !(intersectionData.geomItem.getOwner() instanceof Handle)) {
        this.appData.selectionManager.toggleItemSelection(intersectionData.geomItem)
        return true
      }
    }
  }
}

UndoRedoManager.registerChange('SelectionTool', SelectionTool)

export default SelectionTool
export { SelectionTool }
