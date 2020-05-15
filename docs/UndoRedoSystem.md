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
**change |** Instantiated class derived from the [`Change`](#changeclass) class.


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
**[change | null] |** Instantiated class derived from the [`Change`](#changeclass) class or a null if there's nothing in the undo stack.


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
This tool was build with multiple users synchronization in mind, in other words, synchronize undo/redo stacks for all the users, every command will inmediatly get replicated to all the other users

### constructChange(*Method*)

#### **Syntax**
```javascript
const data = {...}
const className = 'FooChange'
const fooChangeClass = UndoRedoManager.constructChange(className);
fooChangeClass.fromJSON(data)
```

### getChangeClassName(*Method*)

#### **Syntax**
```javascript
const className = UndoRedoManager.getChangeClassName(fooChange);
```

### registerChange(*Method*)
asdasdasd

#### **Syntax**
```javascript
class FooChange extends Change {
    constructor() 
        super('FooChange')
    }
}

UndoRedoManager.registerChange('FooChange', FooChange);
```

---
## Change(*Class*)
Class `Change` is like an abstract class, that should be used to impose a guideline or to impose the structure of all the classes registered in the `UndoRedoManager` class.

### Constructor
`Change(name)`

Every class that extends from `Change` must contain a global `name` attribute. It is used by the `UndoRedoManager` factory to re-construct the class of the specific implementation of the `Change` class.

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
```

```javascript
/**
 * Setting name attribute directly without using super class constructor
 */
class FooChange extends Change {
    constructor() {
        this.name = 'FooChange'
    }
}
```

!> **name** attribute is mandatory and important to register classes in the `UndoRedoManager` Factory, because when the code is transpiled, the name of the classes change, 
so, we need a way of relating the transpiled class name with the actual class name.

### undo(*Method*)
Called by the `UndoRedoManager` in the `undo` method, represents your specific implementation, it can be anything you want.

#### **Syntax**
```javascript
undo() {
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    backgroundColors.splice(this.backgroundColor, 1)
}
```

### redo(*Method*)
Called by the `UndoRedoManager` in the `redo` method, represents your specific implementation, it can be anything you want.

#### **Syntax**
```javascript
redo() {
    backgroundColors.push(this.backgroundColor)
}
```

### cancel(*Method*)
Called by the `UndoRedoManager` in the `cancel` method, represents your specific implementation, it can be anything you want.

#### **Syntax**
```javascript
cancel() {
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    backgroundColors.splice(this.backgroundColor, 1)
}
```

### update(*Method*)

#### **Syntax**
```javascript
update(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

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