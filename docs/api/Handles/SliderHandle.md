<a name="SliderHandle"></a>

### SliderHandle 
Class representing a slider scene widget. There are two parts in this widget, the slider and the handle.<br>The **Handle** is the moving part of the widget, the object you interact with. The **Slider** is the path that the **handle** follows.**Parameters*** **Length(`NumberParameter`):** Specifies the length of the slider.* **HandleRadius(`NumberParameter`):** Specifies the handle radius.* **BarRadius(`NumberParameter`):** Specifies the radius of the slider.


**Extends**: <code>[BaseLinearMovementHandle](api/Handles\BaseLinearMovementHandle.md)</code>  

* [SliderHandle ⇐ <code>BaseLinearMovementHandle</code>](#SliderHandle)
    * [new SliderHandle(name, length, radius, color)](#new-SliderHandle)
    * [highlight()](#highlight)
    * [unhighlight()](#unhighlight)
    * [setTargetParam(param, track)](#setTargetParam)
    * [onDragStart(event)](#onDragStart)
    * [onDrag(event)](#onDrag)
    * [onDragEnd(event)](#onDragEnd)
    * [toJSON(context) ⇒ <code>object</code>](#toJSON)
    * [fromJSON(json, context)](#fromJSON)

<a name="new_SliderHandle_new"></a>

### new SliderHandle
Create a slider scene widget.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | The name value. |
| length | <code>number</code> | <code>0.5</code> | The length value. |
| radius | <code>number</code> | <code>0.02</code> | The radius value. |
| color | <code>Color</code> |  | The color value. |

<a name="SliderHandle+highlight"></a>

### highlight
Applies a special shinning shader to the handle to illustrate interaction with it.


<a name="SliderHandle+unhighlight"></a>

### unhighlight
Removes the shining shader from the handle.


<a name="SliderHandle+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter.



| Param | Type | Description |
| --- | --- | --- |
| param | <code>Parameter</code> | The video param. |
| track | <code>boolean</code> | The track param. |

<a name="SliderHandle+onDragStart"></a>

### onDragStart
Handles the initially drag of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="SliderHandle+onDrag"></a>

### onDrag
Handles drag action of the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="SliderHandle+onDragEnd"></a>

### onDragEnd
Handles the end of dragging the handle.



| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> \| <code>TouchEvent</code> \| <code>object</code> | The event param. |

<a name="SliderHandle+toJSON"></a>

### toJSON
Serializes handle item as a JSON object.


**Returns**: <code>object</code> - The return value.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | The context param. |

<a name="SliderHandle+fromJSON"></a>

### fromJSON
Restores handle item from a JSON object.



| Param | Type | Description |
| --- | --- | --- |
| json | <code>object</code> | The json param. |
| context | <code>object</code> | The context param. |

