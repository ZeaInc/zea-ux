import { BaseTool } from '@zeainc/zea-engine'
import { AppData } from '../../types/temp'

/**
 * Class representing a primary create tool.
 *
 * @extends BaseTool
 */
export default class BaseCreateTool extends BaseTool {
  /**
   * Creates an instance of BaseCreateTool.
   *
   * @param {object} appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)
  }
}
