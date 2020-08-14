<a name="CreateCuboidTool"></a>

### CreateCuboidTool 
Tool for creating Cuboid geometry.

**Events**
* **actionFinished:** Triggered when the creation of the geometry is completed.


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
| appData | <code>object</code> | The appData value. |

<a name="CreateCuboidTool+createStart"></a>

### createStart
Starts the creation of the cuboid.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |
| parentItem | <code>TreeItem</code> | The parentItem param. |

<a name="CreateCuboidTool+createMove"></a>

### createMove
Updates cuboid structural properties.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateCuboidTool+createRelease"></a>

### createRelease
Finishes the creation of the cuboid.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |
| viewport | <code>GLViewport</code> | The viewport param. |

