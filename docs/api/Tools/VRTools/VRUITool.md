<a name="VRUITool"></a>

### VRUITool 
Class representing a VR UI tool.


**Extends**: <code>[BaseTool](api/Tools/BaseTool.md)</code>  

* [VRUITool ⇐ <code>BaseTool</code>](#VRUITool)
    * [new VRUITool(appData)](#new-VRUITool)
    * [getName() ⇒ <code>string</code>](#getName)
    * [setUIControllers(openUITool, uiController, pointerController, headXfo)](#setUIControllers)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [setPointerLength(length)](#setPointerLength)
    * [calcUIIntersection() ⇒ <code>object</code> \| <code>undefined</code>](#calcUIIntersection)
    * [sendEventToUI(eventName, args) ⇒ <code>any</code>](#sendEventToUI)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)
    * [onVRControllerButtonUp(event) ⇒ <code>boolean</code>](#onVRControllerButtonUp)
    * [onVRPoseChanged(event) ⇒ <code>boolean</code>](#onVRPoseChanged)

<a name="new_VRUITool_new"></a>

### new VRUITool
Create a VR UI tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="VRUITool+getName"></a>

### getName
The getName method.


**Returns**: <code>string</code> - The return value.  
<a name="VRUITool+setUIControllers"></a>

### setUIControllers
The setUIControllers method.



| Param | Type | Description |
| --- | --- | --- |
| openUITool | <code>\*</code> | The openUITool param. |
| uiController | <code>\*</code> | The uiController param. |
| pointerController | <code>\*</code> | The pointerController param. |
| headXfo | <code>Xfo</code> | The headXfo param. |

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
| length | <code>number</code> | The length param. |

<a name="VRUITool+calcUIIntersection"></a>

### calcUIIntersection
The calcUIIntersection method.


**Returns**: <code>object</code> \| <code>undefined</code> - The return value.  
<a name="VRUITool+sendEventToUI"></a>

### sendEventToUI
The sendEventToUI method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | The eventName param. |
| args | <code>any</code> | The args param. |

<a name="VRUITool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
The onVRControllerButtonDown method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="VRUITool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
The onVRControllerButtonUp method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="VRUITool+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

