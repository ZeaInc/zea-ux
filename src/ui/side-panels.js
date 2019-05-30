class SidePanel {
  constructor(domElement, handleElement, panelSide) {
    this.domElement = domElement;

    let startX, startWidth;
    function initDrag(event) {
      startX = event.clientX;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(domElement).width,
        10
      ) * window.devicePixelRatio;
      document.addEventListener('mousemove', doDrag, false);
      document.addEventListener('mouseup', stopDrag, false);
    }

    function doDrag(event) {
      const delta = (event.clientX - startX) * window.devicePixelRatio;
      const panelWidth = panelSide == 0 ? startWidth + delta : startWidth - delta;
      if (panelWidth < 40){
        domElement.style.display = "none";
        domElement.style.width = `0px`;
      } 
      else {
        domElement.style.display = "block";
        domElement.style.width = `${panelWidth}px`;
      }
    }

    function stopDrag(event) {
      document.removeEventListener('mousemove', doDrag, false);
      document.removeEventListener('mouseup', stopDrag, false);
    }

    handleElement.addEventListener('mousedown', initDrag, false);


    /////////////////////////////////////
    // Touch events
    const __ongoingTouches = {};
    const __startTouch = (touch, viewport) => {
      __ongoingTouches[touch.identifier] = {
        identifier: touch.identifier,
        pos: new Visualive.Vec2(touch.pageX, touch.pageY)
      };
    }
    const __endTouch = (touch, viewport) => {
      // let idx = this.__ongoingTouchIndexById(touch.identifier);
      // __ongoingTouches.splice(idx, 1); // remove it; we're done
      delete __ongoingTouches[touch.identifier];
    }


    handleElement.addEventListener("touchstart", (event) => {
      // console.log("onTouchStart");
      event.preventDefault();
      event.stopPropagation();

      startWidth = parseInt(
        document.defaultView.getComputedStyle(domElement).width,
        10
      ) * window.devicePixelRatio;
      const touches = event.changedTouches;
      if (touches.length == 1) {
        startX = touches[0].clientX;
        for (let i = 0; i < touches.length; i++) {
          __startTouch(touches[i]);
        }
        event.stopPropagation();
      }

    }, false);
    handleElement.addEventListener("touchmove", (event) => {
      const touches = event.changedTouches;
      if (touches.length == 1) {
        const touch = touches[0];
        // To get pixel values, we must take into account the devicePixelRatio
        const delta = (touch.clientX - startX) * window.devicePixelRatio; 
        const panelWidth = panelSide == 0 ? startWidth + delta : startWidth - delta;
        if (panelWidth < 40){
          domElement.style.display = "none";
          domElement.style.width = `0px`;
        } 
        else {
          domElement.style.display = "block";
          domElement.style.width = `${panelWidth}px`;
        }

        // const touchPos = new Visualive.Vec2(touch.pageX, touch.pageY);
        // const touchData = __ongoingTouches[touch.identifier];
        // const dragVec = touchData.pos.subtract(touchPos);

        // let panelWidth = panelSide == 0 ? startWidth + dragVec.x : startWidth - dragVec.x;
        // if (panelWidth < 40) panelWidth = 0;
        // domElement.style.width = `${panelWidth}px`;

        event.stopPropagation();
      }
    }, false);
    handleElement.addEventListener("touchend", (event) => {
      event.preventDefault();
      event.stopPropagation();
      let touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        __endTouch(touches[i]);
      }
      event.stopPropagation();
    }, false);
    handleElement.addEventListener("touchcancel", (event) => {
      let touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        __endTouch(touches[i]);
      }
        event.stopPropagation();
    }, false);

  }

  setPanelWidget(widget) {
    if (this.widget) {
      this.widget.unMount();
    }

    this.widget = widget;
    this.widget.mount();
  }
}

class BottomPanel {
  constructor(domElement, handleElement) {
    this.domElement = domElement;

    let startY, startHeight;

    function initDrag(event) {
      startY = event.clientY;
      startHeight = parseInt(
        document.defaultView.getComputedStyle(domElement).height,
        10
      );
      document.addEventListener('mousemove', doDrag, false);
      document.addEventListener('mouseup', stopDrag, false);
    }

    function doDrag(event) {
      const delta = event.clientY - startY;
      let panelHeight = startHeight - delta;
      if (panelHeight < 10) panelHeight = 0;
      domElement.style.height = `${panelHeight}px`;
    }

    function stopDrag(event) {
      document.removeEventListener('mousemove', doDrag, false);
      document.removeEventListener('mouseup', stopDrag, false);
    }

    handleElement.addEventListener('mousedown', initDrag, false);
  }

  setPanelWidget(widget) {
    if (this.widget) {
      this.widget.unMount();
    }

    this.widget = widget;
    this.widget.mount();
  }
}


export default class Panels {
  constructor() {
    this.viewportElement = document.getElementById('viewport');
    const panelElements = document.getElementsByClassName('SidePanel');
    const panelHandlers = document.getElementsByClassName('PanelHandler');

    this.leftPanel = new SidePanel(panelElements[0], panelHandlers[0], 0);
    this.rightPanel = new SidePanel(panelElements[1], panelHandlers[1], 1);


    const bottomPanelHandler = document.getElementsByClassName('BottomPanelHandler');
    const bottomPanel = document.getElementById('bottomPanel');
    if(bottomPanelHandler && bottomPanel) {
      this.bottomPanel = new BottomPanel(bottomPanel, bottomPanelHandler[0]);
    }
  }
}
