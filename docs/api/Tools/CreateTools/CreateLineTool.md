<a name="CreateLineTool"></a>

### CreateLineTool 
Tool for creating a line tool.**Events*** **actionFinished:** Triggered when the creation of the geometry is completed.


**Extends**: <code>[CreateGeomTool](api/Tools\CreateTools\CreateGeomTool.md)</code>  

* [CreateLineTool ⇐ <code>CreateGeomTool</code>](#CreateLineTool)
    * [new CreateLineTool(appData)](#new-CreateLineTool)
    * [createStart(xfo)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)
    * [onVRControllerButtonDown(event)](#onVRControllerButtonDown)

<a name="new_CreateLineTool_new"></a>

### new CreateLineTool
Create a create line tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="CreateLineTool+createStart"></a>

### createStart
Starts line geometry creation.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |

<a name="CreateLineTool+createMove"></a>

### createMove
Updates line structural data.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateLineTool+createRelease"></a>

### createRelease
Finishes Line geometry creation.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateLineTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
The onVRControllerButtonDown method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

