<a name="SelectionTool"></a>

### SelectionTool 
Class representing a selection tool.


**Extends**: <code>BaseTool</code>  

* [SelectionTool ⇐ <code>BaseTool</code>](#SelectionTool)
    * [new SelectionTool(appData)](#new-SelectionTool)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [setSelectionManager()](#setSelectionManager)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [onPointerDown(event) ⇒ <code>boolean</code>](#onPointerDown)
    * [onPointerMove(event) ⇒ <code>boolean</code>](#onPointerMove)
    * [onPointerUp(event) ⇒ <code>boolean</code>](#onPointerUp)
    * [onVRControllerButtonDown(event) ⇒ <code>boolean</code>](#onVRControllerButtonDown)

<a name="new_SelectionTool_new"></a>

### new SelectionTool
Creates an instance of SelectionTool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value |

<a name="SelectionTool+activateTool"></a>

### activateTool
activate this tool


<a name="SelectionTool+deactivateTool"></a>

### deactivateTool
Disables tool usage.


<a name="SelectionTool+setSelectionManager"></a>

### setSelectionManager
Activates selection tool.


<a name="SelectionTool+activateTool"></a>

### activateTool
Activates selection tool.


<a name="SelectionTool+deactivateTool"></a>

### deactivateTool
Deactivates the selection tool.


<a name="SelectionTool+onPointerDown"></a>

### onPointerDown
Event fired when a pointing device button is pressed while the pointer is over the tool.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> \| <code>ZeaTouchEvent</code> \| <code>object</code> | The event param. |

<a name="SelectionTool+onPointerMove"></a>

### onPointerMove
Event fired when a pointing device is moved while the cursor's hotspot is inside it.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> \| <code>ZeaTouchEvent</code> \| <code>object</code> | The event param. |

<a name="SelectionTool+onPointerUp"></a>

### onPointerUp
Event fired when a pointing device button is released while the pointer is over the tool.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> \| <code>ZeaTouchEvent</code> \| <code>object</code> | The event param. |

<a name="SelectionTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed over a tool.


**Returns**: <code>boolean</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

