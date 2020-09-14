<a name="CreateRectTool"></a>

### CreateRectTool 
Tool for creating a rectangle geometry.

**Events**
* **actionFinished:** Triggered when the creation of the geometry is completed.


**Extends**: <code>[CreateGeomTool](api/Tools/CreateTools/CreateGeomTool.md)</code>  

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
| appData | <code>object</code> | The appData value. |

<a name="CreateRectTool+createStart"></a>

### createStart
Starts the creation of a rectangle geometry.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |
| parentItem | <code>TreeItem</code> | The parentItem param. |

<a name="CreateRectTool+createMove"></a>

### createMove
Updated the rectangle geometry structural properties.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateRectTool+createRelease"></a>

### createRelease
Finishes the creation of a rectangle geometry.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |
| viewport | <code>GLViewport</code> | The viewport param. |

