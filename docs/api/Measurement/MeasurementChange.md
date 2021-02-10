<a name="MeasurementChange"></a>

### MeasurementChange 
Represents a Measurement change.


**Extends**: <code>[Change](api/UndoRedo\Change.md)</code>  

* [MeasurementChange ⇐ <code>Change</code>](#MeasurementChange)
    * [new MeasurementChange(parentItem, startPos)](#new-MeasurementChange)
    * [update(data)](#update)
    * [end()](#end)
    * [undo()](#undo)
    * [redo()](#redo)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)
    * [destroy()](#destroy)

<a name="new_MeasurementChange_new"></a>

### new MeasurementChange
Creates an instance of MeasurementChange.


| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>TreeItem</code> | The parentItem value |
| startPos | <code>Xfo</code> | The startPos Value |

<a name="MeasurementChange+update"></a>

### update


| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | An object containing potentially the start and end positions. |

<a name="MeasurementChange+end"></a>

### end

<a name="MeasurementChange+undo"></a>

### undo
Removes recently created geometry from its parent.


<a name="MeasurementChange+redo"></a>

### redo
Restores recently created geometry and adds it to the specified parent tree item.


<a name="MeasurementChange+toJSON"></a>

### toJSON
Serializes the change as a JSON object.


**Returns**: <code>object</code> - - The serialized change  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The context value |

<a name="MeasurementChange+fromJSON"></a>

### fromJSON
Restores geometry from using the specified JSON



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |
| context | <code>object</code> | The appData param. |

<a name="MeasurementChange+destroy"></a>

### destroy
Removes geometry item reference from change change.


