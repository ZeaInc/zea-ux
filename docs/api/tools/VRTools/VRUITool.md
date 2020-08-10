<a name="VRUITool"></a>

### VRUITool 
Class representing a VR UI tool.


**Extends**: <code>BaseTool</code>  

* [VRUITool ⇐ <code>BaseTool</code>](#VRUITool)
    * [new VRUITool(appData)](#new-VRUITool)
    * [getName() ⇒ <code>any</code>](#getName)
    * [setUIControllers(openUITool, uiController, pointerController, headXfo)](#setUIControllers)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [setPointerLength(length)](#setPointerLength)
    * [calcUIIntersection() ⇒ <code>any</code>](#calcUIIntersection)
    * [sendEventToUI(eventName, args) ⇒ <code>any</code>](#sendEventToUI)
    * [onVRControllerButtonDown(event) ⇒ <code>any</code>](#onVRControllerButtonDown)
    * [onVRControllerButtonUp(event) ⇒ <code>any</code>](#onVRControllerButtonUp)
    * [onVRPoseChanged(event) ⇒ <code>any</code>](#onVRPoseChanged)

<a name="new_VRUITool_new"></a>

### new VRUITool
Create a VR UI tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="VRUITool+getName"></a>

### getName
The getName method.


**Returns**: <code>any</code> - The return value.  
<a name="VRUITool+setUIControllers"></a>

### setUIControllers
The setUIControllers method.



| Param | Type | Description |
| --- | --- | --- |
| openUITool | <code>any</code> | The openUITool param. |
| uiController | <code>any</code> | The uiController param. |
| pointerController | <code>any</code> | The pointerController param. |
| headXfo | <code>any</code> | The headXfo param. |

<a name="VRUITool+activateTool"></a>

### activateTool
The activateTool method.


<a name="VRUITool+deactivateTool"></a>

### deactivateTool
The deactivateTool method.


<a name="VRUITool+setPointerLength"></a>

### setPointerLength
The setPointerLength method.



| Param | Type | Description |
| --- | --- | --- |
| length | <code>any</code> | The length param. |

<a name="VRUITool+calcUIIntersection"></a>

### calcUIIntersection
The calcUIIntersection method.


**Returns**: <code>any</code> - The return value.  
<a name="VRUITool+sendEventToUI"></a>

### sendEventToUI
The sendEventToUI method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>any</code> | The eventName param. |
| args | <code>any</code> | The args param. |

<a name="VRUITool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
The onVRControllerButtonDown method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="VRUITool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
The onVRControllerButtonUp method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="VRUITool+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

