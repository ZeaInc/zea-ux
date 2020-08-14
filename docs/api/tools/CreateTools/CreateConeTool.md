<a name="CreateConeTool"></a>

### CreateConeTool 
Tool for creating a Cone geometry.

**Events**
* **actionFinished:** Triggered when the creation of the geometry is completed.


**Extends**: <code>CreateGeomTool</code>  

* [CreateConeTool ⇐ <code>CreateGeomTool</code>](#CreateConeTool)
    * [new CreateConeTool(appData)](#new-CreateConeTool)
    * [createStart(xfo)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)

<a name="new_CreateConeTool_new"></a>

### new CreateConeTool
Create a create cone tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="CreateConeTool+createStart"></a>

### createStart
Starts the creation of the geometry.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |

<a name="CreateConeTool+createMove"></a>

### createMove
Updates Cone geometry structural properties.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateConeTool+createRelease"></a>

### createRelease
Finishes the creation of the Cone.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

