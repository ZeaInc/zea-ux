<a name="BaseAxialRotationHandle"></a>

### BaseAxialRotationHandle 
Class representing an axial rotation scene widget.


**Extends**: <code>[Handle](api/Handles/Handle.md)</code>  

* [BaseAxialRotationHandle ⇐ <code>Handle</code>](#BaseAxialRotationHandle)
    * [new BaseAxialRotationHandle(name)](#new-BaseAxialRotationHandle)
    * [setTargetParam(param, track)](#setTargetParam)
    * [getTargetParam() ⇒ <code>Parameter</code>](#getTargetParam)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)

<a name="new_BaseAxialRotationHandle_new"></a>

### new BaseAxialRotationHandle
Create an axial rotation scene widget.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name value. |

<a name="BaseAxialRotationHandle+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| param | <code>Parameter</code> |  | The param param. |
| track | <code>boolean</code> | <code>true</code> | The track param. |

<a name="BaseAxialRotationHandle+getTargetParam"></a>

### getTargetParam
Returns target's global xfo parameter.


**Returns**: <code>Parameter</code> - - returns handle's target global Xfo.  
<a name="BaseAxialRotationHandle+onDragStart"></a>

### onDragStart
Handles the initially drag of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="BaseAxialRotationHandle+onDrag"></a>

### onDrag
Handles drag action of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="BaseAxialRotationHandle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

