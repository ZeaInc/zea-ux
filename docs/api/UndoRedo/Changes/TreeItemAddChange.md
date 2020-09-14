<a name="TreeItemAddChange"></a>

### TreeItemAddChange 
Class representing an `Add TreeItem` Change. Meaning that this should be called when you add a new `TreeItem` to the scene.


**Extends**: <code>[Change](api/UndoRedo/Change.md)</code>  

* [TreeItemAddChange ⇐ <code>Change</code>](#TreeItemAddChange)
    * [new TreeItemAddChange(treeItem, owner, selectionManager)](#new-TreeItemAddChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)
    * [destroy()](#destroy)

<a name="new_TreeItemAddChange_new"></a>

### new TreeItemAddChange
Creates an instance of TreeItemAddChange.


| Param | Type | Description |
| --- | --- | --- |
| treeItem | <code>TreeItem</code> | - |
| owner | <code>TreeItem</code> | - |
| selectionManager | <code>[SelectionManager](api/SelectionManager.md)</code> | - |

<a name="TreeItemAddChange+undo"></a>

### undo
Removes the newly added TreeItem from its owner.


<a name="TreeItemAddChange+redo"></a>

### redo
Restores undone `TreeItem`.


<a name="TreeItemAddChange+toJSON"></a>

### toJSON
Serializes `TreeItem` like instanced class into a JSON object.


**Returns**: <code>object</code> - - JSON object  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The context treeItem |

<a name="TreeItemAddChange+fromJSON"></a>

### fromJSON
Reconstructs `TreeItem` like parameter from JSON object.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j treeItem |
| context | <code>object</code> | The context treeItem |

<a name="TreeItemAddChange+destroy"></a>

### destroy
Removes reference of the `TreeItem` from current change.


