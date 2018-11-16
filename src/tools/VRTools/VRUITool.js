import domtoimage from 'dom-to-image';
import BaseTool from '../BaseTool.js';

export default class VRUITool extends BaseTool {
  constructor(appData, vrUIDOMHolderElement, vrUIDOMElement) {
    super(appData);

    this.__vrUIDOMHolderElement = vrUIDOMHolderElement;
    this.__vrUIDOMElement = vrUIDOMElement;
    this.__triggerHeld = false;


    const uimat = new Visualive.Material('uimat', 'FlatSurfaceShader');

    this.__uiimage = new Visualive.DataImage();
    uimat.getParameter('BaseColor').setValue(this.__uiimage);
    // uimat.getParameter('BaseColor').setValue(new Visualive.Color(0.3, 0.3, 0.3));

    this.__uiGeomItem = new Visualive.GeomItem('VRControllerUI', new Visualive.Plane(1, 1), uimat);
    this.__uiGeomOffsetXfo = new Visualive.Xfo();
    this.__uiGeomOffsetXfo.sc.set(0, 0, 1);
    // Flip it over so we see the front.
    this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI);
    this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo);
    this.__uiLocalXfo = new Visualive.Xfo();
    this.__uiLocalXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * -0.6);
    this.__dims = {
      width: 200,
      height: 300
    };
    this.__uiGeomItem.addRef(this)


    const pointermat = new Visualive.Material('pointermat', 'LinesShader');
    pointermat.getParameter('Color').setValue(new Visualive.Color(1.2, 0, 0));

    const line = new Visualive.Lines();
    line.setNumVertices(2);
    line.setNumSegments(1);
    line.setSegment(0, 0, 1);
    line.getVertex(0).set(0.0, 0.0, 0.0);
    line.getVertex(1).set(0.0, 0.0, -1.0);
    line.setBoundingBoxDirty();
    this.__pointerLocalXfo = new Visualive.Xfo();
    this.__pointerLocalXfo.sc.set(1, 1, 0.1);
    this.__pointerLocalXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * -0.2);

    this.__uiPointerItem = new Visualive.GeomItem('VRControllerPointer', line, pointermat);
    // this.__uiPointerItem.setLocalXfo(this.__pointerLocalXfo);
    this.__uiPointerItem.addRef(this)

    this.__triggerDown = false;
    this.__renderRequested = false;

    // this.__vrUIDOMHolderElement.style.display = "block";
    // domtoimage.toPng(this.__vrUIDOMElement)
    // .then( (dataUrl) => {
    //     var img = new Image();
    //     img.src = dataUrl;
    //     document.body.appendChild(img);
    //     this.__vrUIDOMHolderElement.style.display = "none";
    // })
    // .catch((error) => {
    //     console.error('oops, something went wrong!', error);
    // });
  }

  /////////////////////////////////////

  setUIControllers(uiController, pointerController, headXfo) {
    this.uiController = uiController;
    this.pointerController = pointerController;

    const xfoA = this.uiController.getTreeItem().getGlobalXfo();
    if(this.pointerController) {
      const xfoB = this.pointerController.getTreeItem().getGlobalXfo();
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
      const headToCtrlB = xfoB.tr.subtract(headXfo.tr);
      if (headToCtrlA.cross(headToCtrlB).dot(headXfo.ori.getYaxis()) > 0.0) {
        this.__uiLocalXfo.tr.set(0.1, -0.07, 0.05);
      } else {
        this.__uiLocalXfo.tr.set(-0.1, -0.07, 0.05);
      }
    }
    else {
      this.__uiLocalXfo.tr.set(0, -0.07, 0.05);
    }

    this.__uiGeomItem.setLocalXfo(this.__uiLocalXfo);
  }

  activateTool() {
    super.activateTool();

    this.__vrUIDOMHolderElement.style.display = "block";
    this.renderUIToImage();

    this.uiController.getTipItem().addChild(this.__uiGeomItem, false);
    if(this.pointerController) 
      this.pointerController.getTipItem().addChild(this.__uiPointerItem, false);


    this.appData.visualiveSession.pub('pose-message', {
      interfaceType: 'Vive',
      showUIPanel: {
        controllerId: this.uiController.getId(),
        localXfo: this.__uiLocalXfo.toJSON(),
        size: this.__uiGeomOffsetXfo.sc.toJSON()
      }
    });
  }

  deactivateTool() {
    super.deactivateTool();
    this.uiController.getTipItem().removeAllChildren();
    if(this.pointerController)
      this.pointerController.getTipItem().removeAllChildren();

    this.__vrUIDOMHolderElement.style.display = "none";

    this.appData.visualiveSession.pub('pose-message', {
      interfaceType: 'Vive',
      hideUIPanel: {
        controllerId: this.uiController.getId()
      }
    });
  }

  /////////////////////////////////////
  // VRController events

  setPointerLength(length) {
    this.__pointerLocalXfo.sc.set(1, 1, length);
    this.__uiPointerItem.setLocalXfo(this.__pointerLocalXfo);
  }

  renderUIToImage() {
    domtoimage.toPixelData(this.__vrUIDOMElement)
      .then((pixels) => {
        const rect = this.__vrUIDOMElement.getBoundingClientRect();
        // let dpm = 0.0003; //dots-per-meter (1 each 1/2mm)
        let dpm = 0.0005; //dots-per-meter (1 each 1/2mm)
        this.__uiGeomOffsetXfo.sc.set(rect.width * dpm, rect.height * dpm, 1.0);
        this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo)
        this.__uiimage.setData(rect.width, rect.height, new Uint8Array(pixels.buffer));

        this.appData.visualiveSession.pub('pose-message', {
          interfaceType: 'Vive',
          updateUIPanel: {
            size: this.__uiGeomOffsetXfo.sc.toJSON()
          }
        });
      });
  }

  sendMouseEvent(eventName, args, element) {

    if (eventName == 'mousedown')
      console.log("clientX:" + args.clientX + " clientY:" + args.clientY);

    const event = new MouseEvent(eventName, Object.assign({
      target: element,
      view: window,
      bubbles: true,
      composed: true,
      cancelable: true
    }, args));

    // Dispatch the event to a leaf item in the DOM tree.
    element.dispatchEvent(event);

    // Update the UI. (this may be too slow.)
    if(!this.__renderRequested){
      this.__renderRequested = true;
      setTimeout(()=> {
        this.renderUIToImage();
        this.__renderRequested = false;
      }, 100);
    }

    return event;
  }

  calcUIIntersection() {

    const pointerXfo = this.__uiPointerItem.getGlobalXfo();
    const pointervec = pointerXfo.ori.getZaxis().negate();
    const ray = new Visualive.Ray(pointerXfo.tr, pointervec);

    const planeXfo = this.__uiGeomItem.getGeomXfo();
    const plane = new Visualive.Ray(planeXfo.tr, planeXfo.ori.getZaxis());
    const res = ray.intersectRayPlane(plane);
    if (res <= 0) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5);
      return;
    }
    const hitOffset = pointerXfo.tr.add(pointervec.scale(res)).subtract(plane.start);
    const x = hitOffset.dot(planeXfo.ori.getXaxis()) / planeXfo.sc.x;
    const y = hitOffset.dot(planeXfo.ori.getYaxis()) / planeXfo.sc.y;
    if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5);
      return;
    }
    this.setPointerLength(res);
    const rect = this.__vrUIDOMElement.getBoundingClientRect();
    return {
      clientX: Math.round((x * rect.width) + (rect.width / 2)),
      clientY: Math.round((y * -rect.height) + (rect.height / 2))
    }
  }

  sendEventToVisibleUIs(eventName, args) {
    const hit = this.calcUIIntersection();
    if(hit){
      hit.offsetX = hit.pageX = hit.pageX = hit.screenX = hit.clientX;
      hit.offsetY = hit.pageY = hit.pageY = hit.screenY = hit.clientY;
      const element = document.elementFromPoint(hit.clientX, hit.clientY);
      return this.sendMouseEvent(eventName, Object.assign(args, hit), element);
    }
  }

  onVRControllerButtonDown(event) {

    if (event.controller == this.pointerController) {
      this.__triggerHeld = true;
      const res = this.sendEventToVisibleUIs('mousedown', {
        button: event.button - 1
      });
      if(res) {
        this.__triggerDownElem = res.target;
      }
      else {
        this.__triggerDownElem = null;
      }
    }

    // While the UI is open, no other tools get events.
    return true;
  }

  onVRControllerButtonUp(event) {

    if (event.controller == this.pointerController) {
      this.__triggerHeld = false;
      const res = this.sendEventToVisibleUIs('mouseup', {
        button: event.button - 1
      });
      if(res && this.__triggerDownElem == res.target) {
        this.sendMouseEvent('click', res, res.target);
      }
      this.__triggerDownElem = null;
    }

    // While the UI is open, no other tools get events.
    return true;
  }

  onVRPoseChanged(event) {

    // Controller coordinate system
    // X = Horizontal.
    // Y = Up.
    // Z = Towards handle base.
    const headXfo = event.viewXfo;
    const checkControllers = () => {
      const xfoA = this.uiController.getTreeItem().getGlobalXfo();
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
      headToCtrlA.normalizeInPlace();
      if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) > (Math.PI * 0.5)) {
        // Remove ourself from the system.
        this.appData.toolManager.removeTool(this.index);
        return false;
      }
      return true;
    }

    // if (!this.__triggerHeld) {
    //   if(checkControllers()){
    //     this.calcUIIntersection();
    //   }
    // } else {
    if(checkControllers()){
      this.sendEventToVisibleUIs('mousemove', {});
    }

    // While the UI is open, no other tools get events.
    return true;
  }

};