<a name="ParameterValueChange"></a>

### ParameterValueChange 
Represents a `Change` class for storing `Parameter` values.**Events*** **updated:** Triggered when the `ParameterValueChange` value is updated.


**Extends**: <code>[Change](api/UndoRedo\Change.md)</code>  

* [ParameterValueChange ⇐ <code>Change</code>](#ParameterValueChange)
    * [new ParameterValueChange(param, newValue)](#new-ParameterValueChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [update(updateData)](#update)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)
    * [updateFromJSON(j)](#updateFromJSON)

<a name="new_ParameterValueChange_new"></a>

### new ParameterValueChange
Creates an instance of ParameterValueChange.


| Param | Type | Description |
| --- | --- | --- |
| param | <code>Parameter</code> | The param value. |
| newValue | <code>object</code> \| <code>string</code> \| <code>number</code> \| <code>any</code> | The newValue value. |

<a name="ParameterValueChange+undo"></a>

### undo
Rollbacks the value of the parameter to the previous one, passing it to the redo stack in case you wanna recover it later on.


<a name="ParameterValueChange+redo"></a>

### redo
Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stackand updating the parameter with the new value.


<a name="ParameterValueChange+update"></a>

### update
Updates the state of the current parameter change value.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>Parameter</code> | The updateData param. |

<a name="ParameterValueChange+toJSON"></a>

### toJSON
Serializes `Parameter` instance value as a JSON object, allowing persistence/replication.


**Returns**: <code>object</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The context param. |

<a name="ParameterValueChange+fromJSON"></a>

### fromJSON
Restores `Parameter` instance's state with the specified JSON object.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |
| context | <code>object</code> | The context param. |

<a name="ParameterValueChange+updateFromJSON"></a>

### updateFromJSON
Updates the state of an existing identified `Parameter` through replication.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |

