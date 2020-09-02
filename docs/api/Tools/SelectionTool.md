<a name="SelectionTool"></a>

### SelectionTool 
Class representing a selection tool.


**Extends**: <code>[BaseTool](api/Tools/BaseTool.md)</code>  

* [SelectionTool ⇐ <code>BaseTool</code>](#SelectionTool)
    * [new SelectionTool(appData)](#new-SelectionTool)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [onMouseDown(event) ⇒ <code>boolean</code>](#onMouseDown)
    * [onMouseMove(event) ⇒ <code>boolean</code>](#onMouseMove)
    * [onMouseUp(event) ⇒ <code>boolean</code>](#onMouseUp)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)

<a name="new_SelectionTool_new"></a>

### new SelectionTool
Creates an instance of SelectionTool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value |

<a name="SelectionTool+activateTool"></a>

### activateTool
Activates selection tool.


<a name="SelectionTool+deactivateTool"></a>

### deactivateTool
Deactivates the selection tool.


<a name="SelectionTool+onMouseDown"></a>

### onMouseDown
Event fired when a pointing device button is pressed while the pointer is over the tool.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="SelectionTool+onMouseMove"></a>

### onMouseMove
Event fired when a pointing device is moved while the cursor's hotspot is inside it.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="SelectionTool+onMouseUp"></a>

### onMouseUp
Event fired when a pointing device button is released while the pointer is over the tool.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="SelectionTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed over a tool.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

