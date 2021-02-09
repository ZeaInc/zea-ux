<a name="CreateCircleTool"></a>

### CreateCircleTool 
Tool for creating a circle geometry.**Events*** **actionFinished:** Triggered when the creation of the geometry is completed.


**Extends**: <code>[CreateGeomTool](api/Tools\CreateTools\CreateGeomTool.md)</code>  

* [CreateCircleTool ⇐ <code>CreateGeomTool</code>](#CreateCircleTool)
    * [new CreateCircleTool(appData)](#new-CreateCircleTool)
    * [createStart(xfo)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)

<a name="new_CreateCircleTool_new"></a>

### new CreateCircleTool
Create a create circle tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="CreateCircleTool+createStart"></a>

### createStart
Starts the creation of the geometry.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |

<a name="CreateCircleTool+createMove"></a>

### createMove
Updates Circle geometry radius.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateCircleTool+createRelease"></a>

### createRelease
Finishes geometry creation.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

