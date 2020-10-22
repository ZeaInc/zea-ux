<a name="LinearMovementHandle"></a>

### LinearMovementHandle 
Class representing a linear movement scene widget.


**Extends**: <code>[BaseLinearMovementHandle](api/Handles/BaseLinearMovementHandle.md)</code>  

* [LinearMovementHandle ⇐ <code>BaseLinearMovementHandle</code>](#LinearMovementHandle)
    * [new LinearMovementHandle(name, length, thickness, color)](#new-LinearMovementHandle)
    * [highlight()](#highlight)
    * [unhighlight()](#unhighlight)
    * [setTargetParam(param, track)](#setTargetParam)
    * [getTargetParam() ⇒ <code>Parameter</code>](#getTargetParam)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)

<a name="new_LinearMovementHandle_new"></a>

### new LinearMovementHandle
Create a linear movement scene widget.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | The name value. |
| length | <code>number</code> | <code>0.1</code> | The length value. |
| thickness | <code>number</code> | <code>0.003</code> | The thickness value. |
| color | <code>Color</code> |  | The color value. |

<a name="LinearMovementHandle+highlight"></a>

### highlight
Applies a special shinning shader to the handle to illustrate interaction with it.


<a name="LinearMovementHandle+unhighlight"></a>

### unhighlight
Removes the shining shader from the handle.


<a name="LinearMovementHandle+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| param | <code>Parameter</code> |  | The video param. |
| track | <code>boolean</code> | <code>true</code> | The track param. |

<a name="LinearMovementHandle+getTargetParam"></a>

### getTargetParam
Returns target's global xfo parameter.


**Returns**: <code>Parameter</code> - - returns handle's target global Xfo.  
<a name="LinearMovementHandle+onDragStart"></a>

### onDragStart
Handles the initially drag of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="LinearMovementHandle+onDrag"></a>

### onDrag
Handles drag action of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="LinearMovementHandle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

