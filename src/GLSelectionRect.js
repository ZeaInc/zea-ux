import { Rect, GLLines, GLGeomItem, GeomItem } from '@zeainc/zea-engine'

/**
 * Class representing a GL selection rect.
 *
 * @extends GLGeomItem
 * @private
 */
class GLSelectionRect extends GLGeomItem {
  /**
   * Create a GL selection rect.
   * @param {any} gl - The gl value.
   */
  constructor(gl) {
    const selectionRect = new Rect('selectionRect', 0.5, 0.5)
    const selectionRectGeomItem = new GeomItem('selectionRect', selectionRect)
    selectionRectGeomItem.setVisible(false)

    const glGeom = new GLLines(gl, selectionRect)
    super(gl, selectionRectGeomItem, glGeom)

    this.__selectionRectGeomItem = selectionRectGeomItem
  }

  /**
   * The getVisible method.
   * @return {any} - The return value.
   */
  getVisible() {
    return this.__selectionRectGeomItem.getVisible()
  }

  /**
   * The setVisible method.
   * @param {any} val - The val param.
   */
  setVisible(val) {
    this.__selectionRectGeomItem.setVisible(val)
  }

  /**
   * The globalXfo method.
   * @return {any} - The return value.
   */
  get globalXfo() {
    return this.__selectionRectGeomItem.getParameter('GlobalXfo').getValue()
  }

  /**
   * The globalXfo method.
   * @param {any} val - The val param.
   */
  set globalXfo(val) {
    this.__selectionRectGeomItem.globalXfo = val
  }

  /**
   * The globalXfoChanged method.
   * @return {any} - The return value.
   */
  get globalXfoChanged() {
    return this.__selectionRectGeomItem.globalXfoChanged
  }
}

export { GLSelectionRect }
