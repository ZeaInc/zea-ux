<a name="BaseTool"></a>

### BaseTool 
Abstract class representing a tool with methods representing mouse, keyboard, touch and VR events.

**Events**
* **installChanged:** Triggered when the tool is installed or uninstalled.
* **activatedChanged:** Triggered when a tool is activated or deactivated.


**Extends**: <code>ParameterOwner</code>  

* [BaseTool ⇐ <code>ParameterOwner</code>](#BaseTool)
    * [new BaseTool(appData)](#new-BaseTool)
    * [getName() ⇒ <code>string</code>](#getName)
    * [isPrimaryTool() ⇒ <code>boolean</code>](#isPrimaryTool)
    * [installed() ⇒ <code>boolean</code>](#installed)
    * [install(index)](#install)
    * [uninstall()](#uninstall)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [onMouseDown(event)](#onMouseDown)
    * [onMouseMove(event)](#onMouseMove)
    * [onMouseUp(event)](#onMouseUp)
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

<a name="new_BaseTool_new"></a>

### new BaseTool
Creates an instance of BaseTool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="BaseTool+getName"></a>

### getName
Returns the name of the tool class.


**Returns**: <code>string</code> - The return value.  
<a name="BaseTool+isPrimaryTool"></a>

### isPrimaryTool
Checks if the tool is a primary tool or not.


**Returns**: <code>boolean</code> - - The return value.  
<a name="BaseTool+installed"></a>

### installed
Checks whether the tool is already installed or not.


**Returns**: <code>boolean</code> - The return value.  
<a name="BaseTool+install"></a>

### install
Installs the tool.



| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | The index param. |

<a name="BaseTool+uninstall"></a>

### uninstall
Uninstalls tool.


<a name="BaseTool+activateTool"></a>

### activateTool
Enables tools usage.


<a name="BaseTool+deactivateTool"></a>

### deactivateTool
Disables tool usage.


<a name="BaseTool+onMouseDown"></a>

### onMouseDown
Event fired when a pointing device button is pressed while the pointer is over the tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="BaseTool+onMouseMove"></a>

### onMouseMove
Event fired when a pointing device is moved while the cursor's hotspot is inside it.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="BaseTool+onMouseUp"></a>

### onMouseUp
Event fired when a pointing device button is released while the pointer is over the tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="BaseTool+onDoubleClick"></a>

### onDoubleClick
Event fired when a pointing device button is double clicked on the tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="BaseTool+onWheel"></a>

### onWheel
Event fired when the user rotates the pointing device wheel.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="BaseTool+onKeyPressed"></a>

### onKeyPressed
Event fired when the user presses a key on the keyboard.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key param. |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="BaseTool+onKeyDown"></a>

### onKeyDown
Event fired when the user presses down a key on the keyboard.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key param. |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="BaseTool+onKeyUp"></a>

### onKeyUp
Event fired when the user releases a key on the keyboard.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key param. |
| event | <code>KeyboardEvent</code> | The event param. |

<a name="BaseTool+onTouchStart"></a>

### onTouchStart
Event fired when one ro more touch points are placed on the touch surface over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="BaseTool+onTouchMove"></a>

### onTouchMove
Event fired when the one or more touch points are moved along the touch surface over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="BaseTool+onTouchEnd"></a>

### onTouchEnd
Event fired when one or more touch points are removed from the touch surface over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="BaseTool+onTouchCancel"></a>

### onTouchCancel
Event fired when one or more touch points have been disrupted in an implementation-specific manner.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="BaseTool+onDoubleTap"></a>

### onDoubleTap
Event fired when two continuos touch point are placed on the touch surface over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>TouchEvent</code> | The event param. |

<a name="BaseTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
Event fired when a VR controller button is pressed over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="BaseTool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
Event fired when a VR controller button is released over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="BaseTool+onVRControllerDoubleClicked"></a>

### onVRControllerDoubleClicked
Event fired when a VR controller button is pressed twice over a tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

<a name="BaseTool+onVRPoseChanged"></a>

### onVRPoseChanged
Event fired when a VR controller...



| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | The event param. |

