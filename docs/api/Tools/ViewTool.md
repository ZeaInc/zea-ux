<a name="ViewTool"></a>

### ViewTool 
Class representing a view tool


**Extends**: <code>[BaseTool](api/Tools/BaseTool.md)</code>  

* [ViewTool ⇐ <code>BaseTool</code>](#ViewTool)
    * [new ViewTool(appData, [manipulationModel])](#new-ViewTool)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [setDefaultMode(mode)](#setDefaultMode)
    * [look(dragVec, viewport)](#look)
    * [orbit(dragVec, viewport)](#orbit)
    * [pan(dragVec, viewport)](#pan)
    * [dolly(dragVec, viewport)](#dolly)
    * [panAndZoom(panDelta, dragDist, viewport)](#panAndZoom)
    * [initDrag(viewport)](#initDrag)
    * [aimFocus(camera, pos)](#aimFocus)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event) ⇒ <code>boolean</code>](#onDragEnd)
    * [onMouseDown(event) ⇒ <code>boolean</code>](#onMouseDown)
    * [onMouseUp(event) ⇒ <code>boolean</code>](#onMouseUp)
    * [onMouseMove(event) ⇒ <code>boolean</code>](#onMouseMove)
    * [onDoubleClick(event)](#onDoubleClick)
    * [onWheel(event) ⇒ <code>boolean</code>](#onWheel)
    * [onTouchStart(event) ⇒ <code>boolean</code>](#onTouchStart)
    * [onTouchMove(event) ⇒ <code>boolean</code>](#onTouchMove)
    * [onTouchEnd(event) ⇒ <code>boolean</code>](#onTouchEnd)
    * [onTouchCancel(event) ⇒ <code>boolean</code>](#onTouchCancel)
    * [onDoubleTap(event)](#onDoubleTap)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)
    * [onVRControllerButtonUp(event) ⇒ <code>boolean</code>](#onVRControllerButtonUp)
    * [onVRControllerDoubleClicked(event)](#onVRControllerDoubleClicked)
    * [onVRPoseChanged(event) ⇒ <code>boolean</code>](#onVRPoseChanged)

<a name="new_ViewTool_new"></a>

### new ViewTool
Creates an instance of ViewTool.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| appData | <code>object</code> |  | The appData value. |
| [manipulationModel] | <code>number</code> | <code>VIEW_TOOL_MODELS.VIEWER</code> | The manipulationModel value |

<a name="ViewTool+activateTool"></a>

### activateTool
The activateTool method.


<a name="ViewTool+deactivateTool"></a>

### deactivateTool
The deactivateTool method.


<a name="ViewTool+setDefaultMode"></a>

### setDefaultMode
The setDefaultMode method.



| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | The mode param. |

<a name="ViewTool+look"></a>

### look
The look method.



| Param | Type | Description |
| --- | --- | --- |
| dragVec | <code>Vec2</code> | The dragVec param. |
| viewport | <code>GLViewport</code> | The viewport param. |

<a name="ViewTool+orbit"></a>

### orbit
The orbit method.



| Param | Type | Description |
| --- | --- | --- |
| dragVec | <code>Vec2</code> | The dragVec param. |
| viewport | <code>GLViewport</code> | The viewport param. |

<a name="ViewTool+pan"></a>

### pan
The pan method.



| Param | Type | Description |
| --- | --- | --- |
| dragVec | <code>Vec2</code> | The dragVec param. |
| viewport | <code>GLViewport</code> | The viewport param. |

<a name="ViewTool+dolly"></a>

### dolly
The dolly method.



| Param | Type | Description |
| --- | --- | --- |
| dragVec | <code>Vec2</code> | The dragVec param. |
| viewport | <code>GLViewport</code> | The viewport param. |

<a name="ViewTool+panAndZoom"></a>

### panAndZoom
The panAndZoom method.



| Param | Type | Description |
| --- | --- | --- |
| panDelta | <code>Vec2</code> | The panDelta param. |
| dragDist | <code>number</code> | The dragDist param. |
| viewport | <code>GLViewport</code> | The viewport param. |

<a name="ViewTool+initDrag"></a>

### initDrag
The initDrag method.



| Param | Type | Description |
| --- | --- | --- |
| viewport | <code>GLViewport</code> | The viewport param. |

<a name="ViewTool+aimFocus"></a>

### aimFocus
The aimFocus method.



| Param | Type | Description |
| --- | --- | --- |
| camera | <code>Camera</code> | The camera param. |
| pos | <code>Vec3</code> | The pos param. |

<a name="ViewTool+onDragStart"></a>

### onDragStart
The onDragStart method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ViewTool+onDrag"></a>

### onDrag
The onDrag method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ViewTool+onDragEnd"></a>

### onDragEnd
The onDragEnd method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ViewTool+onMouseDown"></a>

### onMouseDown
The onMouseDown method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ViewTool+onMouseUp"></a>

### onMouseUp
The onMouseUp method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ViewTool+onMouseMove"></a>

### onMouseMove
The onMouseMove method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ViewTool+onDoubleClick"></a>

### onDoubleClick
The onDoubleClick method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ViewTool+onWheel"></a>

### onWheel
The onWheel method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="ViewTool+onTouchStart"></a>

### onTouchStart
The onTouchStart method.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="ViewTool+onTouchMove"></a>

### onTouchMove
The onTouchMove method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="ViewTool+onTouchEnd"></a>

### onTouchEnd
The onTouchEnd method.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="ViewTool+onTouchCancel"></a>

### onTouchCancel
The onTouchCancel method.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="ViewTool+onDoubleTap"></a>

### onDoubleTap
The onDoubleTap method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="ViewTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
The onVRControllerButtonDown method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="ViewTool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
The onVRControllerButtonUp method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="ViewTool+onVRControllerDoubleClicked"></a>

### onVRControllerDoubleClicked
The onVRControllerDoubleClicked method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="ViewTool+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

