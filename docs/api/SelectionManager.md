### Classes

<dl>
<dt><a href="#SelectionChange">SelectionChange</a> ⇐ <code>Change</code></dt>
<dd><p>Class representing a selection change.</p>
</dd>
<dt><a href="#ToggleSelectionVisibility">ToggleSelectionVisibility</a> ⇐ <code>Change</code></dt>
<dd><p>Class representing a toggle selection visibility.</p>
</dd>
<dt><a href="#SelectionManager">SelectionManager</a></dt>
<dd><p>Class representing a selection manager</p>
</dd>
</dl>

<a name="SelectionChange"></a>

### SelectionChange 
Class representing a selection change.


**Extends**: <code>Change</code>  

* [SelectionChange ⇐ <code>Change</code>](#SelectionChange)
    * [new SelectionChange(selectionManager, prevSelection, newSelection)](#new-SelectionChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [toJSON(appData) ⇒ <code>any</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)

<a name="new_SelectionChange_new"></a>

### new SelectionChange
Create a selection change.


| Param | Type | Description |
| --- | --- | --- |
| selectionManager | <code>any</code> | The selectionManager value. |
| prevSelection | <code>any</code> | The prevSelection value. |
| newSelection | <code>any</code> | The newSelection value. |

<a name="SelectionChange+undo"></a>

### undo
The undo method.


<a name="SelectionChange+redo"></a>

### redo
The redo method.


<a name="SelectionChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData param. |

<a name="SelectionChange+fromJSON"></a>

### fromJSON
The fromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | The j param. |
| context | <code>any</code> | The context param. |

<a name="ToggleSelectionVisibility"></a>

### ToggleSelectionVisibility 
Class representing a toggle selection visibility.


**Extends**: <code>Change</code>  

* [ToggleSelectionVisibility ⇐ <code>Change</code>](#ToggleSelectionVisibility)
    * [new ToggleSelectionVisibility(selection, state)](#new-ToggleSelectionVisibility)
    * [undo()](#undo)
    * [redo()](#redo)
    * [do(state)](#do)

<a name="new_ToggleSelectionVisibility_new"></a>

### new ToggleSelectionVisibility
Create a toggle selection visibilit.


| Param | Type | Description |
| --- | --- | --- |
| selection | <code>any</code> | The selection value. |
| state | <code>any</code> | The state value. |

<a name="ToggleSelectionVisibility+undo"></a>

### undo
The undo method.


<a name="ToggleSelectionVisibility+redo"></a>

### redo
The redo method.


<a name="ToggleSelectionVisibility+do"></a>

### do
The do method.



| Param | Type | Description |
| --- | --- | --- |
| state | <code>any</code> | The state param. |

<a name="SelectionManager"></a>

### SelectionManager
Class representing a selection manager



* [SelectionManager](#SelectionManager)
    * [new SelectionManager(options, appData)](#new-SelectionManager)
    * [setRenderer(renderer)](#setRenderer)
    * [setXfoMode(renderer)](#setXfoMode)
    * [showHandles(renderer)](#showHandles)
    * [updateHandleVisiblity()](#updateHandleVisiblity)
    * [getSelection() ⇒ <code>any</code>](#getSelection)
    * [setSelection(newSelection)](#setSelection)
    * [toggleItemSelection(treeItem, replaceSelection)](#toggleItemSelection)
    * [clearSelection(newChange) ⇒ <code>any</code>](#clearSelection)
    * [selectItems(treeItems, replaceSelection)](#selectItems)
    * [deselectItems(treeItems)](#deselectItems)
    * [toggleSelectionVisiblity()](#toggleSelectionVisiblity)
    * [startPickingMode(label, fn, filterFn, count)](#startPickingMode)
    * [pickingFilter(item) ⇒ <code>any</code>](#pickingFilter)
    * [pickingModeActive() ⇒ <code>any</code>](#pickingModeActive)
    * [cancelPickingMode()](#cancelPickingMode)
    * [pick(item)](#pick)

<a name="new_SelectionManager_new"></a>

### new SelectionManager
Create a selection manager.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The options object. |
| appData | <code>object</code> | The appData value. |

<a name="SelectionManager+setRenderer"></a>

### setRenderer
The setRenderer method.



| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>any</code> | The renderer param. |

<a name="SelectionManager+setXfoMode"></a>

### setXfoMode
The setRenderer method.



| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>any</code> | The renderer param. |

<a name="SelectionManager+showHandles"></a>

### showHandles
The setRenderer method.



| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>any</code> | The renderer param. |

<a name="SelectionManager+updateHandleVisiblity"></a>

### updateHandleVisiblity
updateHandleVisiblity determines of the Xfo Manipulation
handle should be displayed or not.


<a name="SelectionManager+getSelection"></a>

### getSelection
The getSelection method.


**Returns**: <code>any</code> - The return value.  
<a name="SelectionManager+setSelection"></a>

### setSelection
The setSelection method.



| Param | Type | Description |
| --- | --- | --- |
| newSelection | <code>any</code> | The newSelection param. |

<a name="SelectionManager+toggleItemSelection"></a>

### toggleItemSelection
The toggleItemSelection method.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| treeItem | <code>any</code> |  | The treeItem param. |
| replaceSelection | <code>boolean</code> | <code>true</code> | The replaceSelection param. |

<a name="SelectionManager+clearSelection"></a>

### clearSelection
The clearSelection method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newChange | <code>boolean</code> | <code>true</code> | The newChange param. |

<a name="SelectionManager+selectItems"></a>

### selectItems
The selectItems method.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| treeItems | <code>any</code> |  | The treeItems param. |
| replaceSelection | <code>boolean</code> | <code>true</code> | The replaceSelection param. |

<a name="SelectionManager+deselectItems"></a>

### deselectItems
The deselectItems method.



| Param | Type | Description |
| --- | --- | --- |
| treeItems | <code>any</code> | The treeItems param. |

<a name="SelectionManager+toggleSelectionVisiblity"></a>

### toggleSelectionVisiblity
The toggleSelectionVisiblity method.


<a name="SelectionManager+startPickingMode"></a>

### startPickingMode
The startPickingMode method.



| Param | Type | Description |
| --- | --- | --- |
| label | <code>any</code> | The label param. |
| fn | <code>any</code> | The fn param. |
| filterFn | <code>any</code> | The filterFn param. |
| count | <code>any</code> | The count param. |

<a name="SelectionManager+pickingFilter"></a>

### pickingFilter
The pickingFilter method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>any</code> | The item param. |

<a name="SelectionManager+pickingModeActive"></a>

### pickingModeActive
The pickingModeActive method.


**Returns**: <code>any</code> - The return value.  
<a name="SelectionManager+cancelPickingMode"></a>

### cancelPickingMode
The cancelPickingMode method.


<a name="SelectionManager+pick"></a>

### pick
The pick method.



| Param | Type | Description |
| --- | --- | --- |
| item | <code>any</code> | The item param. |

