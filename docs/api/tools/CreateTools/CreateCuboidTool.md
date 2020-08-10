### Classes

<dl>
<dt><a href="#CreateCuboidChange">CreateCuboidChange</a> ⇐ <code>CreateGeomChange</code></dt>
<dd><p>Class representing a create cuboid change.</p>
</dd>
<dt><a href="#CreateCuboidTool">CreateCuboidTool</a> ⇐ <code>CreateGeomTool</code></dt>
<dd><p>Class representing a create cuboid tool.</p>
</dd>
</dl>

<a name="CreateCuboidChange"></a>

### CreateCuboidChange 
Class representing a create cuboid change.


**Extends**: <code>CreateGeomChange</code>  

* [CreateCuboidChange ⇐ <code>CreateGeomChange</code>](#CreateCuboidChange)
    * [new CreateCuboidChange(parentItem, xfo)](#new-CreateCuboidChange)
    * [update(updateData)](#update)

<a name="new_CreateCuboidChange_new"></a>

### new CreateCuboidChange
Create a create cuboid change.


| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>any</code> | The parentItem value. |
| xfo | <code>any</code> | The xfo value. |

<a name="CreateCuboidChange+update"></a>

### update
The update method.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>any</code> | The updateData param. |

<a name="CreateCuboidTool"></a>

### CreateCuboidTool 
Class representing a create cuboid tool.


**Extends**: <code>CreateGeomTool</code>  

* [CreateCuboidTool ⇐ <code>CreateGeomTool</code>](#CreateCuboidTool)
    * [new CreateCuboidTool(appData)](#new-CreateCuboidTool)
    * [createStart(xfo, parentItem)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt, viewport)](#createRelease)

<a name="new_CreateCuboidTool_new"></a>

### new CreateCuboidTool
Create a create cuboid tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="CreateCuboidTool+createStart"></a>

### createStart
The createStart method.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>any</code> | The xfo param. |
| parentItem | <code>any</code> | The parentItem param. |

<a name="CreateCuboidTool+createMove"></a>

### createMove
The createMove method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

<a name="CreateCuboidTool+createRelease"></a>

### createRelease
The createRelease method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |
| viewport | <code>any</code> | The viewport param. |

