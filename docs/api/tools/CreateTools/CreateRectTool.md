### Classes

<dl>
<dt><a href="#CreateRectChange">CreateRectChange</a> ⇐ <code>CreateGeomChange</code></dt>
<dd><p>Class representing a create rect change.</p>
</dd>
<dt><a href="#CreateRectTool">CreateRectTool</a> ⇐ <code>CreateGeomTool</code></dt>
<dd><p>Class representing a create rect tool.</p>
</dd>
</dl>

<a name="CreateRectChange"></a>

### CreateRectChange 
Class representing a create rect change.


**Extends**: <code>CreateGeomChange</code>  

* [CreateRectChange ⇐ <code>CreateGeomChange</code>](#CreateRectChange)
    * [new CreateRectChange(parentItem, xfo)](#new-CreateRectChange)
    * [update(updateData)](#update)

<a name="new_CreateRectChange_new"></a>

### new CreateRectChange
Create a create rect change.


| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>any</code> | The parentItem value. |
| xfo | <code>any</code> | The xfo value. |

<a name="CreateRectChange+update"></a>

### update
The update method.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>any</code> | The updateData param. |

<a name="CreateRectTool"></a>

### CreateRectTool 
Class representing a create rect tool.


**Extends**: <code>CreateGeomTool</code>  

* [CreateRectTool ⇐ <code>CreateGeomTool</code>](#CreateRectTool)
    * [new CreateRectTool(appData)](#new-CreateRectTool)
    * [createStart(xfo, parentItem)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt, viewport)](#createRelease)

<a name="new_CreateRectTool_new"></a>

### new CreateRectTool
Create a create rect tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="CreateRectTool+createStart"></a>

### createStart
The createStart method.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>any</code> | The xfo param. |
| parentItem | <code>any</code> | The parentItem param. |

<a name="CreateRectTool+createMove"></a>

### createMove
The createMove method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

<a name="CreateRectTool+createRelease"></a>

### createRelease
The createRelease method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |
| viewport | <code>any</code> | The viewport param. |

