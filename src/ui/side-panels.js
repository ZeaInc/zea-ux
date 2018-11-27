class Panel {
  constructor(domElement, handleElement, panelSide) {
    this.domElement = domElement;

    handleElement.addEventListener('mousedown', initDrag, false);

    let startX, startWidth;

    function initDrag(e) {
      startX = e.clientX;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(domElement).width,
        10
      );
      document.addEventListener('mousemove', doDrag, false);
      document.addEventListener('mouseup', stopDrag, false);
    }

    function doDrag(e) {
      const delta = e.clientX - startX;
      let panelWidth = panelSide == 0 ? startWidth + delta : startWidth - delta;
      if (panelWidth < 40) panelWidth = 0;
      domElement.style.width = `${panelWidth}px`;
    }

    function stopDrag(e) {
      document.removeEventListener('mousemove', doDrag, false);
      document.removeEventListener('mouseup', stopDrag, false);
    }
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

    this.leftPanel = new Panel(panelElements[0], panelHandlers[0], 0);
    this.rightPanel = new Panel(panelElements[1], panelHandlers[1], 1);
  }
}
