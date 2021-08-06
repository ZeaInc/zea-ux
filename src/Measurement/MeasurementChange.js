import { Xfo, Registry } from '@zeainc/zea-engine'
import { UndoRedoManager, Change } from '../UndoRedo/index'

/**
 * Represents a Measurement change.
 *
 * @extends Change
 */
class MeasurementChange extends Change {
  /**
   * Creates an instance of MeasurementChange.
   *
   * @param {TreeItem} measurement - The parent that the measurement will be added to.
   */
  constructor(measurement) {
    super('MeasurementChange')

    if (measurement) {
      this.measurement = measurement
    }
  }

  /**
   *
   *
   * @param {object} data - An object containing potentially the start and end positions.
   * @memberof MeasurementChange
   */
  update(data) {
    this.measurement.fromJSON(data.measurementData)
    this.emit('updated', data)
  }

  /**
   *
   */
  end() {
    this.measurement.setGeomBuffersVisibility(true)
  }

  /**
   * Removes recently created geometry from its parent.
   */
  undo() {
    console.log('undo MeasurementChange')
    this.parentItem = this.measurement.getParent()
    this.childIndex = this.parentItem.getChildIndex(this.measurement)
    this.parentItem.removeChild(this.childIndex)
  }

  /**
   * Restores recently created geometry and adds it to the specified parent tree item.
   */
  redo() {
    console.log('redo MeasurementChange')
    this.parentItem.insertChild(this.measurement, this.childIndex)
  }

  /**
   * Serializes the change as a JSON object.
   *
   * @param {object} context - The context value
   * @return {object} - The serialized change
   */
  toJSON(context) {
    const j = super.toJSON(context)
    j.parentItemPath = this.measurement.getParent().getPath()
    j.measurementType = Registry.getBlueprintName(this.measurement)
    j.measurementData = this.measurement.toJSON(context)
    return j
  }

  /**
   * Restores geometry from using the specified JSON
   *
   * @param {object} j - The j param.
   * @param {object} context - The appData param.
   */
  fromJSON(j, context) {
    const sceneRoot = context.appData.scene.getRoot()
    const parentItem = sceneRoot.resolvePath(j.parentItemPath, 1)
    if (parentItem) {
      this.measurement = Registry.constructBlueprintName(j.measurementType)
      this.measurement.fromJSON(j.measurementData)
      parentItem.addChild(this.measurement)
    }
  }

  /**
   * Removes geometry item reference from change change.
   */
  destroy() {}
}

UndoRedoManager.registerChange('MeasurementChange', MeasurementChange)
export { MeasurementChange }
