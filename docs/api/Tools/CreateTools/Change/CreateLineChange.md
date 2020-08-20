<a name="CreateLineChange"></a>

### CreateLineChange 
Class representing a create line change.

**Events**
* **updated:** Triggered when the change is updated


**Extends**: <code>CreateGeomChange</code>  

* [CreateLineChange ⇐ <code>CreateGeomChange</code>](#CreateLineChange)
    * [new CreateLineChange(parentItem, xfo, color, thickness)](#new-CreateLineChange)
    * [update(updateData)](#update)
    * [fromJSON(j, context)](#fromJSON)

<a name="new_CreateLineChange_new"></a>

### new CreateLineChange
Create a create line change.


| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>TreeItem</code> | The parentItem value. |
| xfo | <code>Xfo</code> | The xfo value. |
| color | <code>Color</code> | The color value. |
| thickness | <code>number</code> | The thickness value. |

<a name="CreateLineChange+update"></a>

### update
Updates Line using the specified data.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>object</code> | The updateData param. |

<a name="CreateLineChange+fromJSON"></a>

### fromJSON
Restores line geometry using a JSON object.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |
| context | <code>object</code> | The context param. |

