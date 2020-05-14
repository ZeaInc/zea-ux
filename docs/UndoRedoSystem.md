# Undo/Redo System
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel nisl vitae arcu convallis viverra vel sed ex. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque a neque a mi lacinia semper. Cras a nisi sed lorem tincidunt rutrum. Aenean at ipsum ut diam euismod tristique. Proin condimentum quis purus nec porta. Nullam metus dolor, pulvinar eu justo id, condimentum dictum neque. Sed egestas hendrerit erat. Nunc ullamcorper nulla id diam dignissim, et tempor nulla dictum. Praesent elementum, ligula ac ornare vehicula, nulla sem lobortis ex, nec fringilla ipsum est quis orci. Proin nec tincidunt nisl. In hac habitasse platea dictumst. Nunc massa ex, pretium commodo sapien at, malesuada vehicula mauris.

## UndoRedoManager
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sollicitudin, est quis sollicitudin pharetra, est nisl tempus lectus, non maximus elit nulla sed nibh. Morbi et vestibulum arcu. Curabitur porta justo magna, nec luctus eros aliquam quis. Donec a nisi libero. Donec a massa lectus. Morbi sit amet diam hendrerit.

### flush

### addChange

### getCurrentChange

### __currChangeUpdated

### undo

### redo

### constructChange

### getChangeClassName

### registerChange



## Change
Class `Change` is like an abstract class, that should be used to impose a guideline or to impose the structure of all the classes registered in the `UndoRedoManager` class.

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

[](_examples/UndoRedoSystem.html ':include :type=iframe width=100% height=150px')

### undo
Called by the `UndoRedoManager` in the `undo` method, represents your specific implementation, it can be anything you want.
```javascript
undo() {
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    backgroundColors.splice(this.backgroundColor, 1)
}
```

### redo
Called by the `UndoRedoManager` in the `redo` method, represents your specific implementation, it can be anything you want.
```javascript
redo() {
    backgroundColors.push(this.backgroundColor)
}
```

### cancel
Called by the `UndoRedoManager` in the `cancel` method, represents your specific implementation, it can be anything you want.
```javascript
cancel() {
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    backgroundColors.splice(this.backgroundColor, 1)
}
```

### update
```javascript
update(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### toJSON
```javascript
toJSON(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### fromJSON
```javascript
toJSON(data) {
    this.backgroundColor = data.backgroundColor
    const colorIndex = backgroundColors.indexOf(this.backgroundColor)
    document.body.setAttribute('style', `background-color: ${this.backgroundColor};`)
    this.updated.emit(data)
}
```

### changeFromJSON
```javascript
changeFromJSON(data) {
    
}
```

### destroy
```javascript
destroy(data) {
    
}
```