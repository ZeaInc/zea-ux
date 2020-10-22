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
    const lineXfoOutput = this.getOutput(IO_NAMES.LabelXfo)
    const vector = endXfo.tr.subtract(startXfo.tr)
    const distance = vector.length()
    console.log('MeasurementOperator Evaluation Started with dist:', distance)

    vector.normalizeInPlace()
    const midPoint = startXfo.tr.add(vector.scale(distance * 0.5))

    distanceOutput.setClean(`${distance}${this.unitsParameter.getValue()}`)

    const newLabelXfo = new Xfo(midPoint)

    /* const angle = this.__calcAngle(startXfo.tr, endXfo.tr)
    if (angle) {
      const eulerAngles = new EulerAngles(angle, 0, 0)
      console.log('Euler:', eulerAngles)
      newLabelXfo.ori.setFromEulerAngles(eulerAngles)
    }*/

    labelXfoOutput.setClean(newLabelXfo)
    const lineXfo = startXfo.clone()
    lineXfo.ori.setFromDirectionAndUpvector(vector, new Vec3(vector.z, vector.x, vector.y))
    lineXfo.sc.z = distance
    lineXfoOutput.setClean(lineXfo)
  }

  /**
   *
   *
   * @param {Ve3} initialPoint
   * @param {Vec3} finalPoint
   * @return {number}
   * @private
   */
  __calcAngle(initialPoint, finalPoint) {
    const dot = initialPoint.dot(finalPoint)
    const angleInRad = Math.acos(dot / (initialPoint.length() * finalPoint.length()))
    console.log('Deg Angle:', (180 * angleInRad) / Math.PI)
    return (180 * angleInRad) / Math.PI
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
