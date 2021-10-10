<a name="VRUITool"></a>

### VRUITool 
Class representing a VR UI tool.


**Extends**: <code>BaseTool</code>  

* [VRUITool ⇐ <code>BaseTool</code>](#VRUITool)
    * [new VRUITool(appData, vrUIDOMElement)](#new-VRUITool)
    * [getName() ⇒ <code>string</code>](#getName)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [displayUI(uiController, pointerController, headXfo)](#displayUI)
    * [closeUI()](#closeUI)
    * [setPointerLength(length)](#setPointerLength)
    * [calcUIIntersection() ⇒ <code>object</code> \| <code>undefined</code>](#calcUIIntersection)
    * [sendEventToUI(eventName, args) ⇒ <code>any</code>](#sendEventToUI)
    * [onPointerDown(event)](#onPointerDown)
    * [onPointerUp(event)](#onPointerUp)
    * [onPointerMove(event)](#onPointerMove)

<a name="new_VRUITool_new"></a>

### new VRUITool
Create a VR UI tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |
| vrUIDOMElement | <code>HTMLElement</code> | The  dom element we will use as the VR UI |

<a name="VRUITool+getName"></a>

### getName
The getName method.


**Returns**: <code>string</code> - The return value.  
<a name="VRUITool+activateTool"></a>

### activateTool
The activateTool method.


<a name="VRUITool+deactivateTool"></a>

### deactivateTool
The deactivateTool method.


<a name="VRUITool+displayUI"></a>

### displayUI
The displayUI method.



| Param | Type | Description |
| --- | --- | --- |
| uiController | <code>VRController</code> | The uiController param. |
| pointerController | <code>VRController</code> | The pointerController param. |
| headXfo | <code>Xfo</code> | The headXfo param. |

<a name="VRUITool+closeUI"></a>

### closeUI
The closeUI method.


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

<a name="VRUITool+onPointerDown"></a>

### onPointerDown
The onVRControllerButtonDown method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="VRUITool+onPointerUp"></a>

### onPointerUp
The onVRControllerButtonUp method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="VRUITool+onPointerMove"></a>

### onPointerMove
The onVRPoseChanged method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

