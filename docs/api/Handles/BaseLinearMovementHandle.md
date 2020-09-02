<a name="BaseLinearMovementHandle"></a>

### BaseLinearMovementHandle 
Class representing a base linear movement scene widget.


**Extends**: <code>[Handle](api/Handles/Handle.md)</code>  

* [BaseLinearMovementHandle ⇐ <code>Handle</code>](#BaseLinearMovementHandle)
    * [new BaseLinearMovementHandle(name)](#new-BaseLinearMovementHandle)
    * [handleMouseDown(event) ⇒ <code>boolean</code>](#handleMouseDown)
    * [handleMouseMove(event)](#handleMouseMove)
    * [handleMouseUp(event) ⇒ <code>boolean</code>](#handleMouseUp)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)
    * [onVRPoseChanged(event) ⇒ <code>boolean</code>](#onVRPoseChanged)
    * [onVRControllerButtonUp(event) ⇒ <code>boolean</code>](#onVRControllerButtonUp)

<a name="new_BaseLinearMovementHandle_new"></a>

### new BaseLinearMovementHandle
Create base linear movement scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |

<a name="BaseLinearMovementHandle+handleMouseDown"></a>

### handleMouseDown
Handles mouse down interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="BaseLinearMovementHandle+handleMouseMove"></a>

### handleMouseMove
Handles mouse move interaction with the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param |

<a name="BaseLinearMovementHandle+handleMouseUp"></a>

### handleMouseUp
Handles mouse up interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="BaseLinearMovementHandle+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed over the handle.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="BaseLinearMovementHandle+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="BaseLinearMovementHandle+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
Event fired when a VR controller button is released over the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

