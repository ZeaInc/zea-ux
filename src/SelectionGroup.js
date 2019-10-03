
const ValueSetMode = ZeaEngine.ValueSetMode;

export default class SelectionGroup extends ZeaEngine.Group {
  constructor() {
    super();

    this.__itemsParam.setFilterFn(item => item instanceof ZeaEngine.BaseItem)
  }

  clone(flags) {
    const cloned = new SelectionGroup();
    cloned.copyFrom(this, flags);
    return cloned;
  }

  __bindItem(item, index) {
    item.setSelected(this.getSelected());
    
    const signalIndices = {}
    
    if (item instanceof ZeaEngine.TreeItem) {
      signalIndices.globalXfoChangedIndex = item.globalXfoChanged.connect((mode) => {
        // Then the item xfo changes, we update the group xfo.
        if (!this.calculatingGroupXfo && !this.propagatingXfoToItems) {
          this.__initialXfos[index] = item.getGlobalXfo();
          this._setGlobalXfoDirty();
        }
        // else if (mode != ValueSetMode.OPERATOR_SETVALUE &&  mode != ValueSetMode.OPERATOR_DIRTIED)
      });
      this.__initialXfos[index] = item.getGlobalXfo();
    }

    this.__signalIndices[index] = signalIndices
  }

  __unbindItem(item, index) {
    item.setSelected(false);
    
    if (item instanceof ZeaEngine.TreeItem) {
      item.globalXfoChanged.disconnectId(this.__signalIndices[index].globalXfoChangedIndex);
      
      this.__initialXfos.splice(index, 1);
    }
    
    this.__signalIndices.splice(index, 1);
  }

};