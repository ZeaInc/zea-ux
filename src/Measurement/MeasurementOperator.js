import { Operator, OperatorInput, OperatorOutput, StringParameter, Vec3, Xfo, Registry } from '@zeainc/zea-engine'

const IO_NAMES = {
  StartXfo: 'StartXfo',
  EndXfo: 'EndXfo',
  Distance: 'Distance',
  LabelXfo: 'LabelXfo',
  LineXfo: 'LineXfo',
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

    this.addInput(new OperatorInput(IO_NAMES.StartXfo))
    this.addInput(new OperatorInput(IO_NAMES.EndXfo))
    this.addOutput(new OperatorOutput(IO_NAMES.Distance))
    this.addOutput(new OperatorOutput(IO_NAMES.LabelXfo))
    this.addOutput(new OperatorOutput(IO_NAMES.LineXfo))
  }

  /**
   * Calculating outputs
   */
  evaluate() {
    const startXfo = this.getInput(IO_NAMES.StartXfo).getValue()
    const endXfo = this.getInput(IO_NAMES.EndXfo).getValue()
    const distanceOutput = this.getOutput(IO_NAMES.Distance)
    const labelXfoOutput = this.getOutput(IO_NAMES.LabelXfo)
    const lineXfoOutput = this.getOutput(IO_NAMES.LineXfo)
    const vector = endXfo.tr.subtract(startXfo.tr)
    const distance = vector.length()

    vector.normalizeInPlace()
    const midPoint = startXfo.tr.add(vector.scale(distance * 0.5))

    distanceOutput.setClean(`${parseFloat(distance.toFixed(3))}${this.unitsParameter.getValue()}`)

    const newLabelXfo = new Xfo(midPoint)
    newLabelXfo.ori.setFromDirectionAndUpvector(vector, new Vec3(vector.z, vector.x, vector.y))

    labelXfoOutput.setClean(newLabelXfo)
    const lineXfo = startXfo.clone()
    lineXfo.ori.setFromDirectionAndUpvector(vector, new Vec3(vector.z, vector.x, vector.y))
    lineXfo.sc.z = distance
    lineXfoOutput.setClean(lineXfo)
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

Registry.register('MeasurementOperator', MeasurementOperator)

export { MeasurementOperator }
