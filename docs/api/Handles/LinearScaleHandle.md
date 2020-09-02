<a name="LinearScaleHandle"></a>

### LinearScaleHandle 
Class representing a linear scale scene widget.


**Extends**: <code>[BaseLinearMovementHandle](api/Handles/BaseLinearMovementHandle.md)</code>  

* [LinearScaleHandle ⇐ <code>BaseLinearMovementHandle</code>](#LinearScaleHandle)
    * [new LinearScaleHandle(name, length, thickness, color)](#new-LinearScaleHandle)
    * [highlight()](#highlight)
    * [unhighlight()](#unhighlight)
    * [setTargetParam(param, track)](#setTargetParam)
    * [getTargetParam() ⇒ <code>Parameter</code>](#getTargetParam)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)

<a name="new_LinearScaleHandle_new"></a>

### new LinearScaleHandle
Create a linear scale scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |
| length | <code>number</code> | The length value. |
| thickness | <code>number</code> | The thickness value. |
| color | <code>Color</code> | The color value. |

<a name="LinearScaleHandle+highlight"></a>

### highlight
Applies a special shinning shader to the handle to illustrate interaction with it.


<a name="LinearScaleHandle+unhighlight"></a>

### unhighlight
Removes the shining shader from the handle.


<a name="LinearScaleHandle+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| param | <code>Parameter</code> |  | The video param. |
| track | <code>boolean</code> | <code>true</code> | The track param. |

<a name="LinearScaleHandle+getTargetParam"></a>

### getTargetParam
Returns target's global xfo parameter.


**Returns**: <code>Parameter</code> - - returns handle's target global Xfo.  
<a name="LinearScaleHandle+onDragStart"></a>

### onDragStart
Handles the initially drag of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="LinearScaleHandle+onDrag"></a>

### onDrag
Handles drag action of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="LinearScaleHandle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

