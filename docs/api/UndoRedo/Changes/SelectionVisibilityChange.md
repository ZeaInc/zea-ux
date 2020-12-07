<a name="SelectionVisibilityChange"></a>

### SelectionVisibilityChange 
Class representing a change of visibility state for selected items.


**Extends**: <code>[Change](api/UndoRedo\Change.md)</code>  

* [SelectionVisibilityChange ⇐ <code>Change</code>](#SelectionVisibilityChange)
    * [new SelectionVisibilityChange(selection, state)](#new-SelectionVisibilityChange)
    * [undo()](#undo)
    * [redo()](#redo)

<a name="new_SelectionVisibilityChange_new"></a>

### new SelectionVisibilityChange
Create a toggle selection visibility.


| Param | Type | Description |
| --- | --- | --- |
| selection | <code>Set</code> | The selection value. |
| state | <code>boolean</code> | The state value. |

<a name="SelectionVisibilityChange+undo"></a>

### undo
Restores previous visibility status of the selected items


<a name="SelectionVisibilityChange+redo"></a>

### redo
Recreates previous visibility status of the selected items


