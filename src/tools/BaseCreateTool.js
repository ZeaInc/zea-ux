import BaseTool from './BaseTool.js';

/**
 * Class representing base create tool.
 * @extends BaseTool
 */
export default class BaseCreateTool extends BaseTool {
  /**
   * Create a base create tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData);
  }

  isPrimaryTool() {
    return true;
  }
}
