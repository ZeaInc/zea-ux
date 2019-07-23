class SidePanel {
  constructor(panelSide) {
    this.panelSide = panelSide;

    if (panelSide == 0) {
      this.domElement = document.createElement("div");
      this.domElement.className = 'SidePanel SidePanel--left overflow-auto pa2';
      this.handleElement = document.createElement("div");
      this.handleElement.className = 'PanelHandler bg-center bg-white';
    } else {
      this.handleElement = document.createElement("div");
      this.handleElement.className = 'PanelHandler bg-center bg-white';
      this.domElement = document.createElement("div");
      this.domElement.className = 'SidePanel SidePanel--right overflow-auto pa2';
    }

    // Side panels are collapsed by default.
    this.domElement.style.width = `0px`;

    let startX, startWidth;

    const initDrag = (event) => {
      startX = event.clientX;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(this.domElement).width,
        10
      ) * window.devicePixelRatio;
      document.addEventListener('mousemove', doDrag, false);
      document.addEventListener('mouseup', stopDrag, false);
    }

    const doDrag = (event) => {
      const delta = (event.clientX - startX) * window.devicePixelRatio;
      const panelWidth = panelSide == 0 ? startWidth + delta : startWidth - delta;
      if (panelWidth < 40) {
        this.domElement.style.display = "none";
        this.domElement.style.width = `0px`;
      } else {
        this.domElement.style.display = "block";
        this.domElement.style.width = `${panelWidth}px`;
      }
    }

    const stopDrag = (event) => {
      document.removeEventListener('mousemove', doDrag, false);
      document.removeEventListener('mouseup', stopDrag, false);
    }

    this.handleElement.addEventListener('mousedown', initDrag, false);


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


    this.handleElement.addEventListener("touchstart", (event) => {
      // console.log("onTouchStart");
      event.preventDefault();
      event.stopPropagation();

      startWidth = parseInt(
        document.defaultView.getComputedStyle(this.domElement).width,
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
    this.handleElement.addEventListener("touchmove", (event) => {
      const touches = event.changedTouches;
      if (touches.length == 1) {
        const touch = touches[0];
        // To get pixel values, we must take into account the devicePixelRatio
        const delta = (touch.clientX - startX) * window.devicePixelRatio;
        const panelWidth = panelSide == 0 ? startWidth + delta : startWidth - delta;
        if (panelWidth < 40) {
          this.domElement.style.display = "none";
          this.domElement.style.width = `0px`;
        } else {
          this.domElement.style.display = "block";
          this.domElement.style.width = `${panelWidth}px`;
        }

        // const touchPos = new Visualive.Vec2(touch.pageX, touch.pageY);
        // const touchData = __ongoingTouches[touch.identifier];
        // const dragVec = touchData.pos.subtract(touchPos);

        // let panelWidth = panelSide == 0 ? startWidth + dragVec.x : startWidth - dragVec.x;
        // if (panelWidth < 40) panelWidth = 0;
        // this.domElement.style.width = `${panelWidth}px`;

        event.stopPropagation();
      }
    }, false);
    this.handleElement.addEventListener("touchend", (event) => {
      event.preventDefault();
      event.stopPropagation();
      let touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        __endTouch(touches[i]);
      }
      event.stopPropagation();
    }, false);
    this.handleElement.addEventListener("touchcancel", (event) => {
      let touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        __endTouch(touches[i]);
      }
      event.stopPropagation();
    }, false);

  }

  getPanelWidget(){
    return this.widget;
  }

  setPanelWidget(widget) {
    if (this.widget) {
      this.widget.unMount(this.domElement);

      // Clean up the DOM in case a mess was lefft behind.
      while (this.domElement.firstChild) {
        this.domElement.removeChild(this.domElement.firstChild);
      }
    }

    this.widget = widget;

    if(this.widget) {
      this.domElement.style.display = "block";
      this.domElement.style.width = (widget.getDefaultWidth ? widget.getDefaultWidth() : 220) + 'px';

      this.widget.mount(this.domElement);
    }
    else {
      this.domElement.style.display = "none";
      this.domElement.style.width = `0px`;
    }
  }


  mount(parentElement) {
    this.parentDomElement = parentElement;
    if (this.panelSide == 0) {
      this.parentDomElement.appendChild(this.domElement);
      this.parentDomElement.appendChild(this.handleElement);
    }
    else {
      this.parentDomElement.appendChild(this.handleElement);
      this.parentDomElement.appendChild(this.domElement);
    }
  }

  unMount(parentElement) {
    this.parentDomElement.removeChild(this.domElement);
  }
}

class BottomPanel {
  constructor() {

    this.handleElement = document.createElement("div");
    this.handleElement.className = 'BottomPanelHandler bg-center bg-white z-1 bt';
    this.domElement = document.createElement("div");
    this.domElement.className = 'BottomPanel overflow-auto pa2';
    this.domElement.style.height = `0px`;

    let startY, startHeight;

    const initDrag = (event) => {
      startY = event.clientY;
      startHeight = parseInt(
        document.defaultView.getComputedStyle(this.domElement).height,
        10
      );
      document.addEventListener('mousemove', doDrag, false);
      document.addEventListener('mouseup', stopDrag, false);
    }

    const doDrag = (event) => {
      const delta = event.clientY - startY;
      let panelHeight = startHeight - delta;
      if (panelHeight < 40) panelHeight = 0;
      this.domElement.style.height = `${panelHeight}px`;
    }

    const stopDrag = (event) => {
      document.removeEventListener('mousemove', doDrag, false);
      document.removeEventListener('mouseup', stopDrag, false);
    }

    this.handleElement.addEventListener('mousedown', initDrag, false);
  }

  getPanelWidget(){
    return this.widget;
  }

  setPanelWidget(widget) {
    if (this.widget) {
      this.widget.unMount(this.domElement);

      // Clean up the DOM in case a mess was lefft behind.
      while (this.domElement.firstChild) {
        this.domElement.removeChild(this.domElement.firstChild);
      }
    }

    this.widget = widget;

    if(this.widget) {
      this.domElement.style.display = "block";
      this.domElement.style.height = (widget.getDefaultHeight ? widget.getDefaultHeight() : 180) + 'px';

      this.widget.mount(this.domElement);
    }
    else {
      this.domElement.style.display = "none";
      this.domElement.style.height = `0px`;
    }
  }

  mount(parentElement) {
    this.parentDomElement = parentElement;
    this.parentDomElement.appendChild(this.handleElement);
    this.parentDomElement.appendChild(this.domElement);
  }

  unMount(parentElement) {
    this.parentDomElement.removeChild(this.domElement);
  }

}


class Panels {
  constructor(parentDomElement) {
    this.sidePanelsWrapper = document.createElement("div");
    this.sidePanelsWrapper.className = 'PanelsWrapper flex overflow-hidden';
    parentDomElement.appendChild(this.sidePanelsWrapper);

    this.leftPanel = new SidePanel(0);
    this.leftPanel.mount(this.sidePanelsWrapper);

    this.viewportElement = document.createElement("div");
    this.viewportElement.className = 'Viewport flex-grow-1 bg-moon-gray overflow-hidden';
    this.viewportElement.id = 'viewport';
    this.sidePanelsWrapper.appendChild(this.viewportElement);

    this.rightPanel = new SidePanel(1);
    this.rightPanel.mount(this.sidePanelsWrapper);

    this.bottomPanel = new BottomPanel();
    this.bottomPanel.mount(parentDomElement);
  }
}
export {
  Panels
}