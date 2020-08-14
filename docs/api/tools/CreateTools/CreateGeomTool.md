<a name="CreateGeomTool"></a>

### CreateGeomTool 
Base class for creating geometry tools.


**Extends**: <code>BaseCreateTool</code>  

* [CreateGeomTool ⇐ <code>BaseCreateTool</code>](#CreateGeomTool)
    * [new CreateGeomTool(appData)](#new-CreateGeomTool)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [screenPosToXfo(screenPos, viewport) ⇒ <code>Xfo</code>](#screenPosToXfo)
    * [createStart(xfo, parentItem)](#createStart)
    * [createPoint(pt)](#createPoint)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)
    * [onMouseDown(event) ⇒ <code>boolean</code>](#onMouseDown)
    * [onMouseMove(event) ⇒ <code>boolean</code>](#onMouseMove)
    * [onMouseUp(event) ⇒ <code>boolean</code>](#onMouseUp)
    * [onWheel(event)](#onWheel)
    * [onKeyPressed(key, event)](#onKeyPressed)
    * [onKeyDown(key, event)](#onKeyDown)
    * [onKeyUp(key, event)](#onKeyUp)
    * [onTouchStart(event)](#onTouchStart)
    * [onTouchMove(event)](#onTouchMove)
    * [onTouchEnd(event)](#onTouchEnd)
    * [onTouchCancel(event)](#onTouchCancel)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)
    * [onVRPoseChanged(event) ⇒ <code>boolean</code>](#onVRPoseChanged)
    * [onVRControllerButtonUp(event) ⇒ <code>boolean</code>](#onVRControllerButtonUp)

<a name="new_CreateGeomTool_new"></a>

### new CreateGeomTool
Create a create geom tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="CreateGeomTool+activateTool"></a>

### activateTool
The activateTool method.


<a name="CreateGeomTool+deactivateTool"></a>

### deactivateTool
The deactivateTool method.


<a name="CreateGeomTool+screenPosToXfo"></a>

### screenPosToXfo
Transforms the screen position in the viewport to an Xfo object.


**Returns**: <code>Xfo</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| screenPos | <code>Vec2</code> | The screenPos param. |
| viewport | <code>GLViewport</code> | The viewport param. |

<a name="CreateGeomTool+createStart"></a>

### createStart
Starts the creation of the geometry.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The xfo param. |
| parentItem | <code>TreeItem</code> | The parentItem param. |

<a name="CreateGeomTool+createPoint"></a>

### createPoint
The createPoint method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateGeomTool+createMove"></a>

### createMove
The createMove method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateGeomTool+createRelease"></a>

### createRelease
The createRelease method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>Vec3</code> | The pt param. |

<a name="CreateGeomTool+onMouseDown"></a>

### onMouseDown
Event fired when a pointing device button is pressed over the viewport while the tool is activated.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="CreateGeomTool+onMouseMove"></a>

### onMouseMove
Event fired when a pointing device is moved while the cursor's hotspot is inside the viewport, while tool is activated.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="CreateGeomTool+onMouseUp"></a>

### onMouseUp
Event fired when a pointing device button is released while the pointer is over the viewport, while the tool is activated.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="CreateGeomTool+onWheel"></a>

### onWheel
Event fired when the user rotates the pointing device wheel, while the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="CreateGeomTool+onKeyPressed"></a>

### onKeyPressed
Event fired when the user presses a key on the keyboard, while the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key param. |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="CreateGeomTool+onKeyDown"></a>

### onKeyDown
Event fired when the user presses down a key on the keyboard, while the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key param. |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="CreateGeomTool+onKeyUp"></a>

### onKeyUp
Event fired when the user releases a key on the keyboard.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key param. |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="CreateGeomTool+onTouchStart"></a>

### onTouchStart
Event fired when one or more touch points are placed on the touch surface inside the viewport, when the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="CreateGeomTool+onTouchMove"></a>

### onTouchMove
Event fired when the one or more touch points are moved along the touch surface inside the viewport, when the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="CreateGeomTool+onTouchEnd"></a>

### onTouchEnd
Event fired when one or more touch points are removed from the touch surface inside the viewport, when the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="CreateGeomTool+onTouchCancel"></a>

### onTouchCancel
Event fired when one or more touch points have been disrupted in an implementation-specific manner inside the viewport, when the tool is activated.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="CreateGeomTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed inside the viewport, when the tool is activated.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="CreateGeomTool+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="CreateGeomTool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
Event fired when a VR controller button is released inside the viewport, when the tool is activated.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

