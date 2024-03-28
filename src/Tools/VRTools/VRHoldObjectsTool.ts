// TODO: need to export POINTER_TYPES
// @ts-ignore
import {
  Quat,
  Color,
  Xfo,
  BaseTool,
  POINTER_TYPES,
  TreeItem,
  ZeaMouseEvent,
  XRControllerEvent,
  XRPoseEvent,
  GeomItem,
  XRController,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
// import Handle from '../../Handles/Handle'
import UndoRedoManager from '../../UndoRedo/UndoRedoManager'
import Change from '../../UndoRedo/Change'
import { AppData } from '../../../types/types'
import { ParameterValueChange } from '../..'

/**
 * Class representing a hold objects change.
 *
 * @extends Change
 */
class HoldObjectsChange extends Change {
  selection: Array<TreeItem> = []
  prevXfos: Array<Xfo> = []
  newXfos: Array<Xfo> = []
  /**
   * Create a hold objects change.
   *
   * @param data - The data value.
   */
  constructor(data: any) {
    super('HoldObjectsChange')

    if (data) this.update(data)
  }

  /**
   * The undo method.
   */
  undo(): void {
    for (let i = 0; i < this.selection.length; i++) {
      if (this.selection[i] && this.prevXfos[i]) {
        this.selection[i].globalXfoParam.value = this.prevXfos[i]
      }
    }
  }

  /**
   * The redo method.
   */
  redo(): void {
    for (let i = 0; i < this.selection.length; i++) {
      if (this.selection[i] && this.newXfos[i]) {
        this.selection[i].globalXfoParam.value = this.newXfos[i]
      }
    }
  }

  /**
   * The update method.
   * @param updateData - The updateData param.
   */
  update(updateData: any): void {
    if (updateData.newItem) {
      this.selection[updateData.newItemId] = updateData.newItem
      this.prevXfos[updateData.newItemId] = updateData.newItem.globalXfoParam.value
    } else if (updateData.changeXfos) {
      for (let i = 0; i < updateData.changeXfoIds.length; i++) {
        const gidx = updateData.changeXfoIds[i]
        if (!this.selection[gidx]) continue
        this.selection[gidx].globalXfoParam.value = updateData.changeXfos[i]
        this.newXfos[gidx] = updateData.changeXfos[i]
      }
    }
    this.emit('updated', updateData)
  }

  /**
   * The toJSON method.
   * @param context - The context param.
   * @return {object} The return value.
   */
  toJSON(context?: Record<string, any>): Record<string, any> {
    const j: Record<any, any> = super.toJSON(context)

    const itemPaths = []
    for (let i = 0; i < this.selection.length; i++) {
      if (this.selection[i]) {
        itemPaths[i] = this.selection[i].getPath()
      } else {
        itemPaths.push(null)
      }
    }
    j.itemPaths = itemPaths

    return j
  }

  /**
   * The fromJSON method.
   * @param j - The j param.
   * @param context - The context param.
   */
  fromJSON(j: Record<string, any>, context: Record<string, any>): void {
    super.fromJSON(j, context)

    const sceneRoot = context.appData.scene.getRoot()
    this.selection = []
    for (let i = 0; i < j.itemPaths.length; i++) {
      const itemPath = j.itemPaths[i]
      if (itemPath && itemPath != '') {
        const newItem = sceneRoot.resolvePath(itemPath, 1)
        if (newItem != sceneRoot) {
          this.selection[i] = newItem
          this.prevXfos[i] = newItem.globalXfoParam.value
        }
      }
    }
  }
}

UndoRedoManager.registerChange('HoldObjectsChange', HoldObjectsChange)

/**
 * Class representing a VR hold objects tool.
 * @extends BaseTool
 */
class VRHoldObjectsTool extends BaseTool {
  private appData: AppData
  private pressedButtonCount = 0

  private vrControllers: XRController[] = []
  private heldObjectCount = 0
  private heldGeomItems: Array<GeomItem> = []
  private highlightedGeomItemIds: Array<TreeItem> = [] // controller id to held goem id.
  private heldGeomItemIds: Array<number> = [] // controller id to held goem id.
  private heldGeomItemRefs: any = []
  private heldGeomItemOffsets: Array<Xfo> = []

  private addIconToControllerId: number
  private change: HoldObjectsChange
  private prevCursor: string

  /**
   * Create a VR hold objects tool.
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super()
    this.appData = appData
  }

  /**
   * The activateTool method.
   */
  activateTool(): void {
    super.activateTool()

    this.prevCursor = this.appData.renderer.getGLCanvas().style.cursor
    this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'

    const addIconToController = (controller: XRController) => {
      // The tool might already be deactivated.
      if (!this.__activated) return
      // const cross = new Cross(0.03)
      // const mat = new Material('Cross', 'FlatSurfaceShader')
      // mat.getParameter('BaseColor').value = new Color('#03E3AC')
      // mat.visibleInGeomDataBuffer = false
      // const geomItem = new GeomItem('HandleToolTip', cross, mat)
      // controller.getTipItem().removeAllChildren()
      // controller.getTipItem().addChild(geomItem, false)
    }

    this.appData.renderer.getXRViewport().then((xrvp) => {
      for (const controller of xrvp.getControllers()) {
        addIconToController(controller)
      }
      this.addIconToControllerId = xrvp.on('controllerAdded', (event) => addIconToController(event.controller))
    })
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool(): void {
    super.deactivateTool()

    this.appData.renderer.getGLCanvas().style.cursor = this.prevCursor

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.removeListenerById('controllerAdded', this.addIconToControllerId)
    })
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The computeGrabXfo method.
   * @param refs - The refs param.
   * @return {Xfo} The return value.
   */
  computeGrabXfo(refs: any[]): any {
    let grabXfo
    if (refs.length == 1) {
      grabXfo = this.vrControllers[refs[0]].getTipXfo()
    } else if (refs.length == 2) {
      const xfo0 = this.vrControllers[refs[0]].getTipXfo()
      const xfo1 = this.vrControllers[refs[1]].getTipXfo()

      xfo0.ori.alignWith(xfo1.ori)

      grabXfo = new Xfo()
      grabXfo.tr = xfo0.tr.lerp(xfo1.tr, 0.5)
      grabXfo.ori = xfo0.ori.lerp(xfo1.ori, 0.5)

      let vec0 = xfo1.tr.subtract(xfo0.tr)
      vec0.normalizeInPlace()
      const vec1 = grabXfo.ori.getXaxis()
      if (vec0.dot(vec1) < 0.0) vec0 = vec0.negate()

      const angle = vec0.angleTo(vec1)
      if (angle > 0) {
        const axis = vec1.cross(vec0)
        axis.normalizeInPlace()
        const align = new Quat()
        align.setFromAxisAndAngle(axis, angle)
        grabXfo.ori = align.multiply(grabXfo.ori)
      }
    }
    return grabXfo
  }

  /**
   * The initAction method.
   */
  initAction(): void {
    for (let i = 0; i < this.heldGeomItems.length; i++) {
      const heldGeom = this.heldGeomItems[i]
      if (!heldGeom) continue
      const grabXfo = this.computeGrabXfo(this.heldGeomItemRefs[i])
      this.heldGeomItemOffsets[i] = grabXfo.inverse().multiply(heldGeom.globalXfoParam.value)
    }
  }

  /**
   * Event fired when a pointing device button is pressed
   *
   * @param event - The event param.
   */
  onPointerDown(event: ZeaPointerEvent): void {
    if (event instanceof XRControllerEvent) {
      const id = event.controller.getId()
      this.vrControllers[id] = event.controller

      // const intersectionData = event.controller.getGeomItemAtTip()
      const geomItem = <GeomItem>this.highlightedGeomItemIds[id]
      if (geomItem) {
        // if (geomItem.getOwner() instanceof Handle) return false

        // console.log("onMouseDown on Geom"); // + " Material:" + geomItem.getMaterial().name);
        // console.log(geomItem.getPath()) // + " Material:" + geomItem.getMaterial().name);

        let gidx = this.heldGeomItems.indexOf(<GeomItem>geomItem)
        if (gidx == -1) {
          gidx = this.heldGeomItems.length
          this.heldObjectCount++
          this.heldGeomItems.push(geomItem)
          this.heldGeomItemRefs[gidx] = [id]
          this.heldGeomItemIds[id] = gidx

          const changeData = {
            newItem: geomItem,
            newItemId: gidx,
          }
          if (!this.change) {
            this.change = new HoldObjectsChange(changeData)
            UndoRedoManager.getInstance().addChange(this.change)
          } else {
            this.change.update(changeData)
          }
        } else {
          this.heldGeomItemIds[id] = gidx
          this.heldGeomItemRefs[gidx].push(id)
        }
        this.initAction()
        event.stopPropagation()
      }
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the tool.
   *
   * @param event - The event param.
   */
  onPointerUp(event: ZeaPointerEvent): void {
    if (event instanceof XRControllerEvent) {
      const id = event.controller.getId()

      this.pressedButtonCount--
      if (this.heldGeomItemIds[id] !== undefined) {
        const gidx = this.heldGeomItemIds[id]
        const refs = this.heldGeomItemRefs[gidx]
        refs.splice(refs.indexOf(id), 1)
        if (refs.length == 0) {
          this.heldObjectCount--
          this.heldGeomItems[gidx] = undefined

          this.change = undefined
        }
        this.heldGeomItemIds[id] = undefined
        this.initAction()
        event.stopPropagation()
      }
    }
  }

  /**
   * Event fired when a pointing device is moved
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    if (event instanceof XRPoseEvent) {
      if (!this.change) {
        event.controllers.forEach((controller: any) => {
          const id = controller.getId()
          const intersectionData = controller.getGeomItemAtTip()
          if (intersectionData) {
            const geomItem = intersectionData.geomItem
            if (this.highlightedGeomItemIds[id] != geomItem) {
              if (this.highlightedGeomItemIds[id]) {
                this.highlightedGeomItemIds[id].removeHighlight('vrHoldObject')
              }
              geomItem.addHighlight('vrHoldObject', new Color(1, 0, 0, 0.2))
              this.highlightedGeomItemIds[id] = geomItem
            }
          } else {
            if (this.highlightedGeomItemIds[id]) {
              const geomItem = this.highlightedGeomItemIds[id]
              geomItem.removeHighlight('vrHoldObject')
              this.highlightedGeomItemIds[id] = null
            }
          }
        })

        return
      }

      const changeXfos = []
      const changeXfoIds = []
      for (let i = 0; i < this.heldGeomItems.length; i++) {
        const heldGeom = this.heldGeomItems[i]
        if (!heldGeom) continue
        const grabXfo = this.computeGrabXfo(this.heldGeomItemRefs[i])
        changeXfos.push(grabXfo.multiply(this.heldGeomItemOffsets[i]))
        changeXfoIds.push(i)
      }

      this.change.update({ changeXfos, changeXfoIds })

      event.stopPropagation()
    }
  }

  /**
   * Event fired when a pointing device button is double clicked on the tool.
   *
   * @param event - The event param.
   */
  onPointerDoublePress(event: ZeaMouseEvent): void {
    if (event instanceof XRControllerEvent) {
      // this.onVRControllerDoubleClicked(event)
    }
  }
}

export default VRHoldObjectsTool
export { VRHoldObjectsTool }
