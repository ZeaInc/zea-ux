import { GeomItem, Material, Sphere } from '@zeainc/zea-engine'
import UndoRedoManager from '../../undoredo/UndoRedoManager.js'
import { CreateGeomChange, CreateGeomTool } from './CreateGeomTool.js'

/**
 * Class representing a create sphere change.
 * @extends CreateGeomChange
 */
class CreateSphereChange extends CreateGeomChange {
  /**
   * Create a create sphere change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Sphere', parentItem)

    this.sphere = new Sphere(0, 64, 32)
    const material = new Material('Sphere', 'SimpleSurfaceShader')
    this.geomItem = new GeomItem('Sphere')
    this.geomItem.setGeometry(this.sphere)
    this.geomItem.setMaterial(material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    this.sphere.radius = updateData.radius
    this.updated.emit(updateData)
  }

  /**
   * The toJSON method.
   * @return {any} The return value.
   */
  toJSON() {
    const j = super.toJSON()
    j.radius = this.geomItem.getGeometry().radius
    return j
  }

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    if (j.radius) this.geomItem.getGeometry().radius = j.radius
  }
}
UndoRedoManager.registerChange('CreateSphereChange', CreateSphereChange)

/**
 * Class representing a create sphere tool.
 * @extends CreateGeomTool
 */
class CreateSphereTool extends CreateGeomTool {
  /**
   * Create a create sphere tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData)
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateSphereChange(parentItem, xfo)
    this.appData.undoRedoManager.addChange(this.change)

    this.xfo = xfo
    this.stage = 1
    this.radius = 0.0
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    this.radius = pt.distanceTo(this.xfo.tr)
    this.change.update({ radius: this.radius })
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {
    if (this.radius == 0) {
      this.appData.undoRedoManager.undo(false)
    }
    this.stage = 0
    this.emit('actionFinished')
  }
}

export { CreateSphereTool }
