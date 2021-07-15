import { Vec3, Xfo, Color, GeomItem, Material, Plane, DataImage } from '@zeainc/zea-engine'

import domtoimage from './dom-to-image.js'

const VR_UI_ELEM_CLASS = 'VRUIElement'

/**
 * Class representing a VR controller UI.
 * @extends GeomItem
 */
export default class VRControllerUI extends GeomItem {
  /**
   * Create a VR controller UI.
   * @param {any} appData - The appData value.
   * @param {any} vrUIDOMElement - The vrUIDOMElement value.
   */
  constructor(appData, vrUIDOMElement) {
    const uimat = new Material('vr-ui-mat', 'FlatSurfaceShader')

    super('VRControllerUI', new Plane(1, 1), uimat)

    this.setSelectable(false)
    this.appData = appData
    this.__vrUIDOMElement = vrUIDOMElement
    this.__vrUIDOMElement.style.display = 'none'

    this.__uiimage = new DataImage()
    // uimat.getParameter('BaseColor').setValue(new Color(0.3, 0.3, 0.3));
    uimat.getParameter('BaseColor').setValue(this.__uiimage)

    this.__uiGeomOffsetXfo = new Xfo()
    this.__uiGeomOffsetXfo.sc.set(0, 0, 1)
    this.__rect = { width: 0, height: 0 }

    // Flip it over so we see the front.
    this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI)
    this.setGeomOffsetXfo(this.__uiGeomOffsetXfo)

    let renderRequestedId
    const processMutatedElems = () => {
      this.renderUIToImage()
      renderRequestedId = 0
    }
    this.__mutationObserver = new MutationObserver((mutations) => {
      if (!this.mainCtx) {
        this.renderUIToImage()
        return
      }
      // Batch the changes.
      if (renderRequestedId) clearTimeout(renderRequestedId)
      renderRequestedId = setTimeout(processMutatedElems, 50)
    })

    this.__active = false
    this.__renderRequested = false
  }

  // ///////////////////////////////////

  /**
   * The activate method.
   */
  activate() {
    // During debugging we activate the UI explicitly, so avoid activating twice.
    if (!this.__active) {
      // document.body.appendChild(this.__vrUIDOMElement)
      this.__vrUIDOMElement.style.display = 'block'
      this.__active = true

      this.__mutationObserver.observe(this.__vrUIDOMElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      })
      this.renderUIToImage()
    }
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    // document.body.removeChild(this.__vrUIDOMElement)
    this.__vrUIDOMElement.style.display = 'none'
    this.__active = false
    this.__mutationObserver.disconnect()
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The updateUIImage method.
   */
  updateUIImage() {
    const imageData = this.mainCtx.getImageData(0, 0, this.__rect.width, this.__rect.height)
    this.__uiimage.setData(this.__rect.width, this.__rect.height, new Uint8Array(imageData.data.buffer))
  }

  /**
   * The renderUIToImage method.
   */
  renderUIToImage() {
    domtoimage.toCanvas(this.__vrUIDOMElement).then((canvas) => {
      // if (this.canvas) {
      //   document.body.removeChild(this.canvas)
      // }
      // document.body.appendChild(canvas)
      // this.canvas = canvas

      this.mainCtx = canvas.getContext('2d')
      this.mainCtx.fillStyle = '#FFFFFF'

      // const rect = this.__vrUIDOMElement.getBoundingRect()
      const rect = {
        width: this.__vrUIDOMElement.clientWidth,
        height: this.__vrUIDOMElement.clientHeight,
      }
      // Sometimes a rendeer request occurs as the UI is being hidden.
      if (rect.width * rect.height == 0) return

      // const dpm = 0.0003; //dots-per-meter (1 each 1/2mm)
      if (rect.width != this.__rect.width || rect.height != this.__rect.height) {
        this.__rect = rect
        const dpm = 0.0005 // dots-per-meter (1 each 1/2mm)
        this.__uiGeomOffsetXfo.sc.set(this.__rect.width * dpm, this.__rect.height * dpm, 1.0)
        this.setGeomOffsetXfo(this.__uiGeomOffsetXfo)

        if (this.appData.session) {
          this.appData.session.pub('pose-message', {
            interfaceType: 'VR',
            updateUIPanel: {
              size: this.__uiGeomOffsetXfo.sc.toJSON(),
            },
          })
        }
      }
      this.updateUIImage()
    })
  }

  /**
   * The sendMouseEvent method.
   * @param {any} eventName - The eventName param.
   * @param {any} args - The args param.
   * @param {any} element - The element param.
   * @return {any} The return value.
   */
  sendMouseEvent(eventName, args, element) {
    // console.log('sendMouseEvent:', eventName, element)

    if (eventName == 'mousedown') console.log('clientX:' + args.clientX + ' clientY:' + args.clientY)

    const event = new MouseEvent(
      eventName,
      Object.assign(
        {
          target: element,
          view: window,
          bubbles: true,
          // composed: true,
          cancelable: true,
        },
        args
      )
    )

    // Dispatch the event to a leaf item in the DOM tree.
    element.dispatchEvent(event)

    // The event is re-cycled to generate a 'click' event on mouse down.
    return event
  }
}
