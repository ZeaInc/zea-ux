<a name="SelectionManager"></a>

### SelectionManager 
Class representing a selection manager


**Extends**: <code>EventEmitter</code>  

* [SelectionManager ⇐ <code>EventEmitter</code>](#SelectionManager)
    * [new SelectionManager(appData, [options])](#new-SelectionManager)
    * [setRenderer(renderer)](#setRenderer)
    * [setXfoMode(mode)](#setXfoMode)
    * [showHandles(handleManipulationMode)](#showHandles)
    * [updateHandleVisibility()](#updateHandleVisibility)
    * [getSelection() ⇒ <code>array</code>](#getSelection)
    * [setSelection(newSelection, [createUndo])](#setSelection)
    * [toggleItemSelection(treeItem, replaceSelection)](#toggleItemSelection)
    * [clearSelection(newChange) ⇒ <code>boolean</code>](#clearSelection)
    * [selectItems(treeItems, replaceSelection)](#selectItems)
    * [deselectItems(treeItems)](#deselectItems)
    * [toggleSelectionVisibility()](#toggleSelectionVisibility)
    * [startPickingMode(label, fn, filterFn, count)](#startPickingMode)
    * [pickingFilter(item) ⇒ <code>any</code>](#pickingFilter)
    * [pickingModeActive() ⇒ <code>boolean</code>](#pickingModeActive)
    * [cancelPickingMode()](#cancelPickingMode)
    * [pick(item)](#pick)

<a name="new_SelectionManager_new"></a>

### new SelectionManager
Creates an instance of SelectionManager.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| appData | <code>object</code> |  | The options object. |
| [options] | <code>object</code> | <code>{}</code> | The appData value. |

<a name="SelectionManager+setRenderer"></a>

### setRenderer
Adds specified the renderer to the `SelectionManager` and attaches the `SelectionGroup`.



| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>GLBaseRenderer</code> | The renderer param. |

<a name="SelectionManager+setXfoMode"></a>

### setXfoMode
Sets initial Xfo mode of the selection group.


**See**: `Group` class documentation  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>number</code> | The Xfo mode |

<a name="SelectionManager+showHandles"></a>

### showHandles
Displays handles depending on the specified mode(Move, Rotate, Scale).
If nothing is specified, it hides all of them.



| Param | Type | Description |
| --- | --- | --- |
| handleManipulationMode | <code>number</code> | The mode of the Xfo parameter |

<a name="SelectionManager+updateHandleVisibility"></a>

### updateHandleVisibility
Determines if the Xfo Manipulation handle should be displayed or not.


<a name="SelectionManager+getSelection"></a>

### getSelection
Returns an array with the selected items.


**Returns**: <code>array</code> - - The return value.  
<a name="SelectionManager+setSelection"></a>

### setSelection
Sets a new selection of items in the `SelectionManager`



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newSelection | <code>Set</code> |  | The newSelection param |
| [createUndo] | <code>boolean</code> | <code>true</code> | The createUndo param |

<a name="SelectionManager+toggleItemSelection"></a>

### toggleItemSelection
The toggleItemSelection method.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| treeItem | <code>TreeItem</code> |  | The treeItem param. |
| replaceSelection | <code>boolean</code> | <code>true</code> | The replaceSelection param. |

<a name="SelectionManager+clearSelection"></a>

### clearSelection
Clears selection state by removing previous selected items and the Xfo handlers.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newChange | <code>boolean</code> | <code>true</code> | The newChange param. |

<a name="SelectionManager+selectItems"></a>

### selectItems
Selects the specified items replacing previous selection or concatenating new items to it.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| treeItems | <code>array</code> |  | The treeItems param. |
| replaceSelection | <code>boolean</code> | <code>true</code> | The replaceSelection param. |

<a name="SelectionManager+deselectItems"></a>

### deselectItems
Deselects the specified items from the selection group.



| Param | Type | Description |
| --- | --- | --- |
| treeItems | <code>array</code> | The treeItems param. |

<a name="SelectionManager+toggleSelectionVisibility"></a>

### toggleSelectionVisibility
Toggles selection visibility, if the visibility is `true`then sets it to `false` and vice versa.


<a name="SelectionManager+startPickingMode"></a>

### startPickingMode
The startPickingMode method.



| Param | Type | Description |
| --- | --- | --- |
| label | <code>string</code> | The label param. |
| fn | <code>function</code> | The fn param. |
| filterFn | <code>function</code> | The filterFn param. |
| count | <code>number</code> | The count param. |

<a name="SelectionManager+pickingFilter"></a>

### pickingFilter
The pickingFilter method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>TreeItem</code> | The item param. |

<a name="SelectionManager+pickingModeActive"></a>

### pickingModeActive
The pickingModeActive method.


**Returns**: <code>boolean</code> - The return value.  
<a name="SelectionManager+cancelPickingMode"></a>

### cancelPickingMode
The cancelPickingMode method.


<a name="SelectionManager+pick"></a>

### pick
The pick method.



| Param | Type | Description |
| --- | --- | --- |
| item | <code>TreeItem</code> | The item param. |

