<a name="CreateFreehandLineChange"></a>

### CreateFreehandLineChange 
Class representing a create freehand line change.

**Events**
* **updated:** Triggered when the change is updated


**Extends**: <code>CreateGeomChange</code>  

* [CreateFreehandLineChange ⇐ <code>CreateGeomChange</code>](#CreateFreehandLineChange)
    * [new CreateFreehandLineChange(parentItem, xfo, color, thickness)](#new-CreateFreehandLineChange)
    * [update(updateData)](#update)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)

<a name="new_CreateFreehandLineChange_new"></a>

### new CreateFreehandLineChange
Create a create freehand line change.


| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>TreeItem</code> | The parentItem value. |
| xfo | <code>Xfo</code> | The xfo value. |
| color | <code>Color</code> | The color value. |
| thickness | <code>number</code> | The thickness value. |

<a name="CreateFreehandLineChange+update"></a>

### update
Updates free hand line using the specified data.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>object</code> | The updateData param. |

<a name="CreateFreehandLineChange+toJSON"></a>

### toJSON
Serializes change as a JSON object.


**Returns**: <code>object</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The appData param. |

<a name="CreateFreehandLineChange+fromJSON"></a>

### fromJSON
Restores free hand line from a JSON object.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |
| context | <code>object</code> | The appData param. |

