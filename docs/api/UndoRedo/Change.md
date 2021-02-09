<a name="Change"></a>

### Change 
Kind of an abstract class, that represents the mandatory structure of a change classes that are used in the [`UndoRedoManager`]().


**Extends**: <code>EventEmitter</code>  
**Note**: If you don't extend this class, ensure to implement all methods specified in here.  

* [Change ⇐ <code>EventEmitter</code>](#Change)
    * [new Change(name)](#new-Change)
    * [undo()](#undo)
    * [redo()](#redo)
    * [update(updateData)](#update)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)
    * [updateFromJSON(j)](#updateFromJSON)
    * [destroy()](#destroy)

<a name="new_Change_new"></a>

### new Change
Every class that extends from `Change` must contain a global `name` attribute.It is used by the `UndoRedoManager` factory to re-construct the class of the specific implementation of the `Change` class.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |

<a name="Change+undo"></a>

### undo
Called by the `UndoRedoManager` in the `undo` method, and contains the code you wanna run when the undo action is triggered,of course it depends on what you're doing.


**Note**: This method needs to be implemented, otherwise it will throw an Error.  
<a name="Change+redo"></a>

### redo
Called by the `UndoRedoManager` in the `redo` method, and is the same as the `undo` method, contains the specific code you wanna run.


**Note**: This method needs to be implemented, otherwise it will throw an Error.  
<a name="Change+update"></a>

### update
Use this method to update the state of your `Change` class.


**Note**: This method needs to be implemented, otherwise it will throw an Error.  

| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>object</code> \| <code>string</code> \| <code>any</code> | The updateData param. |

<a name="Change+toJSON"></a>

### toJSON
Serializes the `Change` instance as a JSON object, allowing persistence/replication


**Returns**: <code>object</code> - The return value.  
**Note**: This method needs to be implemented, otherwise it will return an empty object.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The appData param. |

<a name="Change+fromJSON"></a>

### fromJSON
The counterpart of the `toJSON` method, restoring `Change` instance's state with the specified JSON object.Each `Change` class must implement the logic for reconstructing itself.Very often used to restore from persisted/replicated JSON.


**Note**: This method needs to be implemented, otherwise it will do nothing.  

| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |
| context | <code>object</code> | The context param. |

<a name="Change+updateFromJSON"></a>

### updateFromJSON
Useful method to update the state of an existing identified `Change` through replication.


**Note**: By default it calls the `update` method in the `Change` class, but you can override this if you need to.  

| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |

<a name="Change+destroy"></a>

### destroy
Method destined to clean up things that would need to be cleaned manually.It is executed when flushing the undo/redo stacks or adding a new change to the undo stack,so it is require in any class that represents a change.


