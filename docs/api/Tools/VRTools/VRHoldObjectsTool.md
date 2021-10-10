### Classes

<dl>
<dt><a href="#HoldObjectsChange">HoldObjectsChange</a> ⇐ <code>Change</code></dt>
<dd><p>Class representing a hold objects change.</p>
</dd>
<dt><a href="#VRHoldObjectsTool">VRHoldObjectsTool</a> ⇐ <code>BaseTool</code></dt>
<dd><p>Class representing a VR hold objects tool.</p>
</dd>
</dl>

<a name="HoldObjectsChange"></a>

### HoldObjectsChange 
Class representing a hold objects change.


**Extends**: <code>[Change](api/UndoRedo\Change.md)</code>  

* [HoldObjectsChange ⇐ <code>Change</code>](#HoldObjectsChange)
    * [new HoldObjectsChange(data)](#new-HoldObjectsChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [update(updateData)](#update)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)
    * [updateFromJSON(j)](#updateFromJSON)

<a name="new_HoldObjectsChange_new"></a>

### new HoldObjectsChange
Create a hold objects change.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The data value. |

<a name="HoldObjectsChange+undo"></a>

### undo
The undo method.


<a name="HoldObjectsChange+redo"></a>

### redo
The redo method.


<a name="HoldObjectsChange+update"></a>

### update
The update method.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>object</code> | The updateData param. |

<a name="HoldObjectsChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>object</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The context param. |

<a name="HoldObjectsChange+fromJSON"></a>

### fromJSON
The fromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |
| context | <code>object</code> | The context param. |

<a name="HoldObjectsChange+updateFromJSON"></a>

### updateFromJSON
Updates the state of an existing identified `Parameter` through replication.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>object</code> | The j param. |

<a name="VRHoldObjectsTool"></a>

### VRHoldObjectsTool 
Class representing a VR hold objects tool.


**Extends**: <code>BaseTool</code>  

* [VRHoldObjectsTool ⇐ <code>BaseTool</code>](#VRHoldObjectsTool)
    * [new VRHoldObjectsTool(appData)](#new-VRHoldObjectsTool)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [computeGrabXfo(refs) ⇒ <code>Xfo</code>](#computeGrabXfo)
    * [initAction()](#initAction)
    * [onPointerDown(event)](#onPointerDown)
    * [onPointerUp(event)](#onPointerUp)
    * [onPointerMove(event)](#onPointerMove)
    * [onPointerDoublePress(event)](#onPointerDoublePress)

<a name="new_VRHoldObjectsTool_new"></a>

### new VRHoldObjectsTool
Create a VR hold objects tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>object</code> | The appData value. |

<a name="VRHoldObjectsTool+activateTool"></a>

### activateTool
The activateTool method.


<a name="VRHoldObjectsTool+deactivateTool"></a>

### deactivateTool
The deactivateTool method.


<a name="VRHoldObjectsTool+computeGrabXfo"></a>

### computeGrabXfo
The computeGrabXfo method.


**Returns**: <code>Xfo</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| refs | <code>array</code> | The refs param. |

<a name="VRHoldObjectsTool+initAction"></a>

### initAction
The initAction method.


<a name="VRHoldObjectsTool+onPointerDown"></a>

### onPointerDown
Event fired when a pointing device button is pressed



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="VRHoldObjectsTool+onPointerUp"></a>

### onPointerUp
Event fired when a pointing device button is released while the pointer is over the tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="VRHoldObjectsTool+onPointerMove"></a>

### onPointerMove
Event fired when a pointing device is moved



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

<a name="VRHoldObjectsTool+onPointerDoublePress"></a>

### onPointerDoublePress
Event fired when a pointing device button is double clicked on the tool.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The event param. |

