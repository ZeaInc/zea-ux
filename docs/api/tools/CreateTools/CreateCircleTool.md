### Classes

<dl>
<dt><a href="#CreateCircleChange">CreateCircleChange</a> ⇐ <code>CreateGeomChange</code></dt>
<dd><p>Class representing a create circle change.</p>
</dd>
<dt><a href="#CreateCircleTool">CreateCircleTool</a> ⇐ <code>CreateGeomTool</code></dt>
<dd><p>Class representing a create circle tool.</p>
</dd>
</dl>

<a name="CreateCircleChange"></a>

### CreateCircleChange 
Class representing a create circle change.


**Extends**: <code>CreateGeomChange</code>  

* [CreateCircleChange ⇐ <code>CreateGeomChange</code>](#CreateCircleChange)
    * [new CreateCircleChange(parentItem, xfo)](#new-CreateCircleChange)
    * [update(updateData)](#update)
    * [toJSON() ⇒ <code>any</code>](#toJSON)
    * [changeFromJSON(j)](#changeFromJSON)

<a name="new_CreateCircleChange_new"></a>

### new CreateCircleChange
Create a create circle change.


| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>any</code> | The parentItem value. |
| xfo | <code>any</code> | The xfo value. |

<a name="CreateCircleChange+update"></a>

### update
The update method.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>any</code> | The updateData param. |

<a name="CreateCircleChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>any</code> - The return value.  
<a name="CreateCircleChange+changeFromJSON"></a>

### changeFromJSON
The changeFromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | The j param. |

<a name="CreateCircleTool"></a>

### CreateCircleTool 
Class representing a create circle tool.


**Extends**: <code>CreateGeomTool</code>  

* [CreateCircleTool ⇐ <code>CreateGeomTool</code>](#CreateCircleTool)
    * [new CreateCircleTool(appData)](#new-CreateCircleTool)
    * [createStart(xfo, parentItem)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)

<a name="new_CreateCircleTool_new"></a>

### new CreateCircleTool
Create a create circle tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="CreateCircleTool+createStart"></a>

### createStart
The createStart method.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>any</code> | The xfo param. |
| parentItem | <code>any</code> | The parentItem param. |

<a name="CreateCircleTool+createMove"></a>

### createMove
The createMove method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

<a name="CreateCircleTool+createRelease"></a>

### createRelease
The createRelease method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

