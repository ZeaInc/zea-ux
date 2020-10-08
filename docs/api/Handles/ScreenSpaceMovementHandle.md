<a name="ScreenSpaceMovementHandle"></a>

### ScreenSpaceMovementHandle 
Class representing a planar movement scene widget.


**Extends**: <code>[Handle](api/Handles/Handle.md)</code>  

* [ScreenSpaceMovementHandle ⇐ <code>Handle</code>](#ScreenSpaceMovementHandle)
    * [new ScreenSpaceMovementHandle(name)](#new-ScreenSpaceMovementHandle)
    * [setTargetParam(param, track)](#setTargetParam)
    * [getTargetParam() ⇒ <code>Parameter</code>](#getTargetParam)
    * [handlePointerDown(event) ⇒ <code>boolean</code>](#handlePointerDown)
    * [handlePointerMove(event) ⇒ <code>boolean</code>](#handlePointerMove)
    * [handlePointerUp(event) ⇒ <code>boolean</code>](#handlePointerUp)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)

<a name="new_ScreenSpaceMovementHandle_new"></a>

### new ScreenSpaceMovementHandle
Create a planar movement scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value |

<a name="ScreenSpaceMovementHandle+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| param | <code>Parameter</code> |  | The video param. |
| track | <code>boolean</code> | <code>true</code> | The track param. |

<a name="ScreenSpaceMovementHandle+getTargetParam"></a>

### getTargetParam
Returns target's global xfo parameter.


**Returns**: <code>Parameter</code> - - returns handle's target global Xfo.  
<a name="ScreenSpaceMovementHandle+handlePointerDown"></a>

### handlePointerDown
Handles mouse down interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ScreenSpaceMovementHandle+handlePointerMove"></a>

### handlePointerMove
Handles mouse move interaction with the handle.


**Returns**: <code>boolean</code> - - The return value  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> | The event param |

<a name="ScreenSpaceMovementHandle+handlePointerUp"></a>

### handlePointerUp
Handles mouse up interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> | The event param. |

<a name="ScreenSpaceMovementHandle+onDragStart"></a>

### onDragStart
Handles the initially drag of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="ScreenSpaceMovementHandle+onDrag"></a>

### onDrag
Handles drag action of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="ScreenSpaceMovementHandle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

