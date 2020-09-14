<a name="AxialRotationHandle"></a>

### AxialRotationHandle 
Class representing an axial rotation scene widget.


**Extends**: <code>[BaseAxialRotationHandle](api/Handles/BaseAxialRotationHandle.md)</code>  

* [AxialRotationHandle ⇐ <code>BaseAxialRotationHandle</code>](#AxialRotationHandle)
    * [new AxialRotationHandle(name, radius, thickness, color)](#new-AxialRotationHandle)
    * [highlight()](#highlight)
    * [unhighlight()](#unhighlight)
    * [getBaseXfo() ⇒ <code>Xfo</code>](#getBaseXfo)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)

<a name="new_AxialRotationHandle_new"></a>

### new AxialRotationHandle
Create an axial rotation scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |
| radius | <code>number</code> | The radius value. |
| thickness | <code>number</code> | The thickness value. |
| color | <code>Color</code> | The color value. |

<a name="AxialRotationHandle+highlight"></a>

### highlight
Applies a special shinning shader to the handle to illustrate interaction with it.


<a name="AxialRotationHandle+unhighlight"></a>

### unhighlight
Removes the shining shader from the handle.


<a name="AxialRotationHandle+getBaseXfo"></a>

### getBaseXfo
Returns handle's global Xfo


**Returns**: <code>Xfo</code> - - The Xfo value  
<a name="AxialRotationHandle+onDragStart"></a>

### onDragStart
Handles the initially drag interaction of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="AxialRotationHandle+onDrag"></a>

### onDrag
Handles drag interaction of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="AxialRotationHandle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging interaction with the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

