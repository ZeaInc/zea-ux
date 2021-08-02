import { Xfo } from '@zeainc/zea-engine'
import { UndoRedoManager, Change } from '../UndoRedo/index'
import { Measurement } from './Measurement'

/**
 * Represents a Measurement change.
 *
 * @extends Change
 */
class MeasurementChange extends Change {
  /**
   * Creates an instance of MeasurementChange.
   *
   * @param {TreeItem} parentItem - The parent that the measurement will be added to.
   * @param {Xfo} startPos - The start position of the point to point measurement
   * @param {Color} color - The color of the measurement
   */
  constructor(parentItem, startPos, color) {
    super('MeasurementChange')

    this.parentItem = parentItem

    this.measurement = new Measurement('Measurement', color)
    this.measurement.setStartMarkerPos(startPos)
    this.measurement.setEndMarkerPos(startPos)
    this.measurement.setGeomBuffersVisibility(false)
    this.childIndex = this.parentItem.getChildIndex(this.parentItem.addChild(this.measurement))
  }

  /**
   *
   *
   * @param {object} data - An object containing potentially the start and end positions.
   * @memberof MeasurementChange
   */
  update(data) {
    if (data.startPos) this.measurement.setStartMarkerPos(data.startPos)
    if (data.endPos) this.measurement.setEndMarkerPos(data.endPos)
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
    this.parentItem.removeChild(this.childIndex)
  }

  /**
   * Restores recently created geometry and adds it to the specified parent tree item.
   */
  redo() {
    console.log('redo MeasurementChange')
    this.parentItem.addChild(this.measurement, false, false)
  }

  /**
   * Serializes the change as a JSON object.
   *
   * @param {object} context - The context value
   * @return {object} - The serialized change
   */
  toJSON(context) {
    const j = super.toJSON(context)
    j.parentItemPath = this.parentItem.getPath()
    j.name = this.measurement.getName()
    j.startMarker = this.measurement.startMarker.toJSON()
    j.endMarker = this.measurement.startMarker.toJSON()

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
    this.parentItem = sceneRoot.resolvePath(j.parentItemPath, 1)
    this.measurement.setName(this.parentItem.generateUniqueName(j.name))

    const startXfo = new Xfo()
    startXfo.fromJSON(j.startMarker)
    this.measurement.setStartMarkerPos(startXfo)
    this.childIndex = this.parentItem.getChildIndex(this.parentItem.addChild(this.measurement))
  }

  /**
   * Removes geometry item reference from change change.
   */
  destroy() {}
}

UndoRedoManager.registerChange('MeasurementChange', MeasurementChange)
export { MeasurementChange }
