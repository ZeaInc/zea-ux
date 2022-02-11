<a name="XfoPlanarMovementHandle"></a>

### XfoPlanarMovementHandle 
Class representing a planar movement scene widget.**Parameters*** **Size(`NumberParameter`):** Specifies the size of the plane handle.


**Extends**: <code>[Handle](api/Handles\Handle.md)</code>  

* [XfoPlanarMovementHandle ⇐ <code>Handle</code>](#XfoPlanarMovementHandle)
    * [new XfoPlanarMovementHandle(name, size, offset, color)](#new-XfoPlanarMovementHandle)
    * [highlight()](#highlight)
    * [unhighlight()](#unhighlight)

<a name="new_XfoPlanarMovementHandle_new"></a>

### new XfoPlanarMovementHandle
Create a planar movement scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |
| size | <code>number</code> | The size value. |
| offset | <code>Vec3</code> | The offset value. |
| color | <code>Color</code> | The color value. |

<a name="XfoPlanarMovementHandle+highlight"></a>

### highlight
Applies a special shinning shader to the handle to illustrate interaction with it.


<a name="XfoPlanarMovementHandle+unhighlight"></a>

### unhighlight
Removes the shining shader from the handle.


