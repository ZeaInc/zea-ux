<a name="TreeItemsRemoveChange"></a>

### TreeItemsRemoveChange 
Class representing a TreeItems removal Change,taking into account that it would remove all the specified items ti their children


**Extends**: <code>[Change](api/UndoRedo\Change.md)</code>  

* [TreeItemsRemoveChange ⇐ <code>Change</code>](#TreeItemsRemoveChange)
    * [new TreeItemsRemoveChange(items, appData)](#new-TreeItemsRemoveChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [toJSON(appData) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, appData)](#fromJSON)
    * [destroy()](#destroy)

<a name="new_TreeItemsRemoveChange_new"></a>

### new TreeItemsRemoveChange
Creates an instance of TreeItemsRemoveChange.


| Param | Type | Description |
| --- | --- | --- |
| items | <code>array</code> | List of TreeItems |
| appData | <code>object</code> | The appData value |

<a name="TreeItemsRemoveChange+undo"></a>

### undo
Restores all items removed in the change, reattaching them to their old owners.


<a name="TreeItemsRemoveChange+redo"></a>

### redo
Executes initial change to remove items from their owners.


<a name="TreeItemsRemoveChange+toJSON"></a>

### toJSON
Serializes current change data as a JSON object, so this action can be stored/replicated somewhere else.


**Returns**: <code>object</code> - - JSON Object representation of current change  

| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value |

<a name="TreeItemsRemoveChange+fromJSON"></a>

### fromJSON
Restores Change action from a JSON object.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The JSON object with Change data. |
| appData | <code>object</code> | The appData value |

<a name="TreeItemsRemoveChange+destroy"></a>

### destroy
The destroy method cleans up any data requiring manual cleanup.Deleted items still on the undo stack are then flushed and anyGPU resources cleaned up.


