import {
  Vec3,
  Xfo,
  Color,
  Ray,
  TreeItem,
  GeomItem,
  Material,
  Plane,
  DataImage,
  NumberParameter,
} from '@zeainc/zea-engine'

import domtoimage from './Tools/VRTools/dom-to-image.js'

// Thankyou: https://stackoverflow.com/questions/19715620/javascript-get-element-at-point-outside-viewport/21779484
const elementFromAbsolutePoint = (elem, x, y) => {
  /* stash current Window Scroll */
  const scrollX = window.pageXOffset
  const scrollY = window.pageYOffset
  /* scroll to element */
  window.scrollTo(x, y)
  /* calculate new relative element coordinates */
  const newX = x - window.pageXOffset
  const newY = y - window.pageYOffset
  /* grab the element */
  const elm = elem.elementFromPoint(newX, newY)
  /* revert to the previous scroll location */
  window.scrollTo(scrollX, scrollY)
  /* returned the grabbed element at the absolute coordinates */
  return elm
}

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
 * The DomTree enables User interfaces to be built using the browser DOM, then displaying those interfaces in 3d and capturing
 * interactions in 3d to update the UI.
 * The DomTree class manages rasterizing a DOM tree to an array of images and then displaying in 3d on plane geometies.
 * Pointer events received on the DOMTree class are then propagated back to the source DOM tree which can then trigger
 * the DomTree to re-render images that are then displayed in 3D.
 * @extends TreeItem
 */
class DomTree extends TreeItem {
  /**
   * Create a VR controller UI.
   * @param {string} name - The name of the treeItem.
   * @param {HTMLElement} domElement - The domElement value.
   */
  constructor(name, domElement) {
    super(name)

    this.domElement = domElement
    this.pixelsPerMeter = new NumberParameter('PixelsPerMeter', 2000.0)
    this.pixelsPerMeter.on('valueChanged', () => {
      const sc = 1 / this.pixelsPerMeter.getValue()
      localXfo.sc.set(sc, sc, sc)
      unitsConversion.getParameter('LocalXfo').setValue(localXfo)
    })
    this.addParameter(this.pixelsPerMeter)

    const unitsConversion = new TreeItem('Units')

    // const debugGeomItem = new GeomItem('Debug', new Plane(1, 1), new Material('debug-ui-mat', 'FlatSurfaceShader'))
    // // Flip it over so we see the front.
    // const debugGeomItemXfo = new Xfo()
    // debugGeomItemXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI)
    // this.addChild(debugGeomItem, false)

    const localXfo = new Xfo()
    const sc = 1 / this.pixelsPerMeter.getValue()
    localXfo.sc.set(sc, sc, sc)
    // localXfo.tr.set(-domElement.clientWidth * 0.5 * sc, -domElement.clientHeight * 0.5 * sc, 0.0)
    unitsConversion.getParameter('LocalXfo').setValue(localXfo)
    this.addChild(unitsConversion)
    this.size = new Vec3(domElement.clientWidth * sc, domElement.clientHeight * sc, 1)
    this.ready = false

    /* */
    const resizeObserver = new ResizeObserver((entries) => {
      resizeObserver.disconnect()

      this.size.set(domElement.clientWidth * sc, domElement.clientHeight * sc, 1)

      // debugGeomItemXfo.sc = this.size
      // debugGeomItem.getParameter('LocalXfo').setValue(debugGeomItemXfo)

      traverse(domElement, 0, (elem, depth) => {
        if (elem.classList.contains('widget')) {
          const size = elemSize(elem)
          // console.log(depth, elem.id, elem.className, size.width, size.height, elem.offsetLeft, elem.offsetTop)
          const localXfo = new Xfo()
          localXfo.sc.set(size.width, size.height, 1)

          // Note: The plane geom goes from [-0.5, -0.5] to [0.5, 0.5], so we need to offset it here.
          // To debug the placements of these UI elements, display tbe backing panel by making this class in
          localXfo.tr.set(
            -(elem.offsetLeft + size.width * 0.5 - domElement.offsetLeft),
            elem.offsetTop + size.height * 0.5 - domElement.offsetTop,
            depth
          )
          localXfo.ori.setFromAxisAndAngle(new Vec3(0, 0, 1), Math.PI)

          const uimat = new Material('element-vr-ui-mat', 'FlatSurfaceShader')
          uimat.getParameter('BaseColor').setValue(new Color(0.3, 0.3, 0.3))
          const image = new DataImage()
          uimat.getParameter('BaseColor').setValue(image)

          const geomItem = new GeomItem('element-vr-ui', plane, uimat, localXfo)
          // geomItem.setSelectable(false)
          unitsConversion.addChild(geomItem, false)

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
            characterData: true,
            childList: true,
            subtree: true,
          })
          return false
        }
        return true
      })

      this.ready = true
      this.emit('ready')
    })
    resizeObserver.observe(domElement)
    /* */
  }

  // ///////////////////////////////////

  /**
   * The activate method.
   */
  __updateVisibility() {
    if (super.__updateVisibility()) {
      if (this.__visibleCounter > 0) this.domElement.style.display = 'block'
      else this.domElement.style.display = 'none'
    }
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

  /**
   * The calcUIIntersection method.
   * @param {Ray} ray - The ray to intersect the UI with.
   * @param {string} eventName - The name of the simulated event to emit.
   * @param {object} eventParams - The params, such as which mouse buttons should be pressed for the simulated event.
   * @return {number} The distance along the ray of the intersection point.
   */
  rayIntersect(ray, eventName, eventParams) {
    const planeXfo = this.getParameter('GlobalXfo').getValue()
    const plane = new Ray(planeXfo.tr, planeXfo.ori.getZaxis().negate())
    const res = ray.intersectRayPlane(plane)
    if (res <= 0) {
      if (this._element) {
        this.sendMouseEvent('mouseleave', Object.assign(eventParams, hit), this._element)
        this._element = null
      }
      return -1
    }
    const hitOffset = planeXfo.inverse().transformVec3(ray.pointAtDist(res))
    const pageX = -hitOffset.x * this.pixelsPerMeter.getValue() + this.domElement.offsetLeft
    const pageY = hitOffset.y * this.pixelsPerMeter.getValue() + this.domElement.offsetTop
    const hit = Object.assign(eventParams, {
      pageX,
      pageY,
      clientX: pageX - this.domElement.offsetLeft,
      clientY: pageY - this.domElement.offsetTop,
    })
    hit.offsetX = hit.screenX = hit.clientX
    hit.offsetY = hit.screenY = hit.clientY
    let element = elementFromAbsolutePoint(document, pageX, pageY)
    if (element) {
      if (element.shadowRoot) element = elementFromAbsolutePoint(element.shadowRoot, pageX, pageY)
      if (element != this._element) {
        if (this._element) this.sendMouseEvent('mouseleave', hit, this._element)
        this._element = element
        this.sendMouseEvent('mouseenter', hit, this._element)
      }
      this.sendMouseEvent(eventName, hit, this._element)
    } else {
      if (this._element) {
        this.sendMouseEvent('mouseleave', Object.assign(eventParams, hit), this._element)
        this._element = null
      }
    }
    return res
  }

  /**
   * The onVRPoseChanged method.
   * @param {object} event - The event param.
   */
  onPointerMove(event) {
    const ray = event.intersectionData.ray ? event.intersectionData.ray : event.intersectionData.pointerRay
    this.rayIntersect(ray, 'mousemove', {})
    event.stopPropagation()
    if (event.preventDefault) event.preventDefault()
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {object} event - The event param.
   */
  onPointerDown(event) {
    const ray = event.intersectionData.ray ? event.intersectionData.ray : event.intersectionData.pointerRay
    this.rayIntersect(ray, 'mousedown', {})
    event.stopPropagation()
    if (event.preventDefault) event.preventDefault()
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {object} event - The event param.
   */
  onPointerUp(event) {
    const ray = event.intersectionData.ray ? event.intersectionData.ray : event.intersectionData.pointerRay
    this.rayIntersect(ray, 'mouseup', {})
    event.stopPropagation()
    if (event.preventDefault) event.preventDefault()
  }
}

export { DomTree }
