import { Vec3, Xfo, EulerAngles, Color, TreeItem, GeomItem, Material, Plane, DataImage } from '@zeainc/zea-engine'
import { AppData } from '../../../types/temp.js'

import domtoimage from './dom-to-image.js'

/**
 * Traverse a dom tree and call a callback at each node.
 * @param {HTMLElement} node
 * @param {number} depth
 * @param {function} func
 */
function traverse(node, depth, func) {
  if (!func(node, depth)) return
  node = node.firstChild
  while (node) {
    traverse(node, depth + 1, func)
    node = node.nextSibling
  }
}

/**
 * Computes the size of th element, including margins.
 * @param {HTMLElement} elem
 * @return {object}
 */
function elemSize(elem) {
  const computedStyle = elem.computedStyleMap()
  const elmWidth = computedStyle.get('width').value
  const elmMarginHorizontal = computedStyle.get('margin-left').value + computedStyle.get('margin-right').value
  const elmHeight = computedStyle.get('height').value
  const elmMarginVertical = computedStyle.get('margin-top').value + computedStyle.get('margin-bottom').value
  return {
    width: elmWidth + elmMarginHorizontal,
    height: elmHeight + elmMarginVertical,
  }
}

const idx = 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"'.length
const renderElementUI = (elem, size, key, callback) => {
  domtoimage.toSvg(elem).then((uri) => {
    // To work around a bug in domtoimage, we insert a viewBox into the SVG that ensures it renders
    // all the way to the edges. otherwise, an image is generated that crops the left and bottom borders.
    const uri2 = uri.substring(0, idx) + ` viewBox="0 0 ${size.width} ${size.height}"` + uri.substring(idx)
    const image = new Image()
    image.onload = function () {
      callback(image, key)
    }
    // image.onerror = reject
    image.src = uri2
  })
}
const plane = new Plane(1, 1)

/**
 * Class representing a VR controller UI.
 * @extends TreeItem
 */
export default class VRControllerUI extends TreeItem {
  appData: AppData
  __vrUIDOMElement
  ready
  size
  /**
   * Create a VR controller UI.
   * @param {any} appData - The appData value.
   * @param {any} vrUIDOMElement - The vrUIDOMElement value.
   */
  constructor(appData, vrUIDOMElement) {
    super('VRControllerUI')

    this.setSelectable(false)
    this.appData = appData
    this.__vrUIDOMElement = vrUIDOMElement
    this.__vrUIDOMElement.style.display = 'none'

    // const debugGeomItem = new GeomItem('Debug', new Plane(1, 1), new Material('debug-ui-mat', 'FlatSurfaceShader'))
    // // Flip it over so we see the front.
    // const debugGeomItemXfo = new Xfo()
    // debugGeomItemXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI)
    // this.addChild(debugGeomItem, false)

    const uiOffset = new TreeItem('Offset')
    this.addChild(uiOffset, false)
    this.ready = false

    /* */
    const resizeObserver = new ResizeObserver((entries) => {
      resizeObserver.disconnect()

      const localXfo = new Xfo()
      const dpm = 0.0005 // dots-per-meter (1 each 1/2mm)
      localXfo.sc.set(dpm, dpm, dpm)
      localXfo.ori.setFromEulerAngles(new EulerAngles(Math.PI, Math.PI, 0))
      // localXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI)
      // localXfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI)
      uiOffset.getParameter('LocalXfo').setValue(localXfo)

      this.size = new Vec3(vrUIDOMElement.clientWidth * dpm, vrUIDOMElement.clientHeight * dpm, 1)

      // debugGeomItemXfo.sc = this.size
      // debugGeomItem.getParameter('LocalXfo').setValue(debugGeomItemXfo)

      traverse(vrUIDOMElement, 0, (elem, depth) => {
        if (elem.className == 'button') {
          const size = elemSize(elem)
          // console.log(depth, elem.id, elem.className, size.width, size.height, elem.offsetLeft, elem.offsetTop)
          const localXfo = new Xfo()

          localXfo.sc.set(size.width, -size.height, 1)

          // Note: The plane geom goes from [-0.5, -0.5] to [0.5, 0.5], so we need to offset it here.
          // To debug the placements of these UI elements, display tbe backing panel by making this class
          // in
          localXfo.tr.set(
            elem.offsetLeft + size.width * 0.5 - vrUIDOMElement.clientWidth * 0.5,
            elem.offsetTop + size.height * 0.5 - vrUIDOMElement.clientHeight * 0.5,
            -depth
          )

          const uimat = new Material('element-vr-ui-mat', 'FlatSurfaceShader')
          uimat.getParameter('BaseColor').setValue(new Color(0.3, 0.3, 0.3))
          const image = new DataImage()
          uimat.getParameter('BaseColor').setValue(image)

          const geomItem = new GeomItem('element-vr-ui', plane, uimat, localXfo)
          geomItem.setSelectable(false)
          uiOffset.addChild(geomItem, false)

          const imageDatas = {}
          if (size.width > 0 && size.height > 0) {
            renderElementUI(elem, size, elem.id + elem.className, (data, key) => {
              // console.log('Rendered', elem.id, elem.className, size.width, size.height, elem.offsetLeft, elem.offsetTop)
              imageDatas[key] = data
              image.setData(size.width, size.height, data)
            })
          }

          const mutationObserver = new MutationObserver((mutations) => {
            if (size.width == 0 || size.height == 0) return
            // Each time the dome changes, we use the classList as a key to cache
            // the generated images. Update the UI by adding and removing classes
            const key = elem.id + elem.className
            if (!imageDatas[key]) {
              renderElementUI(elem, size, key, (data, key) => {
                imageDatas[key] = data
                image.setData(size.width, size.height, data)
              })
            } else {
              image.setData(size.width, size.height, imageDatas[key])
            }
          })

          mutationObserver.observe(elem, {
            attributes: true,
            characterData: false,
            childList: false,
            subtree: false,
          })
          return false
        }
        return true
      })

      this.ready = true
      this.emit('ready')
    })
    resizeObserver.observe(vrUIDOMElement)
    /* */
  }

  // ///////////////////////////////////

  /**
   * The activate method.
   */
  activate() {
    this.__vrUIDOMElement.style.display = 'block'
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    this.__vrUIDOMElement.style.display = 'none'
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
