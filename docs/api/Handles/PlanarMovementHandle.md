<a name="PlanarMovementHandle"></a>

### PlanarMovementHandle 
Class representing a planar movement scene widget.


**Extends**: <code>Handle</code>  

* [PlanarMovementHandle ⇐ <code>Handle</code>](#PlanarMovementHandle)
    * [new PlanarMovementHandle(name)](#new-PlanarMovementHandle)
    * [setTargetParam(param, track)](#setTargetParam)
    * [getTargetParam() ⇒ <code>Parameter</code>](#getTargetParam)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)
    * [onVRPoseChanged(event)](#onVRPoseChanged)
    * [onVRControllerButtonUp(event)](#onVRControllerButtonUp)

<a name="new_PlanarMovementHandle_new"></a>

### new PlanarMovementHandle
Create a planar movement scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |

<a name="PlanarMovementHandle+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| param | <code>Parameter</code> |  | The video param. |
| track | <code>boolean</code> | <code>true</code> | The track param. |

<a name="PlanarMovementHandle+getTargetParam"></a>

### getTargetParam
Returns target's global xfo parameter.


**Returns**: <code>Parameter</code> - - returns handle's target global Xfo.  
<a name="PlanarMovementHandle+onDragStart"></a>

### onDragStart
Handles the initially drag of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="PlanarMovementHandle+onDrag"></a>

### onDrag
Handles drag action of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="PlanarMovementHandle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="PlanarMovementHandle+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed over the handle.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="PlanarMovementHandle+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="PlanarMovementHandle+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
Event fired when a VR controller button is released over the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

