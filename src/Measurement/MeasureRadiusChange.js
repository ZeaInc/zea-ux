import { Xfo } from '@zeainc/zea-engine'
import { UndoRedoManager, Change } from '../UndoRedo/index'
import { Measurement } from './Measurement'

/**
 * Represents a Measurement change.
 *
 * @extends Change
 */
class MeasureRadiusChange extends Change {
  /**
   * Creates an instance of MeasureRadiusChange.
   *
   * @param {TreeItem} parentItem - The parent that the measurement will be added to.
   * @param {Xfo} axisPos - The start position of the point to point measurement
   * @param {Xfo} edgePos - The start position of the point to point measurement
   * @param {Color} color - The color of the measurement
   */
  constructor(parentItem, axisPos, edgePos, color) {
    super('MeasureRadiusChange')

    this.parentItem = parentItem

    this.measurement = new Measurement('Measurement', color)
    this.measurement.setStartMarkerPos(axisPos)
    this.measurement.setEndMarkerPos(edgePos)
    this.childIndex = this.parentItem.getChildIndex(this.parentItem.addChild(this.measurement))
  }

  /**
   * Removes recently created geometry from its parent.
   */
  undo() {
    console.log('undo MeasureRadiusChange')
    this.parentItem.removeChild(this.childIndex)
  }

  /**
   * Restores recently created geometry and adds it to the specified parent tree item.
   */
  redo() {
    console.log('redo MeasureRadiusChange')
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

UndoRedoManager.registerChange('MeasureRadiusChange', MeasureRadiusChange)
export { MeasureRadiusChange }
