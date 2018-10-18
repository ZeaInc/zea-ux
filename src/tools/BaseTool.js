
// Note: we can't import Visualive because
// parcel will cause the package to be loaded 2x. 
// The Visualive global is only created once 
// the main index file is loaded.
export default class BaseTool { // extends Visualive.ParameterOwner {
  constructor(undoRedoManager) {
    // super();
    this.undoRedoManager = undoRedoManager;

    this.actionFinished = new Visualive.Signal();

    this.__params = []
  }


  addParameter(param) {
      const name = param.getName();
      // if(this.__paramMapping[name] != undefined) {
      //     console.warn("Replacing Parameter:" + name)
      //     this.removeParameter(name);
      // }
      // this.__paramSignalIds[name] = param.valueChanged.connect((mode) => this.parameterValueChanged.emit(param, mode));
      // param.addRef(this);
      this.__params.push(param)
      // this.__paramMapping[name] = this.__params.length - 1;
      // this.parameterAdded.emit(name);
      return param;
  }

  /////////////////////////////////////


  activateTool(viewport) {
  }

  deactivateTool(renderer) {

  }

  /////////////////////////////////////
  // Mouse events

  onMouseDown(event, mousePos, viewport) {}

  onMouseMove(event, mousePos, viewport) {}

  onMouseUp(event, mousePos, viewport) {}

  onWheel(event, viewport) {}

  /////////////////////////////////////
  // Keyboard events
  onKeyPressed(key, event, viewport) {}

  onKeyDown(key, event, viewport) {}

  onKeyUp(key, event, viewport) {}

  /////////////////////////////////////
  // Touch events
  onTouchStart(event, viewport) {}

  onTouchMove(event, viewport) {}

  onTouchEnd(event, viewport) {}

  onTouchCancel(event, viewport) {}

  /////////////////////////////////////
  // VRController events
  onVRControllerDown(event, viewport) {}

  onVRControllerMove(event, viewport) {}

  onVRControllerUp(event, viewport) {}

};
