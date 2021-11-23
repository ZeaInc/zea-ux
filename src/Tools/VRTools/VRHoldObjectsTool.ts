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
} from '@zeainc/zea-engine'
// import Handle from '../../Handles/Handle'
import UndoRedoManager from '../../UndoRedo/UndoRedoManager'
import Change from '../../UndoRedo/Change'
import { AppData } from '../../../types/temp'

/**
 * Class representing a hold objects change.
 *
 * @extends Change
 */
class HoldObjectsChange extends Change {
  __selection: Array<TreeItem> = []
  __prevXfos: Array<Xfo> = []
  __newXfos: Array<Xfo> = []
  /**
   * Create a hold objects change.
   *
   * @param {object} data - The data value.
   */
  constructor(data: any) {
    super('HoldObjectsChange')

    if (data) this.update(data)
  }

  /**
   * The undo method.
   */
  undo() {
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i] && this.__prevXfos[i]) {
        this.__selection[i].globalXfoParam.setValue(this.__prevXfos[i])
      }
    }
  }

  /**
   * The redo method.
   */
  redo() {
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i] && this.__newXfos[i]) {
        this.__selection[i].globalXfoParam.setValue(this.__newXfos[i])
      }
    }
  }

  /**
   * The update method.
   * @param {object} updateData - The updateData param.
   */
  update(updateData) {
    if (updateData.newItem) {
      this.__selection[updateData.newItemId] = updateData.newItem
      this.__prevXfos[updateData.newItemId] = updateData.newItem.globalXfoParam.value
    } else if (updateData.changeXfos) {
      for (let i = 0; i < updateData.changeXfoIds.length; i++) {
        const gidx = updateData.changeXfoIds[i]
        if (!this.__selection[gidx]) continue
        this.__selection[gidx].globalXfoParam.setValue(updateData.changeXfos[i])
        this.__newXfos[gidx] = updateData.changeXfos[i]
      }
    }
    this.emit('updated', updateData)
  }

  /**
   * The toJSON method.
   * @param {object} context - The context param.
   * @return {object} The return value.
   */
  toJSON(context?: Record<string,any>): Record<string,any> {
    const j: Record<any, any> = super.toJSON(context)

    const itemPaths = []
    for (let i = 0; i < this.__selection.length; i++) {
      if (this.__selection[i]) {
        itemPaths[i] = this.__selection[i].getPath()
      } else {
        itemPaths.push(null)
      }
    }
    j.itemPaths = itemPaths

    return j
  }

  /**
   * The fromJSON method.
   * @param {object} j - The j param.
   * @param {object} context - The context param.
   */
  fromJSON(j: Record<string,any>, context: Record<string,any>) {
    super.fromJSON(j, context)

    const sceneRoot = context.appData.scene.getRoot()
    this.__selection = []
    for (let i = 0; i < j.itemPaths.length; i++) {
      const itemPath = j.itemPaths[i]
      if (itemPath && itemPath != '') {
        const newItem = sceneRoot.resolvePath(itemPath, 1)
        if (newItem != sceneRoot) {
          this.__selection[i] = newItem
          this.__prevXfos[i] = newItem.globalXfoParam.value
        }
      }
    }
  }

  /**
   * Updates the state of an existing identified `Parameter` through replication.
   *
   * @param {object} j - The j param.
   */
  updateFromJSON(j: Record<string,any>) {
    this.update(j)
  }
}

UndoRedoManager.registerChange('HoldObjectsChange', HoldObjectsChange)

/**
 * Class representing a VR hold objects tool.
 * @extends BaseTool
 */
class VRHoldObjectsTool extends BaseTool {
  appData: AppData
  __pressedButtonCount = 0

  __freeIndices = []
  __vrControllers = []
  __heldObjectCount = 0
  __heldGeomItems = []
  __highlightedGeomItemIds = [] // controller id to held goem id.
  __heldGeomItemIds = [] // controller id to held goem id.
  __heldGeomItemRefs = []
  __heldGeomItemOffsets = []

  addIconToControllerId
  change
  /**
   * Create a VR hold objects tool.
   * @param {object} appData - The appData value.
   */
  constructor(appData: AppData) {
    super()
    this.appData = appData
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool()

    this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'

    const addIconToController = (controller) => {
      // The tool might already be deactivated.
      if (!this.__activated) return
      // const cross = new Cross(0.03)
      // const mat = new Material('Cross', 'FlatSurfaceShader')
      // mat.getParameter('BaseColor').setValue(new Color('#03E3AC'))
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
  deactivateTool() {
    super.deactivateTool()

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
   * @param {array} refs - The refs param.
   * @return {Xfo} The return value.
   */
  computeGrabXfo(refs) {
    let grabXfo
    if (refs.length == 1) {
      grabXfo = this.__vrControllers[refs[0]].getTipXfo()
    } else if (refs.length == 2) {
      const xfo0 = this.__vrControllers[refs[0]].getTipXfo()
      const xfo1 = this.__vrControllers[refs[1]].getTipXfo()

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
  initAction() {
    for (let i = 0; i < this.__heldGeomItems.length; i++) {
      const heldGeom = this.__heldGeomItems[i]
      if (!heldGeom) continue
      const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i])
      this.__heldGeomItemOffsets[i] = grabXfo.inverse().multiply(heldGeom.globalXfoParam.value)
    }
  }

  /**
   * Event fired when a pointing device button is pressed
   *
   * @param {MouseEvent} event - The event param.
   */
  onPointerDown(event: XRControllerEvent) {
    if (event.pointerType === POINTER_TYPES.xr) {
      const id = event.controller.getId()
      this.__vrControllers[id] = event.controller

      // const intersectionData = event.controller.getGeomItemAtTip()
      const geomItem = this.__highlightedGeomItemIds[id]
      if (geomItem) {
        // if (geomItem.getOwner() instanceof Handle) return false

        // console.log("onMouseDown on Geom"); // + " Material:" + geomItem.getMaterial().name);
        // console.log(geomItem.getPath()) // + " Material:" + geomItem.getMaterial().name);

        let gidx = this.__heldGeomItems.indexOf(geomItem)
        if (gidx == -1) {
          gidx = this.__heldGeomItems.length
          this.__heldObjectCount++
          this.__heldGeomItems.push(geomItem)
          this.__heldGeomItemRefs[gidx] = [id]
          this.__heldGeomItemIds[id] = gidx

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
          this.__heldGeomItemIds[id] = gidx
          this.__heldGeomItemRefs[gidx].push(id)
        }
        this.initAction()
        event.stopPropagation()
      }
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the tool.
   *
   * @param {MouseEvent} event - The event param.
   */
  onPointerUp(event: XRControllerEvent) {
    if (event.pointerType === POINTER_TYPES.xr) {
      const id = event.controller.getId()

      this.__pressedButtonCount--
      if (this.__heldGeomItemIds[id] !== undefined) {
        const gidx = this.__heldGeomItemIds[id]
        const refs = this.__heldGeomItemRefs[gidx]
        refs.splice(refs.indexOf(id), 1)
        if (refs.length == 0) {
          this.__heldObjectCount--
          this.__heldGeomItems[gidx] = undefined

          this.change = undefined
        }
        this.__heldGeomItemIds[id] = undefined
        this.initAction()
        event.stopPropagation()
      }
    }
  }

  /**
   * Event fired when a pointing device is moved
   *
   * @param {MouseEvent} event - The event param.
   */
  onPointerMove(event: XRPoseEvent) {
    if (event.pointerType === POINTER_TYPES.xr) {
      if (!this.change) {
        event.controllers.forEach((controller: any) => {
          const id = controller.getId()
          const intersectionData = controller.getGeomItemAtTip()
          if (intersectionData) {
            const geomItem = intersectionData.geomItem
            if (this.__highlightedGeomItemIds[id] != geomItem) {
              if (this.__highlightedGeomItemIds[id]) {
                this.__highlightedGeomItemIds[id].removeHighlight('vrHoldObject')
              }
              geomItem.addHighlight('vrHoldObject', new Color(1, 0, 0, 0.2))
              this.__highlightedGeomItemIds[id] = geomItem
            }
          } else {
            if (this.__highlightedGeomItemIds[id]) {
              const geomItem = this.__highlightedGeomItemIds[id]
              geomItem.removeHighlight('vrHoldObject')
              this.__highlightedGeomItemIds[id] = null
            }
          }
        })

        return
      }

      const changeXfos = []
      const changeXfoIds = []
      for (let i = 0; i < this.__heldGeomItems.length; i++) {
        const heldGeom = this.__heldGeomItems[i]
        if (!heldGeom) continue
        const grabXfo = this.computeGrabXfo(this.__heldGeomItemRefs[i])
        changeXfos.push(grabXfo.multiply(this.__heldGeomItemOffsets[i]))
        changeXfoIds.push(i)
      }

      this.change.update({ changeXfos, changeXfoIds })

      event.stopPropagation()
    }
  }

  /**
   * Event fired when a pointing device button is double clicked on the tool.
   *
   * @param {MouseEvent} event - The event param.
   */
  onPointerDoublePress(event: ZeaMouseEvent) {
    if (event.pointerType === POINTER_TYPES.xr) {
      // this.onVRControllerDoubleClicked(event)
    }
  }
}

export default VRHoldObjectsTool
export { VRHoldObjectsTool }
