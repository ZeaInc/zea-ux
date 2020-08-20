<a name="HandleTool"></a>

### HandleTool 
Class representing a Handle tool.


**Extends**: <code>BaseTool</code>  

* [HandleTool ⇐ <code>BaseTool</code>](#HandleTool)
    * [new HandleTool(appData)](#new-HandleTool)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [onMouseDown(event) ⇒ <code>boolean</code>](#onMouseDown)
    * [onMouseMove(event) ⇒ <code>boolean</code>](#onMouseMove)
    * [onMouseUp(event) ⇒ <code>boolean</code>](#onMouseUp)
    * [onWheel(event)](#onWheel)
    * [onVRControllerButtonDown(event)](#onVRControllerButtonDown)
    * [onVRPoseChanged(event)](#onVRPoseChanged)
    * [onVRControllerButtonUp(event)](#onVRControllerButtonUp)

<a name="new_HandleTool_new"></a>

### new HandleTool
Creates an instance of HandleTool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="HandleTool+activateTool"></a>

### activateTool
Activates handle tool, which adds icons to VR Controllers.


<a name="HandleTool+deactivateTool"></a>

### deactivateTool
Deactivates handle tool, which removes icons from controllers.


<a name="HandleTool+onMouseDown"></a>

### onMouseDown
Event fired when a pointing device button is pressed while the pointer is over the tool.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="HandleTool+onMouseMove"></a>

### onMouseMove
Event fired when a pointing device is moved while the cursor's hotspot is inside it.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="HandleTool+onMouseUp"></a>

### onMouseUp
Event fired when a pointing device button is released while the pointer is over the tool.


**Returns**: <code>boolean</code> - - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="HandleTool+onWheel"></a>

### onWheel
Event fired when the user rotates the pointing device wheel.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="HandleTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="HandleTool+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="HandleTool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
Event fired when a VR controller button is released over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

