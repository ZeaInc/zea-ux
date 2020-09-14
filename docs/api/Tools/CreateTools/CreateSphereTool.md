<a name="CreateSphereTool"></a>

### CreateSphereTool 
Tool for creating Sphere geometries.

**Events**
* **actionFinished:** Triggered when the creation of the geometry is completed.


**Extends**: <code>[CreateGeomTool](api/Tools/CreateTools/CreateGeomTool.md)</code>  

* [CreateSphereTool ⇐ <code>CreateGeomTool</code>](#CreateSphereTool)
    * [new CreateSphereTool(appData)](#new-CreateSphereTool)
    * [createStart(xfo, parentItem)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)

<a name="new_CreateSphereTool_new"></a>

### new CreateSphereTool
Create a create sphere tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="CreateSphereTool+createStart"></a>

### createStart
Starts the creation of the sphere geometry.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |
| parentItem | <code>TreeItem</code> | The parentItem param. |

<a name="CreateSphereTool+createMove"></a>

### createMove
Updates the sphere geometry structural properties.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>vec3</code> | The pt param. |

<a name="CreateSphereTool+createRelease"></a>

### createRelease
Finishes the creation of the sphere geometry.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

