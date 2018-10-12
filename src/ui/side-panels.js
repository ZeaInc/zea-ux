

export default function setupPanels() {
  const panelHandlers = document.getElementsByClassName('PanelHandler');
  const viewportElement = document.getElementById('viewport');
  Object.keys(panelHandlers).forEach(i => {
    const panelHandler = panelHandlers[i];
    const panel = document.getElementsByClassName('SidePanel')[i];
    const isLeftPanel = i == 0;

    panelHandler.addEventListener('mousedown', initDrag, false);

    let startX, startWidth;

    function initDrag(e) {
      startX = e.clientX;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(panel).width,
        10
      );
      document.addEventListener('mousemove', doDrag, false);
      document.addEventListener('mouseup', stopDrag, false);
    }

    function doDrag(e) {
      const delta = e.clientX - startX;
      let panelWidth = isLeftPanel
          ? startWidth + delta
          : startWidth - delta;
      if(panelWidth < 40)
        panelWidth = 0;
      panel.style.width = `${panelWidth}px`;
    }

    function stopDrag(e) {
      document.removeEventListener('mousemove', doDrag, false);
      document.removeEventListener('mouseup', stopDrag, false);
    }
  });
}