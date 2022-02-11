<a name="CreateGeomTool"></a>

### CreateGeomTool 
Base class for creating geometry tools.


**Extends**: <code>[BaseCreateTool](api/Tools\BaseCreateTool.md)</code>  

* [CreateGeomTool ⇐ <code>BaseCreateTool</code>](#CreateGeomTool)
    * [new CreateGeomTool(appData)](#new-CreateGeomTool)
    * [addIconToVRController(controller)](#addIconToVRController)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [screenPosToXfo(event) ⇒ <code>Xfo</code>](#screenPosToXfo)
    * [createStart(xfo)](#createStart)
    * [createPoint(pt)](#createPoint)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)
    * [onPointerDown(event)](#onPointerDown)
    * [onPointerMove(event)](#onPointerMove)
    * [onPointerUp(event)](#onPointerUp)
    * [onWheel(event)](#onWheel)
    * [onKeyPressed(event)](#onKeyPressed)
    * [onKeyDown(event)](#onKeyDown)
    * [onKeyUp(event)](#onKeyUp)
    * [onTouchCancel(event)](#onTouchCancel)
    * [onVRControllerButtonDown(event)](#onVRControllerButtonDown)
    * [onVRPoseChanged(event)](#onVRPoseChanged)
    * [onVRControllerButtonUp(event)](#onVRControllerButtonUp)

<a name="new_CreateGeomTool_new"></a>

### new CreateGeomTool
Create a create geom tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="CreateGeomTool+addIconToVRController"></a>

### addIconToVRController
Adds a geometry icon to the VR Controller



| Param | Type | Description |
| --- | --- | --- |
| controller | <code>VRController</code> | The controller object. |

<a name="CreateGeomTool+activateTool"></a>

### activateTool
The activateTool method.


<a name="CreateGeomTool+deactivateTool"></a>

### deactivateTool
The deactivateTool method.


<a name="CreateGeomTool+screenPosToXfo"></a>

### screenPosToXfo
Transforms the screen position in the viewport to an Xfo object.


**Returns**: <code>Xfo</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> | The event param |

<a name="CreateGeomTool+createStart"></a>

### createStart
Starts the creation of the geometry.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |

<a name="CreateGeomTool+createPoint"></a>

### createPoint
The createPoint method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateGeomTool+createMove"></a>

### createMove
The createMove method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateGeomTool+createRelease"></a>

### createRelease
The createRelease method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateGeomTool+onPointerDown"></a>

### onPointerDown
Event fired when a pointing device button is pressed over the viewport while the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> | The event param. |

<a name="CreateGeomTool+onPointerMove"></a>

### onPointerMove
Event fired when a pointing device is moved while the cursor's hotspot is inside the viewport, while tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> | The event param. |

<a name="CreateGeomTool+onPointerUp"></a>

### onPointerUp
Event fired when a pointing device button is released while the pointer is over the viewport, while the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> | The event param. |

<a name="CreateGeomTool+onWheel"></a>

### onWheel
Event fired when the user rotates the pointing device wheel, while the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="CreateGeomTool+onKeyPressed"></a>

### onKeyPressed
Event fired when the user presses a key on the keyboard, while the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="CreateGeomTool+onKeyDown"></a>

### onKeyDown
Event fired when the user presses down a key on the keyboard, while the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="CreateGeomTool+onKeyUp"></a>

### onKeyUp
Event fired when the user releases a key on the keyboard.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="CreateGeomTool+onTouchCancel"></a>

### onTouchCancel
Event fired when one or more touch points have been disrupted in an implementation-specific manner inside the viewport, when the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="CreateGeomTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed inside the viewport, when the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="CreateGeomTool+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="CreateGeomTool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
Event fired when a VR controller button is released inside the viewport, when the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

