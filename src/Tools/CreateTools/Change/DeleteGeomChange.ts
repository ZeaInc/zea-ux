import { TreeItem } from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import { Change } from '../../../UndoRedo'

class DeleteGeomChange extends Change {
  parentItem: TreeItem
  constructor(private treeItem: TreeItem) {
    super('DeleteGeom')

    if (this.treeItem) {
      this.parentItem = this.treeItem.parent
      this.parentItem.removeChildByHandle(this.treeItem)
    }
  }

  undo(): void {
    this.parentItem.addChild(this.treeItem, false, false)
  }

  redo(): void {
    this.parentItem.removeChildByHandle(this.treeItem)
  }

  toJSON(context?: Record<any, any>): Record<any, any> {
    const j: Record<any, any> = super.toJSON(context)
    j.path = this.treeItem.getPath()
    return j
  }

  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
    super.fromJSON(j, context)

    const sceneRoot = context.appData.scene.getRoot()
    this.treeItem = sceneRoot.resolvePath(j.path, 1)

    if (this.treeItem) {
      this.parentItem = this.treeItem.parent
      this.parentItem.removeChildByHandle(this.treeItem)
    }
  }
}

UndoRedoManager.registerChange('DeleteGeomChange', DeleteGeomChange)

export default DeleteGeomChange
export { DeleteGeomChange }
