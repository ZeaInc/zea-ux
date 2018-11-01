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
    this.__uiLocalXfo = new Visualive.Xfo();
    this.__uiLocalXfo.sc.set(0.3, 0.2, 1.0);
    this.__uiLocalXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * -0.6);
    this.__dims = {
      width: 200,
      height: 300
    };
    // this.__uiGeomItem.setVisible(false);
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

    this.__uiPointerItem = new Visualive.GeomItem('VRControllerPointer', line, pointermat);
    this.__uiPointerItem.getLocalXfo().ori.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * -0.2);
    this.__uiPointerItem.addRef(this)
    this.__uiPointerItem.setLocalXfo(this.__pointerLocalXfo);


  }

  /////////////////////////////////////

  setUIControllers(uiController, pointerController, headXfo) {
    this.uiController = uiController;
    this.pointerController = pointerController;

    const xfoA = this.uiController.getTreeItem().getGlobalXfo();
    const xfoB = this.pointerController.getTreeItem().getGlobalXfo();
    const headToCtrlA = xfoA.tr.subtract(headXfo.tr);
    const headToCtrlB = xfoB.tr.subtract(headXfo.tr);
    if (headToCtrlA.cross(headToCtrlB).dot(headXfo.ori.getYaxis()) > 0.0) {
      this.__uiLocalXfo.tr.set(0.1, -0.07, 0.05);
    } else {
      this.__uiLocalXfo.tr.set(-0.1, -0.07, 0.05);
    }

    this.__uiGeomItem.setLocalXfo(this.__uiLocalXfo);
  }

  activateTool() {
    super.activateTool();

    this.uiController.getTipItem().addChild(this.__uiGeomItem, false);
    this.pointerController.getTipItem().addChild(this.__uiPointerItem, false);

    this.__vrUIDOMHolderElement.style.display = "block";
    this.renderUIToImage();
  }

  deactivateTool() {
    super.deactivateTool();
    this.uiController.getTipItem().removeAllChildren();
    this.pointerController.getTipItem().removeAllChildren();

    this.__vrUIDOMHolderElement.style.display = "none";
  }

  /////////////////////////////////////
  // VRController events

  setPointerLength(length) {
    this.__pointerLocalXfo.sc.set(1, 1, length);
    this.__uiPointerItem.setLocalXfo(this.__pointerLocalXfo);
  }

  setUIPixelData(width, height, pixels) {
    this.__dims = {
        width,
        height
    };
    let dpm = 0.0005; //dots-per-meter (1 each 1/2mm)
    this.__uiLocalXfo.sc.set(width * dpm, height * dpm, 1.0);
    this.__uiGeomItem.setGeomOffsetXfo(this.__uiLocalXfo)
    this.__uiimage.setData(width, height, pixels);
  }

  renderUIToImage() {
    domtoimage.toPixelData(this.__vrUIDOMElement)
      .then(function(pixels) {
        const width = this.__vrUIDOMElement.scrollWidth;
        const height = this.__vrUIDOMElement.scrollHeight;
        this.setUIPixelData(width, height, pixels)
      });
  }

  sendMouseEvent(eventName, args) {

    if (eventName == 'mousedown')
      console.log("clientX:" + args.clientX + " clientY:" + args.clientY);

    args.offsetX = args.pageX = args.pageX = args.screenX = args.clientX;
    args.offsetY = args.pageY = args.pageY = args.screenY = args.clientY;

    const event = new MouseEvent(eventName, extend({
      'view': window,
      'bubbles': true,
      'composed': true,
      'cancelable': true
    }, args));

    // Dispatch the event to a leaf item in the DOM tree.
    const element = document.elementFromPoint(args.clientX, args.clientY);
    element.dispatchEvent(event);

    // Update the UI. (this may be too slow.)
    this.renderUIToImage()
  }

  sendEventToVisibleUIs(eventName, args) {
    const pointerXfo = this.pointerController.getTipXfo();
    const pointervec = pointerXfo.ori.getZaxis().negate();
    const ray = new Ray(pointerXfo.tr, pointervec);

    const planeXfo = this.__uiGeomItem.getGlobalXfo();
    const plane = new Ray(planeXfo.tr, planeXfo.ori.getZaxis());
    const res = ray.intersectRayPlane(plane);
    if (res <= 0) {
      vrController.setPointerLength(0);
      return;
    }
    const hitOffset = xfo.tr.add(pointervec.scale(res)).subtract(plane.start);
    const x = hitOffset.dot(planeXfo.ori.getXaxis()) / planeXfo.sc.x;
    const y = hitOffset.dot(planeXfo.ori.getYaxis()) / planeXfo.sc.y;
    if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      vrController.setPointerLength(0);
      return;
    }
    vrController.setPointerLength(res);
    const rect = this.__vrUIDOMElement.getBoundingClientRect();
    args.clientX = Math.round((x * rect.width) + (rect.width / 2));
    args.clientY = Math.round((y * -rect.height) + (rect.height / 2));

    this.sendMouseEvent(eventName, args);
  }

  onVRControllerButtonDown(event, vrviewport) {

    if (event.controller == this.pointerController) {
      this.__triggerHeld = true;
    }

    this.sendEventToVisibleUIs('mousedown', {
      button: event.button - 1
    });


    // While the UI is open, no other tools get events.
    return true;
  }

  onVRControllerButtonUp(event, vrviewport) {

    if (event.controller == this.pointerController) {
      this.__triggerHeld = false;
    }

    this.sendEventToVisibleUIs('mouseup', {
      button: event.button - 1
    });

    // While the UI is open, no other tools get events.
    return true;
  }

  onVRPoseChanged(event, vrviewport) {

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
      }
    }

    if (!this.__triggerHeld) {
      checkControllers();
    } else {
      this.sendEventToVisibleUIs('mousemove', {});
    }

    // While the UI is open, no other tools get events.
    return true;
  }

};