import { Operator, OperatorInput, OperatorOutput, StringParameter, OperatorOutputMode } from '@zeainc/zea-engine'

const IO_NAMES = {
  StartXfo: 'StartXfo',
  EndXfo: 'EndXfo',
  Distance: 'Distance',
  LabelXfo: 'LabelXfo',
}

/**
 *
 *
 * @extends {Operator}
 */
class MeasurementOperator extends Operator {
  /**
   * Creates an instance of MeasurementOperator.
   * @param {string} name - The name value
   */
  constructor(name) {
    super(name)

    this.unitsParameter = this.addParameter(new StringParameter('Units', 'm'))
    this.unitsParameter.on('valueChange', () => console.log('Units Changed'))

    this.addInput(new OperatorInput('StartXfo'))
    this.addInput(new OperatorInput('EndXfo'))
    this.addOutput(new OperatorOutput('Distance', OperatorOutputMode.OP_READ_WRITE))
    this.addOutput(new OperatorOutput('LabelXfo', OperatorOutputMode.OP_READ_WRITE))
  }

  /**
   * Calculating outputs
   */
  evaluate() {
    const startXfo = this.getInput(IO_NAMES.StartXfo).getValue()
    const endXfo = this.getInput(IO_NAMES.EndXfo).getValue()
    const distanceOutput = this.getOutput(IO_NAMES.Distance)
    const labelXfo = this.getOutput(IO_NAMES.LabelXfo).getValue()
    distanceOutput.setClean(`${startXfo.tr.distanceTo(endXfo.tr)}${this.unitsParameter.getValue()}`)
  }

  /**
   *
   *
   * @readonly
   * @static
   */
  static get IO_NAMES() {
    return IO_NAMES
  }
}

export { MeasurementOperator }
