<a name="ToolManager"></a>

### ToolManager
Class representing a tool manager.



* [ToolManager](#ToolManager)
    * [new ToolManager(appData)](#new-ToolManager)
    * [insertTool(tool, index)](#insertTool)
    * [insertToolBefore(tool, beforeTool) ⇒ <code>any</code>](#insertToolBefore)
    * [insertToolAfter(tool, afterTool) ⇒ <code>any</code>](#insertToolAfter)
    * [getToolIndex(tool) ⇒ <code>any</code>](#getToolIndex)
    * [removeTool(index)](#removeTool)
    * [removeToolByHandle(tool)](#removeToolByHandle)
    * [pushTool(tool) ⇒ <code>any</code>](#pushTool)
    * [popTool()](#popTool)
    * [replaceCurrentTool(tool)](#replaceCurrentTool)
    * [currTool() ⇒ <code>any</code>](#currTool)
    * [currToolName() ⇒ <code>any</code>](#currToolName)
    * [bind(renderer)](#bind)
    * [onMouseDown(event)](#onMouseDown)
    * [onMouseMove(event)](#onMouseMove)
    * [onMouseUp(event)](#onMouseUp)
    * [onMouseLeave(event)](#onMouseLeave)
    * [onDoubleClick(event)](#onDoubleClick)
    * [onWheel(event)](#onWheel)
    * [onKeyPressed(key, event)](#onKeyPressed)
    * [onKeyDown(key, event)](#onKeyDown)
    * [onKeyUp(key, event)](#onKeyUp)
    * [onTouchStart(event)](#onTouchStart)
    * [onTouchMove(event)](#onTouchMove)
    * [onTouchEnd(event)](#onTouchEnd)
    * [onTouchCancel(event)](#onTouchCancel)
    * [onDoubleTap(event)](#onDoubleTap)
    * [onVRControllerButtonDown(event)](#onVRControllerButtonDown)
    * [onVRControllerButtonUp(event)](#onVRControllerButtonUp)
    * [onVRControllerDoubleClicked(event)](#onVRControllerDoubleClicked)
    * [onVRPoseChanged(event)](#onVRPoseChanged)
    * [destroy()](#destroy)

<a name="new_ToolManager_new"></a>

### new ToolManager
Create a tool manager.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="ToolManager+insertTool"></a>

### insertTool
The insertTool method.



| Param | Type | Description |
| --- | --- | --- |
| tool | <code>any</code> | The tool param. |
| index | <code>any</code> | The index param. |

<a name="ToolManager+insertToolBefore"></a>

### insertToolBefore
The insertToolBefore method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| tool | <code>any</code> | The tool param. |
| beforeTool | <code>any</code> | The beforeTool param. |

<a name="ToolManager+insertToolAfter"></a>

### insertToolAfter
The insertToolAfter method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| tool | <code>any</code> | The tool param. |
| afterTool | <code>any</code> | The afterTool param. |

<a name="ToolManager+getToolIndex"></a>

### getToolIndex
The getToolIndex method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| tool | <code>any</code> | The tool param. |

<a name="ToolManager+removeTool"></a>

### removeTool
The removeTool method.



| Param | Type | Description |
| --- | --- | --- |
| index | <code>any</code> | The index param. |

<a name="ToolManager+removeToolByHandle"></a>

### removeToolByHandle
The removeToolByHandle method.



| Param | Type | Description |
| --- | --- | --- |
| tool | <code>any</code> | The tool param. |

<a name="ToolManager+pushTool"></a>

### pushTool
The pushTool method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| tool | <code>any</code> | The tool param. |

<a name="ToolManager+popTool"></a>

### popTool
The popTool method.


<a name="ToolManager+replaceCurrentTool"></a>

### replaceCurrentTool
The replaceCurrentTool method.



| Param | Type | Description |
| --- | --- | --- |
| tool | <code>any</code> | The tool param. |

<a name="ToolManager+currTool"></a>

### currTool
The currTool method.


**Returns**: <code>any</code> - The return value.  
<a name="ToolManager+currToolName"></a>

### currToolName
The currToolName method.


**Returns**: <code>any</code> - The return value.  
<a name="ToolManager+bind"></a>

### bind
The bind method.



| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>any</code> | The renderer param. |

<a name="ToolManager+onMouseDown"></a>

### onMouseDown
The onMouseDown method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onMouseMove"></a>

### onMouseMove
The onMouseMove method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onMouseUp"></a>

### onMouseUp
The onMouseUp method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onMouseLeave"></a>

### onMouseLeave
The onMouseLeave method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onDoubleClick"></a>

### onDoubleClick
The onDoubleClick method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onWheel"></a>

### onWheel
The onWheel method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onKeyPressed"></a>

### onKeyPressed
The onKeyPressed method.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The event param. |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onKeyDown"></a>

### onKeyDown
The onKeyDown method.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The event param. |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onKeyUp"></a>

### onKeyUp
The onKeyUp method.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The event param. |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onTouchStart"></a>

### onTouchStart
The onTouchStart method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onTouchMove"></a>

### onTouchMove
The onTouchMove method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onTouchEnd"></a>

### onTouchEnd
The onTouchEnd method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onTouchCancel"></a>

### onTouchCancel
The onTouchCancel method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onDoubleTap"></a>

### onDoubleTap
The onDoubleTap method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
The onVRControllerButtonDown method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
The onVRControllerButtonUp method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onVRControllerDoubleClicked"></a>

### onVRControllerDoubleClicked
The onVRControllerDoubleClicked method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="ToolManager+destroy"></a>

### destroy
The destroy method.


