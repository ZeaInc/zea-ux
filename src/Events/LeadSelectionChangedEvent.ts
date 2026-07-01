import { BaseEvent, TreeItem } from '@zeainc/zea-engine'

class LeadSelectionChangedEvent extends BaseEvent {
  constructor(public leadSelection: TreeItem | null) {
    super()
  }
}

export default LeadSelectionChangedEvent
export { LeadSelectionChangedEvent }
