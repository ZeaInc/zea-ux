<a name="Handle"></a>

### Handle 
A Handle is a UI widget that lives in the scene.
Much like a slider, it translates a series of mouse events into a higher level interaction.


**Extends**: <code>TreeItem</code>  

* [Handle ⇐ <code>TreeItem</code>](#Handle)
    * [new Handle(name)](#new-Handle)
    * [highlight()](#highlight)
    * [unhighlight()](#unhighlight)
    * [getManipulationPlane() ⇒ <code>Ray</code>](#getManipulationPlane)
    * [onMouseEnter(event)](#onMouseEnter)
    * [onMouseLeave(event)](#onMouseLeave)
    * [onMouseDown(event)](#onMouseDown)
    * [onMouseMove(event)](#onMouseMove)
    * [onMouseUp(event)](#onMouseUp)
    * [onWheel(event)](#onWheel)
    * [handleMouseDown(event) ⇒ <code>boolean</code>](#handleMouseDown)
    * [handleMouseMove(event) ⇒ <code>boolean</code>](#handleMouseMove)
    * [handleMouseUp(event) ⇒ <code>boolean</code>](#handleMouseUp)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)
    * [onVRPoseChanged(event) ⇒ <code>boolean</code>](#onVRPoseChanged)
    * [onVRControllerButtonUp(event) ⇒ <code>boolean</code>](#onVRControllerButtonUp)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)

<a name="new_Handle_new"></a>

### new Handle
Creates an instance of Handle.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |

<a name="Handle+highlight"></a>

### highlight
Applies a special shinning shader to the handle to illustrate interaction with it.


<a name="Handle+unhighlight"></a>

### unhighlight
Removes the shining shader from the handle.


<a name="Handle+getManipulationPlane"></a>

### getManipulationPlane
Returns the manipulation plane of the handle, denoting a start and a direction.


**Returns**: <code>Ray</code> - The return value.  
<a name="Handle+onMouseEnter"></a>

### onMouseEnter
Event fired when a pointing device is initially moved within the space of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="Handle+onMouseLeave"></a>

### onMouseLeave
Event fired when a pointing device moves outside of the space of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="Handle+onMouseDown"></a>

### onMouseDown
Event fired when a pointing device button is pressed while the pointer is over the handle element.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="Handle+onMouseMove"></a>

### onMouseMove
Event fired when a pointing device is moved while the cursor's hotspot is over the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="Handle+onMouseUp"></a>

### onMouseUp
Event fired when a pointing device button is released while the pointer is over the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="Handle+onWheel"></a>

### onWheel
Event fired when the user rotates the pointing device wheel over the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="Handle+handleMouseDown"></a>

### handleMouseDown
Handles mouse down interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="Handle+handleMouseMove"></a>

### handleMouseMove
Handles mouse move interaction with the handle.


**Returns**: <code>boolean</code> - - The return value  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param |

<a name="Handle+handleMouseUp"></a>

### handleMouseUp
Handles mouse up interaction with the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="Handle+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed over the handle.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="Handle+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="Handle+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
Event fired when a VR controller button is released over the handle.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="Handle+onDragStart"></a>

### onDragStart
Handles the initially drag of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="Handle+onDrag"></a>

### onDrag
Handles drag action of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="Handle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

