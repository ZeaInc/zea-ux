<a name="ArcSlider"></a>

### ArcSlider 
Class representing a slider scene widget with an arc shape. There are two parts in this widget, the slider and the handle.<br>The **Handle** is the moving part of the widget, the object you interact with. The **Slider** is the path that the **handle** follows.**Parameters*** **ArcRadius(`NumberParameter`):** Specifies the radius of the slider.* **ArcAngle(`NumberParameter`):** Specifies the arc angle of the slider.* **HandleRadius(`NumberParameter`):** Specifies the radius of the handle in the slider.**Events*** **dragStart:** Triggered when the pointer is down.* **dragEnd:** Triggered when the pointer is released.


**Extends**: <code>[BaseAxialRotationHandle](api/Handles\BaseAxialRotationHandle.md)</code>  

* [ArcSlider ⇐ <code>BaseAxialRotationHandle</code>](#ArcSlider)
    * [new ArcSlider(name, [arcRadius], [arcAngle], [handleRadius], [color])](#new-ArcSlider)
    * [onPointerEnter(event)](#onPointerEnter)
    * [onPointerLeave(event)](#onPointerLeave)
    * [onPointerDown(event)](#onPointerDown)
    * [highlight()](#highlight)
    * [unhighlight()](#unhighlight)
    * [setTargetParam(param, track)](#setTargetParam)
    * [getBaseXfo() ⇒ <code>Xfo</code>](#getBaseXfo)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(json, context)](#fromJSON)

<a name="new_ArcSlider_new"></a>

### new ArcSlider
Creates an instance of ArcSlider.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | The name value |
| [arcRadius] | <code>number</code> | <code>1</code> | The arcRadius value |
| [arcAngle] | <code>number</code> | <code>1</code> | The arcAngle value |
| [handleRadius] | <code>number</code> | <code>0.02</code> | The handleRadius value |
| [color] | <code>Color</code> | <code>new Color(1, 1, 0)</code> | the color value |

<a name="ArcSlider+onPointerEnter"></a>

### onPointerEnter
Event fired when a pointing device is initially moved within the space of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> | The event param. |

<a name="ArcSlider+onPointerLeave"></a>

### onPointerLeave
Event fired when a pointing device moves outside of the space of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> | The event param. |

<a name="ArcSlider+onPointerDown"></a>

### onPointerDown
Event fired when a pointing device button is pressed while the pointer is over the handle element.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> | The event param. |

<a name="ArcSlider+highlight"></a>

### highlight
Applies a special shinning shader to the handle to illustrate interaction with it.


<a name="ArcSlider+unhighlight"></a>

### unhighlight
Removes the shining shader from the handle.


<a name="ArcSlider+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| param | <code>Parameter</code> |  | The param param. |
| track | <code>boolean</code> | <code>true</code> | The track param. |

<a name="ArcSlider+getBaseXfo"></a>

### getBaseXfo
Returns handle's global Xfo


**Returns**: <code>Xfo</code> - - The Xfo value  
<a name="ArcSlider+onDragStart"></a>

### onDragStart
Handles the initially drag interaction of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> \| <code>ZeaTouchEvent</code> \| <code>object</code> | The event param. |

<a name="ArcSlider+onDrag"></a>

### onDrag
Handles drag interaction of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> \| <code>ZeaTouchEvent</code> \| <code>object</code> | The event param. |

<a name="ArcSlider+onDragEnd"></a>

### onDragEnd
Handles the end of dragging interaction with the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>ZeaMouseEvent</code> \| <code>ZeaTouchEvent</code> \| <code>object</code> | The event param. |

<a name="ArcSlider+toJSON"></a>

### toJSON
Serializes handle item as a JSON object.


**Returns**: <code>object</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The context param. |

<a name="ArcSlider+fromJSON"></a>

### fromJSON
Restores handle item from a JSON object.



| Param | Type | Description |
| --- | --- | --- |
| json | <code>object</code> | The json param. |
| context | <code>object</code> | The context param. |

