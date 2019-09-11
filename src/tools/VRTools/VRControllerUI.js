import domtoimage from './dom-to-image.js';

const VR_UI_ELEM_CLASS = 'VRUIElement';

/**
 * Class representing a VR controller UI.
 * @extends ZeaEngine.GeomItem
 */
export default class VRControllerUI extends ZeaEngine.GeomItem {
  /**
   * Create a VR controller UI.
   * @param {any} appData - The appData value.
   * @param {any} vrUIDOMHolderElement - The vrUIDOMHolderElement value.
   * @param {any} vrUIDOMElement - The vrUIDOMElement value.
   */
  constructor(appData, vrUIDOMHolderElement, vrUIDOMElement) {
    const uimat = new ZeaEngine.Material('uimat', 'FlatSurfaceShader');
    uimat.visibleInGeomDataBuffer = false;

    super('VRControllerUI', new ZeaEngine.Plane(1, 1), uimat);

    this.appData = appData;
    this.__vrUIDOMHolderElement = vrUIDOMHolderElement;
    this.__vrUIDOMElement = vrUIDOMElement;

    this.__uiimage = new ZeaEngine.DataImage();
    // uimat.getParameter('BaseColor').setValue(new ZeaEngine.Color(0.3, 0.3, 0.3));
    uimat.getParameter('BaseColor').setValue(this.__uiimage);

    this.__uiGeomOffsetXfo = new ZeaEngine.Xfo();
    this.__uiGeomOffsetXfo.sc.set(0, 0, 1);
    this.__rect = { width: 0, height: 0 };

    // Flip it over so we see the front.
    this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(
      new ZeaEngine.Vec3(0, 1, 0),
      Math.PI
    );
    this.setGeomOffsetXfo(this.__uiGeomOffsetXfo);

    let renderRequestedId;
    let mutatedElems = [];
    const processMutatedElems = () => {
      renderRequestedId = null;
      const promises = mutatedElems.map(elem => {
        return this.updateElemInAtlas(elem);
      });
      Promise.all(promises).then(() => {
        this.updateUIImage();
        // console.log("Update Time:", performance.now() - start, mutatedElems.length);
        mutatedElems = [];
      });
    };
    this.__mutationObserver = new MutationObserver(mutations => {
      if (!this.mainCtx) {
        this.renderUIToImage();
        return;
      }
      // console.log("mutations:", mutations.length)
      mutations.some(mutation => {
        let elem = mutation.target;
        while (elem.parentNode) {
          if (elem == this.__vrUIDOMElement) {
            this.renderUIToImage();
            mutatedElems = [];
            return false;
            break;
          }
          // console.log(elem.classList)
          if (
            elem.classList.contains(VR_UI_ELEM_CLASS) ||
            elem == this.__vrUIDOMElement
          ) {
            if (mutatedElems.indexOf(elem) == -1) mutatedElems.push(elem);
            break;
          }
          elem = elem.parentNode;
        }
        return true;
      });

      // Batch the changes.
      if (renderRequestedId) clearTimeout(renderRequestedId);
      renderRequestedId = setTimeout(processMutatedElems, 50);
    });

    this.__active = false;
    this.__renderRequested = false;
  }

  // ///////////////////////////////////

  /**
   * The activate method.
   */
  activate() {
    this.__vrUIDOMHolderElement.style.display = 'block';
    this.__active = true;

    this.__mutationObserver.observe(this.__vrUIDOMElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
    this.renderUIToImage();
  }

  /**
   * The deactivate method.
   */
  deactivate() {
    this.__vrUIDOMHolderElement.style.display = 'none';
    this.__active = true;
    this.__mutationObserver.disconnect();
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The updateElemInAtlas method.
   * @param {any} elem - The elem param.
   * @return {any} The return value.
   */
  updateElemInAtlas(elem) {
    return new Promise((resolve, reject) => {
      domtoimage.toCanvas(elem).then(canvas => {
        const rect = elem.getBoundingClientRect();
        // Sometimes a render request occurs as the UI is being hidden.
        if (rect.width * rect.height == 0) {
          resolve();
          return;
        }
        // console.log(rect.width, rect.height, rect.x, rect.y)
        // this.mainCtx.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.mainCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.mainCtx.drawImage(canvas, rect.x, rect.y);
        resolve();
      });
    });
  }

  /**
   * The updateUIImage method.
   */
  updateUIImage() {
    const imageData = this.mainCtx.getImageData(
      0,
      0,
      this.__rect.width,
      this.__rect.height
    );
    this.__uiimage.setData(
      this.__rect.width,
      this.__rect.height,
      new Uint8Array(imageData.data.buffer)
    );
  }

  /**
   * The renderUIToImage method.
   */
  renderUIToImage() {
    domtoimage.toCanvas(this.__vrUIDOMElement).then(canvas => {
      this.mainCtx = canvas.getContext('2d');
      this.mainCtx.fillStyle = '#FFFFFF';

      const rect = this.__vrUIDOMElement.getBoundingClientRect();
      // Sometimes a rendeer request occurs as the UI is being hidden.
      if (rect.width * rect.height == 0) return;

      // const dpm = 0.0003; //dots-per-meter (1 each 1/2mm)
      if (
        rect.width != this.__rect.width ||
        rect.height != this.__rect.height
      ) {
        this.__rect = rect;
        const dpm = 0.0007; // dots-per-meter (1 each 1/2mm)
        this.__uiGeomOffsetXfo.sc.set(
          this.__rect.width * dpm,
          this.__rect.height * dpm,
          1.0
        );
        this.setGeomOffsetXfo(this.__uiGeomOffsetXfo);

        this.appData.visualiveSession.pub('pose-message', {
          interfaceType: 'VR',
          updateUIPanel: {
            size: this.__uiGeomOffsetXfo.sc.toJSON(),
          },
        });
      }
      this.updateUIImage();
    });
  }

  /**
   * The sendMouseEvent method.
   * @param {any} eventName - The eventName param.
   * @param {any} args - The args param.
   * @param {any} element - The element param.
   * @return {any} The return value.
   */
  sendMouseEvent(eventName, args, element) {
    // console.log(eventName, element)

    // if (eventName == 'mousedown')
    //   console.log("clientX:" + args.clientX + " clientY:" + args.clientY);

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
    );

    // Dispatch the event to a leaf item in the DOM tree.
    element.dispatchEvent(event);

    // The event is re-cycled to generate a 'click' event on mouse down.
    return event;
  }
}
