<a name="CreateFreehandLineTool"></a>

### CreateFreehandLineTool 
Tool for creating a free hand line.**Events*** **actionFinished:** Triggered when the creation of the geometry is completed.


**Extends**: <code>[CreateLineTool](api/Tools\CreateTools\CreateLineTool.md)</code>  

* [CreateFreehandLineTool ⇐ <code>CreateLineTool</code>](#CreateFreehandLineTool)
    * [new CreateFreehandLineTool(appData)](#new-CreateFreehandLineTool)
    * [createStart(xfo)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)

<a name="new_CreateFreehandLineTool_new"></a>

### new CreateFreehandLineTool
Create a create freehand line tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="CreateFreehandLineTool+createStart"></a>

### createStart
Starts the creation of a free hand line.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |

<a name="CreateFreehandLineTool+createMove"></a>

### createMove
Updates the free hand line data.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateFreehandLineTool+createRelease"></a>

### createRelease
Finishes free hand line creation



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

