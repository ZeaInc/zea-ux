<a name="UndoRedoManager"></a>

### UndoRedoManager
`UndoRedoManager` is a mixture of the [Factory Design Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) and the actual changes stacks manager.This is the heart of the Undo/Redo System, letting you navigate through the changes history you've saved.**Events*** **changeAdded:** Triggered when a change is added.* **changeUpdated:** Triggered when the last change added updates its state.* **changeUndone:** Triggered when the `undo` method is called, after removing the last change from the stack.* **changeRedone:** Triggered when the `redo` method is called, after restoring the last change removed from the undo stack.



* [UndoRedoManager](#UndoRedoManager)
    * [new UndoRedoManager()](#new-UndoRedoManager)
    * _instance_
        * [flush()](#flush)
        * [addChange(change)](#addChange)
        * [getCurrentChange() ⇒ <code>Change</code> \| <code>null</code>](#getCurrentChange)
        * [undo(pushOnRedoStack)](#undo)
        * [cancel()](#cancel)
        * [redo()](#redo)
        * [constructChange(className) ⇒ <code>Change</code>](#constructChange)
    * _static_
        * [isChangeClassRegistered(inst) ⇒ <code>boolean</code>](#isChangeClassRegistered)
        * [getChangeClassName(inst) ⇒ <code>string</code>](#getChangeClassName)
        * [registerChange(name, cls)](#registerChange)

<a name="new_UndoRedoManager_new"></a>

### new UndoRedoManager
It doesn't have any parameters, but under the hood it uses [EventsEmitter]() to notify subscribers when something happens.The implementation is really simple, just initialize it like any other class.

<a name="UndoRedoManager+flush"></a>

### flush
As the name indicates, it empties undo/redo stacks permanently, losing all stored actions.Right now, before flushing the stacks it calls the `destroy` method on all changes, ensure to at least declare it.


<a name="UndoRedoManager+addChange"></a>

### addChange
Receives an instance of a class that extends or has the same structure as `Change` class.When this action happens, the last added change update notifications will get disconnected.Which implies that any future updates to changes that are not the last one, would need a new call to the `addChange` method.Also, resets the redo stack(Calls destroy method when doing it).



| Param | Type | Description |
| --- | --- | --- |
| change | <code>[Change](api/UndoRedo\Change.md)</code> | The change param. |

<a name="UndoRedoManager+getCurrentChange"></a>

### getCurrentChange
Returns the last change added to the undo stack, but in case it is empty a `null` is returned.


**Returns**: <code>Change</code> \| <code>null</code> - The return value.  
<a name="UndoRedoManager+undo"></a>

### undo
Rollback the latest action, passing it to the redo stack in case you wanna recover it later on.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pushOnRedoStack | <code>boolean</code> | <code>true</code> | The pushOnRedoStack param. |

<a name="UndoRedoManager+cancel"></a>

### cancel
Method to cancel the current change added to the UndoRedoManager.Reverts the change and discards it.


<a name="UndoRedoManager+redo"></a>

### redo
Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack.Emits the `changeRedone` event, if you want to subscribe to it.


<a name="UndoRedoManager+constructChange"></a>

### constructChange
Basically returns a new instance of the derived `Change` class. This is why we need the `name` attribute.


**Returns**: <code>[Change](api/UndoRedo\Change.md)</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | The className param. |

<a name="UndoRedoManager.isChangeClassRegistered"></a>

### isChangeClassRegistered
Checks if a class of an instantiated object is registered in the UndoRedo Factory.


**Returns**: <code>boolean</code> - - Returns 'true' if the class has been registered.  

| Param | Type | Description |
| --- | --- | --- |
| inst | <code>[Change](api/UndoRedo\Change.md)</code> | The instance of the Change class. |

<a name="UndoRedoManager.getChangeClassName"></a>

### getChangeClassName
Very simple method that returns the name of the instantiated class, checking first in the registry and returning if found,if not then checks the `name` attribute declared in constructor.


**Returns**: <code>string</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| inst | <code>[Change](api/UndoRedo\Change.md)</code> | The instance of the Change class. |

<a name="UndoRedoManager.registerChange"></a>

### registerChange
Registers the class in the UndoRedoManager Factory.Why do we need to specify the name of the class?Because when the code is transpiled, the defined class names change, so it won't be known as we declared it anymore.



| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name param. |
| cls | <code>[Change](api/UndoRedo\Change.md)</code> | The cls param. |

