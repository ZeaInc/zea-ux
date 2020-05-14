# Undo/Redo System
As part of the UX Library, this tool allows you to implement Undo/Redo/Cancel commands on your system, managing a stack of changes so you can navigate through them.

[](_examples/UndoRedoSystem.html ':include :type=iframe width=100% height=150px')

```javascript
import { UndoRedoManager } from '@zeainc/zea-ux';
import { Signal } from '@zeainc/zea-engine';

// Type of Change Class
class FooChange {
  constructor() {
    this.name = 'FooChange'

    // This signal is used by the UndoRedoManager
    this.updated = new Signal()
  }

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

UndoRedoManager.registerChange('FooChange', FooChange)

window.onload = () => {
  const addColorBtn = document.getElementById('addColorBtn')
  const undoBtn = document.getElementById('undoBtn')
  const redoBtn = document.getElementById('redoBtn')

  const undoRedoManager = new UndoRedoManager()

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

## UndoRedoManager(*Class* )
Class `UndoRedoManager` is a mixture of the [Factory Design Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) and the actual stack of changes manager.
This is the heart of the Undo/Redo System, letting you navigate through the history of changes you've saved.

!> This relies on the [Signal]() notification system, when a change is added, updated, undone, redone or cancelled.

### constructor
`UndoRedoManager()`
It doesn't have any parameters, but under the hood it initializes the [signals]() that notify subscribers when something happens.

#### **Syntax**
```javascript
const undoRedoManager = new UndoRedoManager()
```

### flush(*Method* )
As the name indicates, it empties undo/redo stacks permanently, losing all the pass stored actions().

#### **Syntax**
```javascript
undoRedoManager.flush()
```

### addChange(*Method* )
asdasd

#### **Syntax**
```javascript
const fooChange = new FooChange()
undoRedoManager.addChange(fooChange)
```
#### **Parameters**
**change** | Instantiated class of type `Change`.


### getCurrentChange(*Method* )+
aasdasd

#### **Syntax**
```javascript
const currentChange = undoRedoManager.getCurrentChange()
```
#### **Return value**


### undo(*Method* )
Rollback the latest action, passing it to the redo stack in case you wanna recover it later on.

#### **Syntax**
```javascript
undoRedoManager.undo()
```

### redo(*Method* )
Rollbacks the `undo` action

#### **Syntax**
```javascript
undoRedoManager.redo()
```

### cancel(*Method* )
Works the same as the `undo` method, but it doesn't move the change to the redo stack, it just removes it permanently. Like if it never existed.

#### **Syntax**
```javascript
undoRedoManager.undo()
```

### User Synchronization {docsify-ignore}
This tool was build with multiple users synchronization in mind, in other words, synchronize undo/redo stacks for all the users, every command will inmediatly get replicated to all the other users

### constructChange(*Method* )

#### **Syntax**
```javascript
const data = {...}
const className = 'FooChange'
const fooChangeClass = UndoRedoManager.constructChange(className);
fooChangeClass.fromJSON(data)
```

### getChangeClassName(*Method* )

#### **Syntax**
```javascript
const className = UndoRedoManager.getChangeClassName(fooChange);
```

### registerChange(*Method* )
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
## Change(*Class* )
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

### undo(*Method* )
Called by the `UndoRedoManager` in the `undo` method, represents your specific implementation, it can be anything you want.

#### **Syntax**
```javascript
undo() {
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    backgroundColors.splice(this.backgroundColor, 1)
}
```

### redo(*Method* )
Called by the `UndoRedoManager` in the `redo` method, represents your specific implementation, it can be anything you want.

#### **Syntax**
```javascript
redo() {
    backgroundColors.push(this.backgroundColor)
}
```

### cancel(*Method* )
Called by the `UndoRedoManager` in the `cancel` method, represents your specific implementation, it can be anything you want.

#### **Syntax**
```javascript
cancel() {
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    backgroundColors.splice(this.backgroundColor, 1)
}
```

### update(*Method* )

#### **Syntax**
```javascript
update(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### toJSON(*Method* )

#### **Syntax**
```javascript
toJSON(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### fromJSON(*Method* )

#### **Syntax**
```javascript
toJSON(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### changeFromJSON(*Method* )

#### **Syntax**
```javascript
changeFromJSON(data) {
    
}
```