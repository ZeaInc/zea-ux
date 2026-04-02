/* eslint-disable require-jsdoc */
import { BaseTool, ZeaMouseEvent, ZeaKeyboardEvent, BaseToolEventMap, BaseEvent } from '@zeainc/zea-engine'

interface ToolManagerEventMap extends BaseToolEventMap {
  toolChanged: BaseEvent
}

/**
 * @extends BaseTool
 */
class ToolManager extends BaseTool {
  toolStack: BaseTool[] = []
  tools: Record<string, BaseTool> = {}
  constructor() {
    super()
    this.tools = {}
    this.toolStack = []
  }

  registerTool(toolName: string, tool: BaseTool): void {
    this.tools[toolName] = tool
  }

  insertTool(tool: string | BaseTool, index: number): void {
    if (!(tool instanceof BaseTool)) {
      tool = this.tools[tool]
    }
    tool.activateTool()
    this.toolStack.splice(index, 0, tool)
    this.emit('toolChanged', { tool: this.activeToolName() })
  }

  removeTool(tool: string | BaseTool): void {
    if (!(tool instanceof BaseTool)) {
      tool = this.tools[tool]
    }
    tool.deactivateTool()
    const index = this.toolStack.indexOf(tool)
    this.toolStack.splice(index, 1)
    this.emit('toolChanged', { tool: this.activeToolName() })
  }

  pushTool(tool: string | BaseTool): void {
    if (!(tool instanceof BaseTool)) {
      tool = this.tools[tool]
    }
    tool.activateTool()
    this.toolStack.push(tool)

    this.emit('toolChanged', { tool: this.activeToolName() })
  }

  popTool(): void {
    if (this.toolStack.length == 0) {
      throw Error('Tool stack is empty')
    }
    const tool = this.toolStack.pop()
    tool.deactivateTool()
    this.emit('toolChanged', { tool: this.activeToolName() })
  }

  /**
   * Returns the tool currently at the top of the stack.
   * @return - the currently active tool.
   */
  activeTool(): BaseTool | undefined {
    if (this.toolStack.length > 0) {
      return this.toolStack[this.toolStack.length - 1]
    }
  }

  /**
   * Returns the name of the tool currently at the top of the stack.
   * @return - the name of the tool.
   */
  activeToolName(): string {
    if (this.toolStack.length > 0) {
      const tool = this.toolStack[this.toolStack.length - 1]
      for (const key in this.tools) {
        if (this.tools[key] == tool) return key
      }
    }
    return ''
  }

  // ///////////////////////////////////
  // Pointer events

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the tool.
   *
   * @param event - The event param.
   */
  onPointerDown(event: ZeaMouseEvent): void {
    for (let i = this.toolStack.length - 1; i >= 0; i--) {
      const tool = this.toolStack[i]
      tool.onPointerDown(event)
      if (!event.propagating) break
    }
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside it.
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaMouseEvent): void {
    for (let i = this.toolStack.length - 1; i >= 0; i--) {
      const tool = this.toolStack[i]
      tool.onPointerMove(event)
      if (!event.propagating) break
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the tool.
   *
   * @param event - The event param.
   */
  onPointerUp(event: ZeaMouseEvent): void {
    for (let i = this.toolStack.length - 1; i >= 0; i--) {
      const tool = this.toolStack[i]
      tool.onPointerUp(event)
      if (!event.propagating) break
    }
  }

  /**
   * Event fired when a pointing device button is released and released in the same location.
   *
   * @param event - The event param.
   */
  onPointerClick(event: ZeaMouseEvent): void {
    for (let i = this.toolStack.length - 1; i >= 0; i--) {
      const tool = this.toolStack[i]
      tool.onPointerClick(event)
      if (!event.propagating) break
    }
  }

  /**
   * Event fired when a pointing device button is double clicked on the tool.
   *
   * @param event - The event param.
   */
  onPointerDoubleClick(event: ZeaMouseEvent): void {
    for (let i = this.toolStack.length - 1; i >= 0; i--) {
      const tool = this.toolStack[i]
      tool.onPointerDoubleClick(event)
      if (!event.propagating) break
    }
  }

  /**
   * Event fired when the user rotates the pointing device wheel.
   *
   * @param event - The event param.
   */
  onWheel(event: ZeaMouseEvent): void {
    for (let i = this.toolStack.length - 1; i >= 0; i--) {
      const tool = this.toolStack[i]
      tool.onWheel(event)
      if (!event.propagating) break
    }
  }

  // ///////////////////////////////////
  // Keyboard events

  /**
   * Event fired when the user presses down a key on the keyboard.
   *
   * @param event - The event param.
   */
  onKeyDown(event: ZeaKeyboardEvent): void {
    for (let i = this.toolStack.length - 1; i >= 0; i--) {
      const tool = this.toolStack[i]
      tool.onKeyDown(event)
      if (!event.propagating) break
    }
  }

  /**
   * Event fired when the user releases a key on the keyboard.
   *
   * @param event - The event param.
   */
  onKeyUp(event: ZeaKeyboardEvent): void {
    for (let i = this.toolStack.length - 1; i >= 0; i--) {
      const tool = this.toolStack[i]
      tool.onKeyUp(event)
      if (!event.propagating) break
    }
  }

  // #region Event Emitter Interfaces

  on<K extends keyof ToolManagerEventMap>(eventName: K, callback: (event?: ToolManagerEventMap[K]) => void): number {
    return super.on(eventName as any, callback)
  }

  off<K extends keyof ToolManagerEventMap>(
    eventName: K,
    listenerOrId: number | ((event?: ToolManagerEventMap[K]) => void)
  ) {
    return super.off(eventName as any, listenerOrId)
  }

  emit<K extends keyof ToolManagerEventMap>(eventName: K, event?: ToolManagerEventMap[K]): void {
    super.emit(eventName as any, event)
  }

  // #endregion
}

export { ToolManager }
