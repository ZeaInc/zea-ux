import Action from './Action.js';

/** Class representing a tool action.
 * @extends Action
 */
class ToolAction extends Action {
  /**
   * Create a tool action.
   * @param {any} name - The name value.
   * @param {any} path - The path value.
   * @param {any} availableInVR - The availableInVR value.
   * @param {any} toolManager - The toolManager value.
   * @param {any} tool - The tool value.
   */
  constructor(name, path, availableInVR, toolManager, tool) {
    super(name, path, availableInVR);
    this.toolManager = toolManager;
    this.tool = tool;
    this.state = false;
    this.activatedChanged = new ZeaEngine.Signal();

    tool.installChanged.connect(state => {
      this.activatedChanged.emit(state);
    });
  }

  /**
   * The callback method.
   */
  callback() {
    if (!this.tool.installed()) {
      const currTool = this.toolManager.currTool();
      if (currTool.getName() == 'VRUITool') {
        // Note: when activating new tools in VR, we
        // can insert the new tool below the VRUI tool,
        // so that once the VR UI is closed, it becomes
        // the new active tool.
        this.toolManager.insertToolBefore(this.tool, currTool);
      } else {
        if (currTool.isPrimaryTool()) {
          this.toolManager.replaceCurrentTool(this.tool);
        } else {
          this.toolManager.pushTool(this.tool);
        }
      }
      // this.state = true;
    } else {
      this.toolManager.removeToolByHandle(this.tool);
      // this.state = false;
    }
    // this.activatedChanged.emit(this.state)
  }
}

export { ToolAction };
