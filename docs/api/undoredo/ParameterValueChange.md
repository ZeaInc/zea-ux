<a name="ParameterValueChange"></a>

### ParameterValueChange 
Class representing a parameter value change.


**Extends**: <code>Change</code>  

* [ParameterValueChange ⇐ <code>Change</code>](#ParameterValueChange)
    * [new ParameterValueChange(param, newValue, mode)](#new-ParameterValueChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [update(updateData)](#update)
    * [toJSON(context) ⇒ <code>any</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)
    * [changeFromJSON(j)](#changeFromJSON)

<a name="new_ParameterValueChange_new"></a>

### new ParameterValueChange
Create a parameter value change.


| Param | Type | Description |
| --- | --- | --- |
| param | <code>object</code> | The param value. |
| newValue | <code>any</code> | The newValue value. |
| mode | <code>number</code> | The mode value. |

<a name="ParameterValueChange+undo"></a>

### undo
The undo method.


<a name="ParameterValueChange+redo"></a>

### redo
The redo method.


<a name="ParameterValueChange+update"></a>

### update
The update method.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>any</code> | The updateData param. |

<a name="ParameterValueChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>any</code> | The context param. |

<a name="ParameterValueChange+fromJSON"></a>

### fromJSON
The fromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | The j param. |
| context | <code>any</code> | The context param. |

<a name="ParameterValueChange+changeFromJSON"></a>

### changeFromJSON
The changeFromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | The j param. |

