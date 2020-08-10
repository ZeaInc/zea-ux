### Classes

<dl>
<dt><a href="#CreateFreehandLineChange">CreateFreehandLineChange</a> ⇐ <code>CreateGeomChange</code></dt>
<dd><p>Class representing a create freehand line change.</p>
</dd>
<dt><a href="#CreateFreehandLineTool">CreateFreehandLineTool</a> ⇐ <code>CreateLineTool</code></dt>
<dd><p>Class representing a create freehand line tool.</p>
</dd>
</dl>

<a name="CreateFreehandLineChange"></a>

### CreateFreehandLineChange 
Class representing a create freehand line change.


**Extends**: <code>CreateGeomChange</code>  

* [CreateFreehandLineChange ⇐ <code>CreateGeomChange</code>](#CreateFreehandLineChange)
    * [new CreateFreehandLineChange(parentItem, xfo, color, thickness)](#new-CreateFreehandLineChange)
    * [update(updateData)](#update)
    * [toJSON(appData) ⇒ <code>any</code>](#toJSON)
    * [fromJSON(j, appData)](#fromJSON)

<a name="new_CreateFreehandLineChange_new"></a>

### new CreateFreehandLineChange
Create a create freehand line change.


| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>any</code> | The parentItem value. |
| xfo | <code>any</code> | The xfo value. |
| color | <code>any</code> | The color value. |
| thickness | <code>any</code> | The thickness value. |

<a name="CreateFreehandLineChange+update"></a>

### update
The update method.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>any</code> | The updateData param. |

<a name="CreateFreehandLineChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData param. |

<a name="CreateFreehandLineChange+fromJSON"></a>

### fromJSON
The fromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | The j param. |
| appData | <code>any</code> | The appData param. |

<a name="CreateFreehandLineTool"></a>

### CreateFreehandLineTool 
Class representing a create freehand line tool.


**Extends**: <code>CreateLineTool</code>  

* [CreateFreehandLineTool ⇐ <code>CreateLineTool</code>](#CreateFreehandLineTool)
    * [new CreateFreehandLineTool(appData)](#new-CreateFreehandLineTool)
    * [createStart(xfo, parentItem)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)

<a name="new_CreateFreehandLineTool_new"></a>

### new CreateFreehandLineTool
Create a create freehand line tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="CreateFreehandLineTool+createStart"></a>

### createStart
The createStart method.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>any</code> | The xfo param. |
| parentItem | <code>any</code> | The parentItem param. |

<a name="CreateFreehandLineTool+createMove"></a>

### createMove
The createMove method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

<a name="CreateFreehandLineTool+createRelease"></a>

### createRelease
The createRelease method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

