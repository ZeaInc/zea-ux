import { Xfo, KinematicGroup, Operator, OperatorInput, OperatorOutput } from '@zeainc/zea-engine'

/**
 * An operator for aiming items at targets.
 *
 * @extends {Operator}
 */
class SelectionGroupXfoOperator extends Operator {
  /**
   * Creates an instance of SelectionGroupXfoOperator.
   *
   * @param {number} initialXfoModeParam - Initial XFO Mode, check `INITIAL_XFO_MODES` in `KinematicGroup` documentation
   * @param {XfoParameter} globalXfoParam - The GlobalXfo param found on the KinematicKinematicGroup.
   */
  constructor(initialXfoModeParam, globalXfoParam) {
    super()
    this.addInput(new OperatorInput('InitialXfoMode')).setParam(initialXfoModeParam)
    this.addOutput(new OperatorOutput('GroupGlobalXfo')).setParam(globalXfoParam)

    this.currGroupXfo = new Xfo()
  }

  /**
   * Updates operator inputs(`OperatorInput`) of current `Operator` using the specified `TreeItem`.
   *
   * @param {TreeItem} item - The tree item being added
   */
  addItem(item) {
    this.addInput(new OperatorInput('MemberGlobalXfo' + this.getNumInputs())).setParam(item.getParameter('GlobalXfo'))
    this.setDirty()
  }

  /**
   * Finds and removes the `OperatorInput` of the specified `TreeItem` from current`Operator`.
   *
   * @param {TreeItem} item - The Bind Xfo calculated from the initial Transforms of the KinematicGroup Members.
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
   * Move the group. When the selection group is manipulated, this method is called.
   * Here we propagate the delta to each of the selection members.
   *
   * @param {Xfo} xfo - The new value being set to the Groups GlobalXfo param.
   */
  backPropagateValue(xfo) {
    const invXfo = this.currGroupXfo.inverse()
    const delta = xfo.multiply(invXfo)
    delta.ori.normalizeInPlace()

    // During interactive manipulation, it is possible on heavy scenes
    // that multiple backPropagateValue calls occur between renders.
    // Note: that the currGroupXfo would not be re-computed in that time,
    // and to this means that we cannot calculate the delta based on the current
    // Value of the output. ('GroupGlobalXfo')
    // By updating the cache of the currGroupXfo value, a successive call to
    // backPropagateValue will apply to the result of the previous call to backPropagateValue
    this.currGroupXfo = delta.multiply(this.currGroupXfo)
    for (let i = 1; i < this.getNumInputs(); i++) {
      const input = this.getInputByIndex(i)
      const currXfo = input.getValue()
      const result = delta.multiply(currXfo)
      input.setValue(result)
    }
  }

  /**
   * Calculates a new Xfo for the group based on the members.
   */
  evaluate() {
    const groupTransformOutput = this.getOutput('GroupGlobalXfo')
    this.currGroupXfo = new Xfo()

    if (this.getNumInputs() == 1) {
      groupTransformOutput.setClean(this.currGroupXfo)
      return
    }

    const initialXfoMode = this.getInput('InitialXfoMode').getValue()
    if (initialXfoMode == KinematicGroup.INITIAL_XFO_MODES.manual) {
      // The xfo is manually set by the current global xfo.
      this.currGroupXfo = groupTransformOutput.getValue().clone()
      return
    } else if (initialXfoMode == KinematicGroup.INITIAL_XFO_MODES.first) {
      const itemXfo = this.getInputByIndex(1).getValue()
      this.currGroupXfo.tr = itemXfo.tr.clone()
      this.currGroupXfo.ori = itemXfo.ori.clone()
    } else if (initialXfoMode == KinematicGroup.INITIAL_XFO_MODES.average) {
      this.currGroupXfo.ori.set(0, 0, 0, 0)
      let numTreeItems = 0
      for (let i = 1; i < this.getNumInputs(); i++) {
        const itemXfo = this.getInputByIndex(i).getValue()
        this.currGroupXfo.tr.addInPlace(itemXfo.tr)

        // Note: Averaging rotations causes weird and confusing GizmoRotation.
        if (numTreeItems == 0) this.currGroupXfo.ori.addInPlace(itemXfo.ori)
        numTreeItems++
      }
      this.currGroupXfo.tr.scaleInPlace(1 / numTreeItems)
      // this.currGroupXfo.sc.scaleInPlace(1 / numTreeItems);
    } else if (initialXfoMode == KinematicGroup.INITIAL_XFO_MODES.globalOri) {
      let numTreeItems = 0
      for (let i = 1; i < this.getNumInputs(); i++) {
        const itemXfo = this.getInputByIndex(i).getValue()
        this.currGroupXfo.tr.addInPlace(itemXfo.tr)
        numTreeItems++
      }
      this.currGroupXfo.tr.scaleInPlace(1 / numTreeItems)
    } else {
      throw new Error('Invalid KinematicGroup.INITIAL_XFO_MODES.')
    }
    this.currGroupXfo.ori.normalizeInPlace()
    groupTransformOutput.setClean(this.currGroupXfo)
  }
}

export default SelectionGroupXfoOperator
export { SelectionGroupXfoOperator }
