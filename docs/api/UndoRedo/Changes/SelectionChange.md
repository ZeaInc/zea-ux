<a name="SelectionChange"></a>

### SelectionChange 
Represents a `Change` class for storing `Selection` values.


**Extends**: <code>[Change](api/UndoRedo/Change.md)</code>  

* [SelectionChange ⇐ <code>Change</code>](#SelectionChange)
    * [new SelectionChange(selectionManager, prevSelection, newSelection)](#new-SelectionChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)

<a name="new_SelectionChange_new"></a>

### new SelectionChange
Creates an instance of SelectionChange.


| Param | Type | Description |
| --- | --- | --- |
| selectionManager | <code>[SelectionManager](api/SelectionManager.md)</code> | The selectionManager value. |
| prevSelection | <code>Set</code> | The prevSelection value. |
| newSelection | <code>Set</code> | The newSelection value. |

<a name="SelectionChange+undo"></a>

### undo
Sets the state of selections to the previous list of items selected.


<a name="SelectionChange+redo"></a>

### redo
Restores the state of the selections to the latest the list of items selected.


<a name="SelectionChange+toJSON"></a>

### toJSON
Serializes selection values as a JSON object, allowing persistence/replication.


**Returns**: <code>object</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The appData param. |

<a name="SelectionChange+fromJSON"></a>

### fromJSON
Restores selection state from a JSON object.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |
| context | <code>object</code> | The context param. |

