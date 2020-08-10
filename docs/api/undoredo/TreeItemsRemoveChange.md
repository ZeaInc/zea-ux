<a name="TreeItemsRemoveChange"></a>

### TreeItemsRemoveChange 
Class representing a treeItemeter value change.


**Extends**: <code>Change</code>  
**Treeitem**: <code>any</code> treeItem - The treeItem value.  
**Treeitem**: <code>any</code> newValue - The newValue value.  

* [TreeItemsRemoveChange ⇐ <code>Change</code>](#TreeItemsRemoveChange)
    * [new TreeItemsRemoveChange()](#new-TreeItemsRemoveChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [toJSON() ⇒ <code>any</code>](#toJSON)
    * [fromJSON()](#fromJSON)
    * [destroy()](#destroy)

<a name="new_TreeItemsRemoveChange_new"></a>

### new TreeItemsRemoveChange
Create a TreeItemsRemoveChange.

<a name="TreeItemsRemoveChange+undo"></a>

### undo
The undo method.


<a name="TreeItemsRemoveChange+redo"></a>

### redo
The redo method.


<a name="TreeItemsRemoveChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>any</code> - The return value.  
**Treeitem**: <code>any</code> appData - The appData treeItem.  
<a name="TreeItemsRemoveChange+fromJSON"></a>

### fromJSON
The fromJSON method.


**Treeitem**: <code>any</code> j - The j treeItem.  
**Treeitem**: <code>any</code> appData - The appData treeItem.  
<a name="TreeItemsRemoveChange+destroy"></a>

### destroy
The destroy method cleans up any data requiring manual cleanup.
Deleted items still on the undo stack are then flushed and any
GPU resoruces cleaned up.


