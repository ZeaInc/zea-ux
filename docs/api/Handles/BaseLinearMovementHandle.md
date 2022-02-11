<a name="BaseLinearMovementHandle"></a>

### BaseLinearMovementHandle 
Class representing a base linear movement scene widget.


**Extends**: <code>[Handle](api/Handles\Handle.md)</code>  

* [BaseLinearMovementHandle ⇐ <code>Handle</code>](#BaseLinearMovementHandle)
    * [new BaseLinearMovementHandle(name)](#new-BaseLinearMovementHandle)
    * [handlePointerDown(event) ⇒ <code>boolean</code>](#handlePointerDown)
    * [handlePointerMove(event)](#handlePointerMove)
    * [handlePointerUp(event) ⇒ <code>boolean</code>](#handlePointerUp)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)
    * [onVRPoseChanged(event) ⇒ <code>boolean</code>](#onVRPoseChanged)
    * [onVRControllerButtonUp(event) ⇒ <code>boolean</code>](#onVRControllerButtonUp)

<a name="new_BaseLinearMovementHandle_new"></a>

### new BaseLinearMovementHandle
Create base linear movement scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |

<a name="BaseLinearMovementHandle+handlePointerDown"></a>

### handlePointerDown
Handles mouse down interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="BaseLinearMovementHandle+handlePointerMove"></a>

### handlePointerMove
Handles mouse move interaction with the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param |

<a name="BaseLinearMovementHandle+handlePointerUp"></a>

### handlePointerUp
Handles mouse up interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

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

