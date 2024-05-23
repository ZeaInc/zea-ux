import { GLRenderer, Scene, TreeItem, Vec3 } from '@zeainc/zea-engine'
import { SelectionManager } from '../src/SelectionManager'

export interface AppData {
  renderer?: GLRenderer
  scene?: Scene
  sceneUnits?: string
  selectionManager?: SelectionManager
  session?: any
  sessionSync?: any
}

export interface PointerObject {
  grabPos: Vec3
  holdPos: Vec3
}
