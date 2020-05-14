# Deshacer/Rehacer Sistema
As part of the UX library, this tool allows you to implement Deshacer/Rehacer/Cancel commands on your system, managing a stack of changes so you can navigate through them.

---

## UndoRedoManager(*Clase* )
Clase `UndoRedoManager` is a mixture of the [Factory Design Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) and the actual stack of changes manager.
This is the heart of the Deshacer/Rehacer Sistema, letting you navigate through the history of changes you've saved.

!> This relies on the [Signal]() notification system, when a change is added, updated, undone, redone or cancelled.

### constructor
`UndoRedoManager()`
It doesn't have any parameters, but under the hood it initializes the [signals]() that notify subscribers when something happens.

```javascript
const undoRedoManager = new UndoRedoManager()
```

### flush(*Método* )

### addChange(*Método* )

### getCurrentChange(*Método* )

### undo(*Método* )
Rollback the latest action, passing it to the redo stack in case you wanna recover it later on.
```javascript
undoRedoManager.undo()
```

### redo(*Método* )
Rollbacks the `undo` action
```javascript
undoRedoManager.redo()
```

### cancel(*Método* )
Works the same as the `undo` Método, but it doesn't move the change to the redo stack, it just removes it permanently. Like if it never existed.
```javascript
undoRedoManager.undo()
```

### User Synchronization {docsify-ignore}
This tool was build with multiple users synchronization in mind, in other words, synchronize undo/redo stacks for all the users, every command will inmediatly get replicated to all the other users

### constructChange(*Método* )

### getChangeClassName(*Método* )

### registerChange(*Método* )
---
## Change(*Clase* )
Clase `Change` is like an abstract class, that should be used to impose a guideline or to impose the structure of all the classes registered in the `UndoRedoManager` class.

### Constructor
`Change(name)`

Every class that extends from `Change` must contain a global `name` attribute. It is used by the `UndoRedoManager` factory to re-construct the class of the specific implementation of the `Change` class.
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

[](../_examples/UndoRedoSystem.html ':include :type=iframe width=100% height=150px')

### undo(*Método* )
Called by the `UndoRedoManager` in the `undo` Método, represents your specific implementation, it can be anything you want.
```javascript
undo() {
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    backgroundColors.splice(this.backgroundColor, 1)
}
```

### redo(*Método* )
Called by the `UndoRedoManager` in the `redo` Método, represents your specific implementation, it can be anything you want.
```javascript
redo() {
    backgroundColors.push(this.backgroundColor)
}
```

### cancel(*Método* )
Called by the `UndoRedoManager` in the `cancel` Método, represents your specific implementation, it can be anything you want.
```javascript
cancel() {
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    backgroundColors.splice(this.backgroundColor, 1)
}
```

### update(*Método* )
```javascript
update(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### toJSON(*Método* )
```javascript
toJSON(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### fromJSON(*Método* )
```javascript
toJSON(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### changeFromJSON(*Método* )
```javascript
changeFromJSON(data) {
    
}
```

### destroy(*Método* )
```javascript
destroy(data) {
    
}
```