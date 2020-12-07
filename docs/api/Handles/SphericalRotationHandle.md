<a name="SphericalRotationHandle"></a>

### SphericalRotationHandle 
Class representing an axial rotation scene widget.


**Extends**: <code>[Handle](api/Handles\Handle.md)</code>  

* [SphericalRotationHandle ⇐ <code>Handle</code>](#SphericalRotationHandle)
    * [new SphericalRotationHandle(name, radius, color)](#new-SphericalRotationHandle)
    * [highlight()](#highlight)
    * [unhighlight()](#unhighlight)
    * [setTargetParam(param, track)](#setTargetParam)
    * [getTargetParam() ⇒ <code>Parameter</code>](#getTargetParam)
    * [handlePointerDown(event) ⇒ <code>boolean</code>](#handlePointerDown)
    * [handlePointerMove(event) ⇒ <code>boolean</code>](#handlePointerMove)
    * [handlePointerUp(event) ⇒ <code>boolean</code>](#handlePointerUp)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)

<a name="new_SphericalRotationHandle_new"></a>

### new SphericalRotationHandle
Create an axial rotation scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |
| radius | <code>number</code> | The radius value. |
| color | <code>Color</code> | The color value. |

<a name="SphericalRotationHandle+highlight"></a>

### highlight
Applies a special shinning shader to the handle to illustrate interaction with it.


<a name="SphericalRotationHandle+unhighlight"></a>

### unhighlight
Removes the shining shader from the handle.


<a name="SphericalRotationHandle+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| param | <code>Parameter</code> |  | The video param. |
| track | <code>boolean</code> | <code>true</code> | The track param. |

<a name="SphericalRotationHandle+getTargetParam"></a>

### getTargetParam
Returns target's global xfo parameter.


**Returns**: <code>Parameter</code> - - returns handle's target global Xfo.  
<a name="SphericalRotationHandle+handlePointerDown"></a>

### handlePointerDown
Handles mouse down interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="SphericalRotationHandle+handlePointerMove"></a>

### handlePointerMove
Handles mouse move interaction with the handle.


**Returns**: <code>boolean</code> - - The return value  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param |

<a name="SphericalRotationHandle+handlePointerUp"></a>

### handlePointerUp
Handles mouse up interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="SphericalRotationHandle+onDragStart"></a>

### onDragStart
Handles the initially drag of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="SphericalRotationHandle+onDrag"></a>

### onDrag
Handles drag action of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="SphericalRotationHandle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

