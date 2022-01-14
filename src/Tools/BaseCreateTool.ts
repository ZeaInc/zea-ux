import { BaseTool } from '@zeainc/zea-engine'
import { AppData } from '../../types/types'

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
   * @param {object} appData - The appData value.
   */
  constructor(appData: AppData) {
    super()
    this.appData = appData
  }
}
