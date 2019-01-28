import domtoimage from './dom-to-image.js';

const VR_UI_ELEM_CLASS = 'VRUIElement';

export default class VRControllerUI extends Visualive.GeomItem {
  constructor(appData, vrUIDOMHolderElement, vrUIDOMElement) {

    const uimat = new Visualive.Material('uimat', 'FlatSurfaceShader');
    uimat.visibleInGeomDataBuffer = false;

    super('VRControllerUI', new Visualive.Plane(1, 1), uimat)

    this.appData = appData;
    this.__vrUIDOMHolderElement = vrUIDOMHolderElement;
    this.__vrUIDOMElement = vrUIDOMElement;

    this.__uiimage = new Visualive.DataImage();
    // uimat.getParameter('BaseColor').setValue(new Visualive.Color(0.3, 0.3, 0.3));
    uimat.getParameter('BaseColor').setValue(this.__uiimage);

    this.__uiGeomOffsetXfo = new Visualive.Xfo();
    this.__uiGeomOffsetXfo.sc.set(0, 0, 1);
    this.__rect = { width:0, height: 0 };

    // Flip it over so we see the front.
    this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI);
    this.setGeomOffsetXfo(this.__uiGeomOffsetXfo);
    this.__uiLocalXfo = new Visualive.Xfo();
    this.__uiLocalXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * -0.6);

    const vrui_elements = this.__vrUIDOMElement.getElementsByClassName(VR_UI_ELEM_CLASS);

    this.__mutationObserver = new MutationObserver((mutations) => {
      if(!this.mainCtx) {
        this.renderUIToImage();
        return;
      }
      const mutatedVRUIElements = new Set();
      // console.log("mutations:", mutations.length)
      mutations.some((mutation) => {
        let result = true;
        // Find the nearest ancestor element that has our special class assigned.
        let elem = mutation.target;
        while(elem.parentNode) {
          if(elem == this.__vrUIDOMElement) {
            this.renderUIToImage();
            mutatedVRUIElements.clear();
            return false;
            break;
          }
          // console.log(elem.classList)
          if(elem.classList.contains(VR_UI_ELEM_CLASS) || elem == this.__vrUIDOMElement) {
            mutatedVRUIElements.add(elem);
            break;
          }
          elem = elem.parentNode;
        }
        return result;
      });

      // Update the UI. (this may be too slow.)
      // if(!this.__renderRequested){
      //   this.__renderRequested = true;
      //   setTimeout(()=> {
      //     this.renderUIToImage();
      //     this.__renderRequested = false;
      //   }, 1);
      // }
      // console.log("mutatedVRUIElements:", mutatedVRUIElements.size)
      const promises = [];
      mutatedVRUIElements.forEach(elem => {
        promises.push(this.updateElemInAtlas(elem))
      });
      Promise.all(promises).then(()=>{
        this.updateUIImage();
      });

    });

    this.__active = false;
    this.__renderRequested = false;


  }

  /////////////////////////////////////

  activate() {
    this.__vrUIDOMHolderElement.style.display = "block";
    this.__active = true;

    this.__mutationObserver.observe(this.__vrUIDOMElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
    this.renderUIToImage();

  }

  deactivate() {
    this.__vrUIDOMHolderElement.style.display = "none";
    this.__active = true;
    this.__mutationObserver.disconnect()
  }

  /////////////////////////////////////
  // VRController events

  updateElemInAtlas(elem) {
    return new Promise((resolve, reject) => {
      domtoimage.toCanvas(elem)
        .then((canvas) => {
          const rect = elem.getBoundingClientRect();
          // Sometimes a render request occurs as the UI is being hidden.
          if((rect.width * rect.height) == 0){
            resolve()
            return;
          }
          // console.log(rect.width, rect.height, rect.x, rect.y)
          this.mainCtx.drawImage(canvas, rect.x, rect.y);
          resolve()
        });
    })
  }

  updateUIImage() {
    const imageData = this.mainCtx.getImageData(0,0, this.__rect.width, this.__rect.height);
    this.__uiimage.setData(this.__rect.width, this.__rect.height, new Uint8Array(imageData.data.buffer));
  }

  renderUIToImage() {
     domtoimage.toCanvas(this.__vrUIDOMElement)
      .then((canvas) => {
        this.mainCtx = canvas.getContext('2d');

        const rect = this.__vrUIDOMElement.getBoundingClientRect();
        // Sometimes a rendeer request occurs as the UI is being hidden.
        if((rect.width * rect.height) == 0)
          return;

        // const dpm = 0.0003; //dots-per-meter (1 each 1/2mm)
        if(rect.width != this.__rect.width || rect.height != this.__rect.height) {
          this.__rect = rect;
          const dpm = 0.0007; //dots-per-meter (1 each 1/2mm)
          this.__uiGeomOffsetXfo.sc.set(this.__rect.width * dpm, this.__rect.height * dpm, 1.0);
          this.setGeomOffsetXfo(this.__uiGeomOffsetXfo)

          this.appData.visualiveSession.pub('pose-message', {
            interfaceType: 'Vive',
            updateUIPanel: {
              size: this.__uiGeomOffsetXfo.sc.toJSON()
            }
          });
        }
        this.updateUIImage();
      });
  }

  sendMouseEvent(eventName, args, element) {
    // console.log(eventName, element)

    if (eventName == 'mousedown')
      console.log("clientX:" + args.clientX + " clientY:" + args.clientY);

    const event = new MouseEvent(eventName, Object.assign({
      // target: element,
      view: window,
      bubbles: true,
      // composed: true,
      cancelable: true
    }, args));

    // Dispatch the event to a leaf item in the DOM tree.
    element.dispatchEvent(event);

    // // Update the UI. (this may be too slow.)
    // if(!this.__renderRequested){
    //   this.__renderRequested = true;
    //   setTimeout(()=> {
    //     this.renderUIToImage();
    //     this.__renderRequested = false;
    //   }, 1);
    // }

    // return event;
  }

};