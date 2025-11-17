import { BaseEvent, BaseTool, BaseToolEventMap } from '@zeainc/zea-engine'
import { AppData } from '../../types/types'

interface BaseCreateToolEventMap extends BaseToolEventMap {
  actionFinished: BaseEvent
  highlight: BaseEvent
  unhighlight: BaseEvent
  dragStart: BaseEvent
  drag: BaseEvent
  dragEnd: BaseEvent
}

/**
 * Class representing a primary create tool.
 *
 * @extends BaseTool
 */
export default class BaseCreateTool extends BaseTool {
  appData: AppData
  /**
   * Creates an instance of BaseCreateTool.
   *
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super()
    this.appData = appData
  }

  // #region Event Emitter Interfaces

  on<K extends keyof BaseCreateToolEventMap>(
    eventName: K,
    callback: (event?: BaseCreateToolEventMap[K]) => void
  ): number {
    return super.on(eventName as any, callback)
  }

  off<K extends keyof BaseCreateToolEventMap>(
    eventName: K,
    listenerOrId: number | ((event?: BaseCreateToolEventMap[K]) => void)
  ) {
    return super.off(eventName as any, listenerOrId)
  }

  emit<K extends keyof BaseCreateToolEventMap>(eventName: K, event?: BaseCreateToolEventMap[K]): void {
    super.emit(eventName as any, event)
  }

  // #endregion
}
