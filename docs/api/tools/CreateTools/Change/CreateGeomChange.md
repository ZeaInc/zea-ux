<a name="CreateGeomChange"></a>

### CreateGeomChange 
Class representing a create geom change.


**Extends**: <code>Change</code>  

* [CreateGeomChange ⇐ <code>Change</code>](#CreateGeomChange)
    * [new CreateGeomChange(name)](#new-CreateGeomChange)
    * [setParentAndXfo(parentItem, xfo)](#setParentAndXfo)
    * [undo()](#undo)
    * [redo()](#redo)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)
    * [destroy()](#destroy)

<a name="new_CreateGeomChange_new"></a>

### new CreateGeomChange
Create a create circle change.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |

<a name="CreateGeomChange+setParentAndXfo"></a>

### setParentAndXfo
The setParentAndXfo method.



| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>TreeItem</code> | The parentItem param. |
| xfo | <code>Xfo</code> | The xfo param. |

<a name="CreateGeomChange+undo"></a>

### undo
Removes recently created geometry from its parent.


<a name="CreateGeomChange+redo"></a>

### redo
Restores recently created geometry and adds it to the specified parent tree item.


<a name="CreateGeomChange+toJSON"></a>

### toJSON
Serializes the change as a JSON object.


**Returns**: <code>object</code> - - The serialized change  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The context value |

<a name="CreateGeomChange+fromJSON"></a>

### fromJSON
Restores geometry from using the specified JSON



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |
| context | <code>object</code> | The appData param. |

<a name="CreateGeomChange+destroy"></a>

### destroy
Removes geometry item reference from change change.


