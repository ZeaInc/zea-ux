### Classes

<dl>
<dt><a href="#CreateGeomChange">CreateGeomChange</a> ⇐ <code>Change</code></dt>
<dd><p>Class representing a create geom change.</p>
</dd>
<dt><a href="#CreateGeomTool">CreateGeomTool</a> ⇐ <code>BaseCreateTool</code></dt>
<dd><p>Class representing a create geom tool.</p>
</dd>
</dl>

<a name="CreateGeomChange"></a>

### CreateGeomChange 
Class representing a create geom change.


**Extends**: <code>Change</code>  

* [CreateGeomChange ⇐ <code>Change</code>](#CreateGeomChange)
    * [new CreateGeomChange(name)](#new-CreateGeomChange)
    * [setParentAndXfo(parentItem, xfo)](#setParentAndXfo)
    * [undo()](#undo)
    * [redo()](#redo)
    * [toJSON(appData) ⇒ <code>any</code>](#toJSON)
    * [fromJSON(j, appData)](#fromJSON)
    * [destroy()](#destroy)

<a name="new_CreateGeomChange_new"></a>

### new CreateGeomChange
Create a create circle change.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | The name value. |

<a name="CreateGeomChange+setParentAndXfo"></a>

### setParentAndXfo
The setParentAndXfo method.



| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>any</code> | The parentItem param. |
| xfo | <code>any</code> | The xfo param. |

<a name="CreateGeomChange+undo"></a>

### undo
The undo method.


<a name="CreateGeomChange+redo"></a>

### redo
The redo method.


<a name="CreateGeomChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData param. |

<a name="CreateGeomChange+fromJSON"></a>

### fromJSON
The fromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | The j param. |
| appData | <code>any</code> | The appData param. |

<a name="CreateGeomChange+destroy"></a>

### destroy
The destroy method.


<a name="CreateGeomTool"></a>

### CreateGeomTool 
Class representing a create geom tool.


**Extends**: <code>BaseCreateTool</code>  

* [CreateGeomTool ⇐ <code>BaseCreateTool</code>](#CreateGeomTool)
    * [new CreateGeomTool(appData)](#new-CreateGeomTool)
    * [activateTool()](#activateTool)
    * [deactivateTool()](#deactivateTool)
    * [screenPosToXfo(screenPos, viewport) ⇒ <code>any</code>](#screenPosToXfo)
    * [createStart(xfo, parentItem)](#createStart)
    * [createPoint(pt)](#createPoint)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)
    * [onMouseDown(event) ⇒ <code>any</code>](#onMouseDown)
    * [onMouseMove(event) ⇒ <code>any</code>](#onMouseMove)
    * [onMouseUp(event) ⇒ <code>any</code>](#onMouseUp)
    * [onWheel(event)](#onWheel)
    * [onKeyPressed(key, event)](#onKeyPressed)
    * [onKeyDown(key, event)](#onKeyDown)
    * [onKeyUp(key, event)](#onKeyUp)
    * [onTouchStart(event)](#onTouchStart)
    * [onTouchMove(event)](#onTouchMove)
    * [onTouchEnd(event)](#onTouchEnd)
    * [onTouchCancel(event)](#onTouchCancel)
    * [onVRControllerButtonDown(event) ⇒ <code>any</code>](#onVRControllerButtonDown)
    * [onVRPoseChanged(event) ⇒ <code>any</code>](#onVRPoseChanged)
    * [onVRControllerButtonUp(event) ⇒ <code>any</code>](#onVRControllerButtonUp)

<a name="new_CreateGeomTool_new"></a>

### new CreateGeomTool
Create a create geom tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="CreateGeomTool+activateTool"></a>

### activateTool
The activateTool method.


<a name="CreateGeomTool+deactivateTool"></a>

### deactivateTool
The deactivateTool method.


<a name="CreateGeomTool+screenPosToXfo"></a>

### screenPosToXfo
The screenPosToXfo method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| screenPos | <code>any</code> | The screenPos param. |
| viewport | <code>any</code> | The viewport param. |

<a name="CreateGeomTool+createStart"></a>

### createStart
The createStart method.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>any</code> | The xfo param. |
| parentItem | <code>any</code> | The parentItem param. |

<a name="CreateGeomTool+createPoint"></a>

### createPoint
The createPoint method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

<a name="CreateGeomTool+createMove"></a>

### createMove
The createMove method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

<a name="CreateGeomTool+createRelease"></a>

### createRelease
The createRelease method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

<a name="CreateGeomTool+onMouseDown"></a>

### onMouseDown
The onMouseDown method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onMouseMove"></a>

### onMouseMove
The onMouseMove method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onMouseUp"></a>

### onMouseUp
The onMouseUp method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onWheel"></a>

### onWheel
The onWheel method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onKeyPressed"></a>

### onKeyPressed
The onKeyPressed method.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key param. |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onKeyDown"></a>

### onKeyDown
The onKeyDown method.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key param. |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onKeyUp"></a>

### onKeyUp
The onKeyUp method.



| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key param. |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onTouchStart"></a>

### onTouchStart
The onTouchStart method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onTouchMove"></a>

### onTouchMove
The onTouchMove method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onTouchEnd"></a>

### onTouchEnd
The onTouchEnd method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onTouchCancel"></a>

### onTouchCancel
The onTouchCancel method.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onVRControllerButtonDown"></a>

### onVRControllerButtonDown
The onVRControllerButtonDown method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onVRPoseChanged"></a>

### onVRPoseChanged
The onVRPoseChanged method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

<a name="CreateGeomTool+onVRControllerButtonUp"></a>

### onVRControllerButtonUp
The onVRControllerButtonUp method.


**Returns**: <code>any</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>any</code> | The event param. |

