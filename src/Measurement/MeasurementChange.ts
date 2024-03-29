import { Registry, TreeItem } from '@zeainc/zea-engine'
import { MeasureAngle, MeasureDistance } from '.'
import { UndoRedoManager, Change } from '../UndoRedo/index'

/**
 * Represents a Measurement change.
 *
 * @extends Change
 */
class MeasurementChange extends Change {
  measurement: MeasureDistance
  measurementType: string
  parentItem: TreeItem
  parentItemPath: Array<string>
  childIndex: number
  /**
   * Creates an instance of MeasurementChange.
   *
   * @param measurement - The parent that the measurement will be added to.
   */
  constructor(measurement: TreeItem) {
    super('MeasurementChange')

    if (measurement) {
      this.measurement = <MeasureDistance>measurement
    }
  }

  /**
   *
   *
   * @param data - An object containing potentially the start and end positions.
   * @memberof MeasurementChange
   */
  update(data: Record<string, any>): void {
    this.measurement.fromJSON(data.measurementData)
    this.emit('updated', data)
  }

  /**
   *
   */
  end(): void {
    this.measurement.setGeomBuffersVisibility(true)
  }

  /**
   * Removes recently created geometry from its parent.
   */
  undo(): void {
    console.log('undo MeasurementChange')
    this.parentItem = <TreeItem>this.measurement.getOwner()
    this.childIndex = this.parentItem.getChildIndex(this.measurement)
    this.parentItem.removeChild(this.childIndex)
  }

  /**
   * Restores recently created geometry and adds it to the specified parent tree item.
   */
  redo(): void {
    console.log('redo MeasurementChange')
    this.parentItem.insertChild(this.measurement, this.childIndex)
  }

  /**
   * Serializes the change as a JSON object.
   *
   * @param context - The context value
   * @return {Record<any,any>} - The serialized change
   */
  toJSON(context: Record<any, any>): Record<string, any> {
    const j: Record<any, any> = super.toJSON(context)
    j.parentItemPath = this.measurement.getOwner().getPath()
    j.measurementType = Registry.getClassName(Object.getPrototypeOf(this.measurement).constructor)
    j.measurementData = this.measurement.toJSON(context)
    return j
  }

  /**
   * Restores geometry from using the specified JSON
   *
   * @param j - The j param.
   * @param context - The appData param.
   */
  fromJSON(j: Record<string, any>, context: Record<string, any>): void {
    super.fromJSON(j, context)

    const sceneRoot = context.appData.scene.getRoot()
    const parentItem = sceneRoot.resolvePath(j.parentItemPath, 1)
    if (parentItem) {
      this.measurement = <MeasureDistance>Registry.constructClass(j.measurementType)
      this.measurement.fromJSON(j.measurementData)
      parentItem.addChild(this.measurement)
    }
  }

  /**
   * Removes geometry item reference from change change.
   */
  destroy(): void {}
}

UndoRedoManager.registerChange('MeasurementChange', MeasurementChange)
export { MeasurementChange }
