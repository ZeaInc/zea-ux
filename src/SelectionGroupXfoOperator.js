import {
  Xfo,
  TreeItem,
  Group,
  Operator,
  OperatorInput,
  OperatorOutput,
} from '@zeainc/zea-engine'

/** An operator for aiming items at targets.
 * @extends Operator
 *
 */
export default class SelectionGroupXfoOperator extends Operator {
  /**
   * Create a GroupMemberXfoOperator operator.
   * @param {Parameter} groupGlobalXfoParam - The GlobalXfo param found on the Group.
   */
  constructor(initialXfoModeParam, globalXfoParam) {
    super()
    this.addInput(new OperatorInput('InitialXfoMode')).setParam(
      initialXfoModeParam
    )
    this.addOutput(new OperatorOutput('GroupGlobalXfo')).setParam(
      globalXfoParam
    )
  }

  /**
   * adds a new item to the SelectionGroupXfoOperator.
   * @param {TreeItem} item - The tree item being added
   */
  addItem(item) {
    this.addInput(
      new OperatorInput('MemberGlobalXfo' + this.getNumInputs())
    ).setParam(item.getParameter('GlobalXfo'))
    this.setDirty()
  }

  /**
   * removes an item that was previously added to the SelectionGroupXfoOperator.
   * @param {TreeItem} item - The Bind Xfo calculated from the initial Transforms of the Group Members.
   */
  removeItem(item) {
    // The first input it the 'InitialXfoMode', so remove the input for the specified item.
    const xfoParam = item.getParameter('GlobalXfo')
    for (let i = 1; i < this.getNumInputs(); i++) {
      const input = this.getInputByIndex(i)
      if (input.getParam() == xfoParam) {
        this.removeInput(input)
        this.setDirty()
        return
      }
    }
    throw new Error('Item not found in SelectionGroupXfoOperator')
  }

  /**
   * Move the group. When the selection group is manipulated, this method is called. Here we propagate the delta to each of the selection members.
   * @param {Xfo} xfo - The new value being set to the Groups GlobalXfo param.
   */
  setValue(xfo) {
    const groupTransformOutput = this.getOutput('GroupGlobalXfo')
    const currGroupXfo = groupTransformOutput.getValue()
    const invXfo = currGroupXfo.inverse()
    const delta = xfo.multiply(invXfo)
    for (let i = 1; i < this.getNumInputs(); i++) {
      const input = this.getInputByIndex(i)
      const currXfo = input.getValue()
      const result = delta.multiply(currXfo)
      input.setValue(result)
    }
  }

  /**
   * Calculate a new Xfo for the group based on the members.
   */
  evaluate() {
    const groupTransformOutput = this.getOutput('GroupGlobalXfo')
    const xfo = new Xfo()

    if (this.getNumInputs() == 1) {
      groupTransformOutput.setClean(xfo)
      return
    }

    const initialXfoMode = this.getInput('InitialXfoMode').getValue()
    if (initialXfoMode == Group.INITIAL_XFO_MODES.manual) {
      // The xfo is manually set by the current global xfo.
      groupTransformOutput.setClean(groupTransformOutput.getValue())
      return
    } else if (initialXfoMode == Group.INITIAL_XFO_MODES.first) {
      groupTransformOutput.setClean(this.getInputByIndex(1).getValue())
    } else if (initialXfoMode == Group.INITIAL_XFO_MODES.average) {
      xfo.ori.set(0, 0, 0, 0)
      let numTreeItems = 0
      for (let i = 1; i < this.getNumInputs(); i++) {
        const itemXfo = this.getInputByIndex(i).getValue()
        xfo.tr.addInPlace(itemXfo.tr)
        xfo.ori.addInPlace(itemXfo.ori)
        numTreeItems++
      }
      xfo.tr.scaleInPlace(1 / numTreeItems)
      xfo.ori.normalizeInPlace()
      // xfo.sc.scaleInPlace(1/ numTreeItems);
      groupTransformOutput.setClean(xfo)
    } else if (initialXfoMode == Group.INITIAL_XFO_MODES.globalOri) {
      let numTreeItems = 0
      for (let i = 1; i < this.getNumInputs(); i++) {
        const itemXfo = this.getInputByIndex(i).getValue()
        xfo.tr.addInPlace(itemXfo.tr)
        numTreeItems++
      }
      xfo.tr.scaleInPlace(1 / numTreeItems)
      groupTransformOutput.setClean(xfo)
    } else {
      throw new Error('Invalid Group.INITIAL_XFO_MODES.')
    }
  }
}
