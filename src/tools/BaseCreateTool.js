import BaseTool from './BaseTool'

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
  constructor(appData) {
    super(appData)
  }

  /**
   * Checks if the tool is a primary tool or not.
   *
   * @return {boolean} - Returns `true`.
   */
  isPrimaryTool() {
    return true
  }
}
