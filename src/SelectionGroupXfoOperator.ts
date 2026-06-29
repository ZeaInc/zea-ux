import {
  Xfo,
  Box3,
  KinematicGroup,
  Operator,
  XfoOperatorInput,
  NumberOperatorInput,
  XfoOperatorOutput,
  TreeItem,
  NumberParameter,
  XfoParameter,
} from '@zeainc/zea-engine'

const HANDLE_CENTER_MODES = {
  objectOrigin: 0,
  objectCentroid: 1,
  manual: 2,
}

/**
 * An operator for aiming items at targets.
 *
 * @extends {Operator}
 */
class SelectionGroupXfoOperator extends Operator {
  currGroupXfo: Xfo
  #pivotMode: number = HANDLE_CENTER_MODES.objectOrigin
  xfoOutput = new XfoOperatorOutput('GroupGlobalXfo')

  #manualXfoPlacement: Xfo = new Xfo()
  #manualXfoDelta: Xfo = new Xfo()
  baseXfo: Xfo = new Xfo()

  /**
   * Returns enum of available handle center modes.
   *
   * | Name | Value |
   * | --- | --- |
   * | objectOrigin | `0` |
   * | objectCentroid | `1` |
   */
  static get HANDLE_CENTER_MODES() {
    return HANDLE_CENTER_MODES
  }

  /**
   * Creates an instance of SelectionGroupXfoOperator.
   *
   * @param globalXfoParam - The GlobalXfo param found on the KinematicKinematicGroup.
   */
  constructor(globalXfoParam: XfoParameter) {
    super()
    this.addOutput(this.xfoOutput).setParam(globalXfoParam)

    this.currGroupXfo = new Xfo()
  }

  get pivotMode(): number {
    return this.#pivotMode
  }
  set pivotMode(mode: number) {
    if (mode !== this.#pivotMode) {
      if (mode == HANDLE_CENTER_MODES.manual) {
        this.#manualXfoPlacement = this.currGroupXfo.clone()
        this.#manualXfoDelta = new Xfo()
      }
      this.#pivotMode = mode
      this.setDirty()
    }
  }

  get pivotXfo(): Xfo {
    return this.currGroupXfo
  }

  set pivotXfo(xfo: Xfo) {
    this.pivotMode = HANDLE_CENTER_MODES.manual
    this.#manualXfoPlacement = xfo
    this.#manualXfoDelta = new Xfo()
    this.setDirty()
  }

  startChange(baseXfo: Xfo): void {
    this.baseXfo = baseXfo
  }
  setDeltaXfo(delta: Xfo) {
    if (this.pivotMode == HANDLE_CENTER_MODES.manual) {
      this.#manualXfoDelta = delta
      this.setDirty()
    }
  }
  endChange() {
    if (this.pivotMode == HANDLE_CENTER_MODES.manual) {
      this.#manualXfoPlacement.tr = this.#manualXfoDelta.tr.add(this.#manualXfoPlacement.tr)
      this.#manualXfoPlacement.ori = this.#manualXfoDelta.ori.multiply(this.#manualXfoPlacement.ori)
      this.#manualXfoDelta = new Xfo()
    }
  }

  /**
   * Updates operator inputs(`OperatorInput`) of current `Operator` using the specified `TreeItem`.
   *
   * @param item - The tree item being added
   */
  addItem(item: TreeItem): void {
    const xfoInput = new XfoOperatorInput('MemberGlobalXfo' + this.getNumInputs())
    xfoInput.setParam(item.globalXfoParam)
    this.addInput(xfoInput)
    this.setDirty()
  }

  /**
   * Finds and removes the `OperatorInput` of the specified `TreeItem` from current`Operator`.
   *
   * @param item - The Bind Xfo calculated from the initial Transforms of the KinematicGroup Members.
   */
  removeItem(item: TreeItem): void {
    // The first input it the 'InitialXfoMode', so remove the input for the specified item.
    const xfoParam = item.globalXfoParam
    for (let i = 0; i < this.getNumInputs(); i++) {
      const input: XfoOperatorInput = <XfoOperatorInput>this.getInputByIndex(i)
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
   * @param xfo - The new value being set to the Groups GlobalXfo param.
   */
  backPropagateValue(xfo: Xfo): void {}

  /**
   * Calculates a new Xfo for the group based on the members.
   */
  evaluate(): void {
    this.currGroupXfo = new Xfo()

    if (this.getNumInputs() == 0) {
      this.xfoOutput.setClean(this.currGroupXfo)
      return
    }

    if (this.pivotMode == HANDLE_CENTER_MODES.objectOrigin) {
      // Calculate the translation with the combined bounding box center.
      for (let i = 0; i < this.getNumInputs(); i++) {
        const itemXfo = this.getInputByIndex(i).getValue()
        this.currGroupXfo.tr.addInPlace(itemXfo.tr)

        // Note: Averaging rotations causes weird and confusing GizmoRotation.
        if (i == 0) this.currGroupXfo.ori = itemXfo.ori.clone()
      }
      this.currGroupXfo.tr.scaleInPlace(1 / this.getNumInputs())
    } else if (this.pivotMode == HANDLE_CENTER_MODES.objectCentroid) {
      // Override the translation with the combined bounding box center.
      const combinedBox = new Box3()
      for (let i = 0; i < this.getNumInputs(); i++) {
        const input: XfoOperatorInput = <XfoOperatorInput>this.getInputByIndex(i)
        const itemXfo = input.getValue()
        const treeItem = input.getParam().getOwner() as TreeItem
        if (treeItem) combinedBox.addBox3(treeItem.getBoundingBox())
        if (i == 0) this.currGroupXfo.ori = itemXfo.ori.clone()
      }
      if (combinedBox.isValid()) this.currGroupXfo.tr = combinedBox.center()
    } else if (this.pivotMode == HANDLE_CENTER_MODES.manual) {
      // this.currGroupXfo = this.manualXfoPlacement.multiply(this.manualXfoDelta)

      // this.currGroupXfo = this.manualXfoDelta.multiply(this.manualXfoPlacement)
      this.currGroupXfo.tr = this.#manualXfoDelta.tr.add(this.#manualXfoPlacement.tr)
      this.currGroupXfo.ori = this.#manualXfoDelta.ori.multiply(this.#manualXfoPlacement.ori)
    }

    this.xfoOutput.setClean(this.currGroupXfo)
  }
}

export default SelectionGroupXfoOperator
export { SelectionGroupXfoOperator }
