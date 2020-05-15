## Undo/Redo System
A module of the UX Library that can handle Undo/Redo/Cancel commands on pretty much any system, managing a stack of changes that can be navigated through.
It is closely tight to a event dispatcher system([Signal](https://github.com/ZeaInc/zea-engine)), that notifies subscribers everytime of any action taken in the Manager.

Basic example of how to implement the UndoRedoManager:

[](_examples/UndoRedoSystem.html ':include :type=iframe width=100% height=150px')

```javascript
import { UndoRedoManager } from '@zeainc/zea-ux';
import { Signal } from '@zeainc/zea-engine';

// Type of `Change` Class
class FooChange {
  constructor() {
    this.name = 'FooChange'

    // Must... Used by the UndoRedoManager.
    this.updated = new Signal()
  }

  /**
   * Custom method.
   * Could be anything you want.
   */
  setColor(_color) {
    this.colorList = document.getElementById('color-list')
    
    this.li = document.createElement('li')
    this.li.appendChild(document.createTextNode(_color))
    this.li.setAttribute('style', `background-color: ${_color};`)
    
    this.colorList.appendChild(this.li)
  }

  undo() {
    this.li.remove()
  }

  redo() {
    this.colorList.appendChild(this.li)
  }

  destroy() {
    console.log('destroyed change')
  }
}

// Register the change class in your UndoRedoManager in case you wanna replicate it to other users
UndoRedoManager.registerChange('FooChange', FooChange)

window.onload = () => {
  const addColorBtn = document.getElementById('addColorBtn')
  const undoBtn = document.getElementById('undoBtn')
  const redoBtn = document.getElementById('redoBtn')

  const undoRedoManager = new UndoRedoManager()

| // Small example of how `Signal` work, we subscribe and use it event to disable the redoBtn
  undoRedoManager.changeAdded.connect(() => { 
    redoBtn.disabled = true;
  });

  undoRedoManager.changeUndone.connect(() => { 
    redoBtn.disabled = false;
  });

  addColorBtn.addEventListener('click', (event) => {
    const color = `#${( 0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)}`

    const fooChange = new FooChange()
    fooChange.setColor(color)

    undoRedoManager.addChange(fooChange);
  })

  undoBtn.addEventListener('click', (event) => {
    undoRedoManager.undo()
  })
  
  redoBtn.addEventListener('click', (event) => {
    undoRedoManager.redo()
  })
};

```

---

## UndoRedoManager(*Class*)
Class `UndoRedoManager` is a mixture of the [Factory Design Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) and the actual change stacks manager.
This is the heart of the Undo/Redo System, letting you navigate through the changes history you've saved.

!> This relies on the [Signal](https://github.com/ZeaInc/zea-engine) notification system, when a change is added, updated, undone, redone or cancelled.

### constructor
`UndoRedoManager()`
It doesn't have any parameters, but under the hood it initializes the signals to notify subscribers when something happens. The implementation is really simple, just initialize it like any other class.

#### **Syntax**
```javascript
const undoRedoManager = new UndoRedoManager()
```

### flush(*Method*)
As the name indicates, it empties undo/redo stacks permanently, losing all stored actions.
Right now, before flushing the stacks it calls the `destroy` method on all changes, ensure to at least declare it.

#### **Syntax**
```javascript
undoRedoManager.flush()
```

### addChange(*Method*)
Recieves an instance of a class that extends or has the same structure as the [`Change`](#changeclass) class.
When this action happens, the last added change update notificatons will get disconnected. 
Which implies that any future updates to changes that are not the last action, would need a new call to the "addChange" method.
Also, resets the redo stack(Calls destroy method when doing it).

!> **changeAdded** event is emitted, if you want to subscribe just `fooChange.changeAdded.connect(callbackFunc)`.

#### **Syntax**
```javascript
// Class that extends or has the same structure as the `Change` class
const fooChange = new FooChange()
undoRedoManager.addChange(fooChange)
```
#### **Parameters**
**change | `Change*`** Instantiated class derived from the [`Change`](#changeclass) class.


### getCurrentChange(*Method*)
Returns the last change added to the undo stack, but in case it is empty a `null` is returned. Ensure to check the outcome result before trying to use it

#### **Syntax**
```javascript
const currentChange = undoRedoManager.getCurrentChange()
if (currentchange) {
  ...
}
```
#### **Return value**
**[change | null] | `Change*`** Instantiated class derived from the [`Change`](#changeclass) class or a null if there's nothing in the undo stack.


### undo(*Method*)
Rollback the latest action, passing it to the redo stack in case you wanna recover it later on.

!> **changeUndone** event is emitted, if you want to subscribe just `fooChange.changeUndone.connect(callbackFunc)`.

#### **Syntax**
```javascript
undoRedoManager.undo()
```

### redo(*Method*)
Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack.

!> **changeRedone** event is emitted, if you want to subscribe just `fooChange.changeRedone.connect(callbackFunc)`.

#### **Syntax**
```javascript
undoRedoManager.redo()
```

### cancel(*Method*)
Works the same as the `undo` method, but it doesn't move the change to the redo stack, it just removes it permanently. Like if it never existed.

!> **changeCanceled** event is emitted, if you want to subscribe just `fooChange.changeCanceled.connect(callbackFunc)`.

#### **Syntax**
```javascript
undoRedoManager.cancel()
```

### User Synchronization {docsify-ignore}
In adition to the utils for undoing/redoing/canceling power, we wanted to give this tool the option of syncing stacks of multiple users... replication!. 
Intrinsically related to the fromJSON, toJSON, changeFromJSON and methods in the [Change](#changeclass) class. So, if there are multiple users connected in the same page, you sync up their undo/redo stacks, and if one of them undo/redo, all of them will get the update.
This is where the [Factory Design Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) comes into hand, knowing how to create classes.

### constructChange(*Method*)
Basically returns a new instance of the derived [Change](#changeclass) class. This is why we need the `name` attribute.
It doesn't contain any state, use `fromJSON` method to restore it.

!> **Error**: If the className is not registered in the UndoRedoManager Factory it will throw an error notifying about it.

#### **Syntax**
```javascript
const data = {...}
const className = 'FooChange'
const fooChangeClass = UndoRedoManager.constructChange(className);
fooChangeClass.fromJSON(data)
```

#### **Return value**
**change | `Change*`** The specific instantiated class derived from the [`Change`](#changeclass) class().

### getChangeClassName(*Method*)
Very simple method that returns the name of the instanciated class, checking first in the registry and returning if found, 
if not then checks the `name` attribute declared in constructor.

#### **Syntax**
```javascript
const className = UndoRedoManager.getChangeClassName(fooChange);
```

#### **Return value**
**className | `String`** Literally the name of the class.

### registerChange(*Method*)
Registers the class in the UndoRedoManager Factory.
Why do we need to specify the name of the class?, Because when the code is transpiled the defined class names change, so it won't be known as we declared it anymore.

#### **Syntax**
```javascript
// Derivated from `Change` class
class FooChange {
    constructor() 
        super('FooChange')
    }
}

// Add it at the bottom of the your class file
UndoRedoManager.registerChange('FooChange', FooChange);
```

#### **Parameters**
**className | `String`** Literally the name of the class.
**changeClass | `Change*`** The declared class name.

---
## Change(*Class*)
Kind of an abstract class, that represents the mandatory structure of a change classes that are used in the [`UndoRedoManager`](#undoredomanagerclass). 

### Constructor
`Change(name)`

Every class that extends from `Change` must contain a global `name` attribute. It is used by the `UndoRedoManager` factory to re-construct the class of the specific implementation of the `Change` class([See registerChange method](#registerchangemethod)).

#### **Syntax**
```javascript
/**
 * Using the super class constructor to set the name of the FooChange class.
 */
class FooChange extends Change {
    constructor() 
        super('FooChange')
    }
}

// Or

/**
 * Setting name attribute directly without using super class constructor
 */
class FooChange {
    constructor() {
        this.name = 'FooChange'
    }
}
```

!> **name** attribute is mandatory.

#### **Parameters**
**name | `String`** Literally the name of the class.

### undo(*Method*)
Called by the `UndoRedoManager` in the `undo` method, and contains the code you wanna run when the undo action is triggered, of course it depends on what you're doing.
Check the [code](#undoredo-system) at the start of the page.

#### **Syntax**
```javascript
undo() {
  this.li.remove()
}
```

### redo(*Method*)
Called by the `UndoRedoManager` in the `redo` method, and is the same as the `undo` method, contains the specific code you wanna run.

#### **Syntax**
```javascript
redo() {
    this.colorList.appendChild(this.li)
}
```

### cancel(*Method*)
Called by the `UndoRedoManager` in the `cancel` method, it is very likely to be the same as undo, but as always we give you enough space to maneuver.

#### **Syntax**
```javascript
cancel() {
  this.li.remove()
}
```

### update(*Method*)
Use this method to udpate the state of your `Change` class.

#### **Syntax**
```javascript
update(data) {
    this.li.innerHTML = data.color
    this.li.setAttribute('style', `background-color: ${data.color};`)

    //If you want to notify that the change was updated just emit an event with `this.updated`.
    this.updated.emit(data)
}
```
#### **Parameters**
**data | `any`** It can be any type of data, you decide it.

### User Synchronization {docsify-ignore}
These are the methods you wanna use if you want to use synchronization in your project.

### toJSON(*Method*)


#### **Syntax**
```javascript
toJSON(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### fromJSON(*Method*)

#### **Syntax**
```javascript
toJSON(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### changeFromJSON(*Method*)

#### **Syntax**
```javascript
changeFromJSON(data) {
    
}
```