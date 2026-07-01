import { BaseEvent, TreeItem } from '@zeainc/zea-engine'

class SelectionChangedEvent extends BaseEvent {
  constructor(public prevSelection: Set<TreeItem>, public selection: Set<TreeItem>) {
    super()
  }
}

export default SelectionChangedEvent
export { SelectionChangedEvent }
