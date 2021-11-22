import { GLRenderer, Scene, Vec3 } from "@zeainc/zea-engine";
import { SelectionManager } from "../src/SelectionManager";

interface AppData {
  renderer: GLRenderer
  scene: Scene
  selectionManager: SelectionManager
  parentItem: TreeItem
  session: any
}


interface PointerObject{
  grabPos: Vec3
  holdPos: Vec3
}