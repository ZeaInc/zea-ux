import { GLRenderer, Scene } from "@zeainc/zea-engine";
import { SelectionManager } from "../src/SelectionManager";

interface AppData {
  renderer: GLRenderer
  scene: Scene
  selectionManager: SelectionManager
  parentItem: TreeItem
  session: any
}