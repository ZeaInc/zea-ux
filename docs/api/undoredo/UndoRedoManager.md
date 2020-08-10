<a name="UndoRedoManager"></a>

### UndoRedoManager
Class representing an undo redo manager.



* [UndoRedoManager](#UndoRedoManager)
    * [new UndoRedoManager()](#new-UndoRedoManager)
    * _instance_
        * [flush()](#flush)
        * [addChange(change)](#addChange)
        * [getCurrentChange() ⇒ <code>any</code>](#getCurrentChange)
        * [undo(pushOnRedoStack)](#undo)
        * [redo()](#redo)
        * [constructChange(className) ⇒ <code>any</code>](#constructChange)
    * _static_
        * [isChangeClassRegistered(inst) ⇒ <code>boolean</code>](#isChangeClassRegistered)
        * [getChangeClassName(inst) ⇒ <code>any</code>](#getChangeClassName)
        * [registerChange(name, cls)](#registerChange)

<a name="new_UndoRedoManager_new"></a>

### new UndoRedoManager
Create an undo redo manager.

<a name="UndoRedoManager+flush"></a>

### flush
The flush method.


<a name="UndoRedoManager+addChange"></a>

### addChange
The addChange method.



| Param | Type | Description |
| --- | --- | --- |
| change | <code>any</code> | The change param. |

<a name="UndoRedoManager+getCurrentChange"></a>

### getCurrentChange
The getCurrentChange method.


**Returns**: <code>any</code> - The return value.  
<a name="UndoRedoManager+undo"></a>

### undo
The undo method.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pushOnRedoStack | <code>boolean</code> | <code>true</code> | The pushOnRedoStack param. |

<a name="UndoRedoManager+redo"></a>

### redo
The redo method.


<a name="UndoRedoManager+constructChange"></a>

### constructChange
The constructChange method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The className param. |

<a name="UndoRedoManager.isChangeClassRegistered"></a>

### isChangeClassRegistered
The isChangeClassRegistered method.


**Returns**: <code>boolean</code> - Returns 'true' if the class has been registered.  

| Param | Type | Description |
| --- | --- | --- |
| inst | <code>object</code> | The instance of the Change class. |

<a name="UndoRedoManager.getChangeClassName"></a>

### getChangeClassName
The getChangeClassName method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| inst | <code>object</code> | The instance of the Change class. |

<a name="UndoRedoManager.registerChange"></a>

### registerChange
The registerChange method.



| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | The name param. |
| cls | <code>any</code> | The cls param. |

