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


**Extends**: <code>Change</code>  

* [HoldObjectsChange ⇐ <code>Change</code>](#HoldObjectsChange)
    * [new HoldObjectsChange(data)](#new-HoldObjectsChange)
    * [undo()](#undo)
    * [redo()](#redo)
    * [update(updateData)](#update)
    * [toJSON(context) ⇒ <code>any</code>](#toJSON)
    * [fromJSON(j, context)](#fromJSON)

<a name="new_HoldObjectsChange_new"></a>

### new HoldObjectsChange
Create a hold objects change.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | The data value. |

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
| updateData | <code>any</code> | The updateData param. |

<a name="HoldObjectsChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>any</code> | The context param. |

<a name="HoldObjectsChange+fromJSON"></a>

### fromJSON
The fromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | The j param. |
| context | <code>any</code> | The context param. |

<a name="VRHoldObjectsTool"></a>

### VRHoldObjectsTool 
Class representing a VR hold objects tool.


**Extends**: <code>BaseTool</code>  

* [VRHoldObjectsTool ⇐ <code>BaseTool</code>](#VRHoldObjectsTool)
    * [new VRHoldObjectsTool(appData)](#new-VRHoldObjectsTool)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [computeGrabXfo(refs) ⇒ <code>any</code>](#computeGrabXfo)
    * [initAction()](#initAction)
    * [onVRControllerButtonDown(event) ⇒ <code>any</code>](#onVRControllerButtonDown)
    * [onVRControllerButtonUp(event) ⇒ <code>any</code>](#onVRControllerButtonUp)
    * [onVRPoseChanged(event) ⇒ <code>any</code>](#onVRPoseChanged)

<a name="new_VRHoldObjectsTool_new"></a>

### new VRHoldObjectsTool
Create a VR hold objects tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="VRHoldObjectsTool+activateTool"></a>

### activateTool
The activateTool method.


<a name="VRHoldObjectsTool+deactivateTool"></a>

### deactivateTool
The deactivateTool method.


<a name="VRHoldObjectsTool+computeGrabXfo"></a>

### computeGrabXfo
The computeGrabXfo method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| refs | <code>any</code> | The refs param. |

<a name="VRHoldObjectsTool+initAction"></a>

### initAction
The initAction method.


<a name="VRHoldObjectsTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
The onVRControllerButtonDown method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="VRHoldObjectsTool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
The onVRControllerButtonUp method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="VRHoldObjectsTool+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

