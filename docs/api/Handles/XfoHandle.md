<a name="XfoHandle"></a>

### XfoHandle 
Class representing a xfo handle. Base transformations for objects in the scene**Parameters*** **HighlightColor(`ColorParameter`):** Specifies the highlight color of the handle.


**Extends**: <code>TreeItem</code>  

* [XfoHandle ⇐ <code>TreeItem</code>](#XfoHandle)
    * [new XfoHandle(size, thickness)](#new-XfoHandle)
    * ~~[.showHandles(visible)](#XfoHandle+showHandles)~~
    * [setTargetParam(param)](#setTargetParam)

<a name="new_XfoHandle_new"></a>

### new XfoHandle
Create an axial rotation scene widget.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| size | <code>number</code> | <code>0.1</code> | The size value. |
| thickness | <code>number</code> | <code>0.003</code> | The thickness value. |

<a name="XfoHandle+showHandles"></a>

### ~~xfoHandle.showHandles(visible)~~
***Deprecated***

Displays handles depending on the specified mode(Move, Rotate, Scale).If nothing is specified, it hides all of them.



| Param | Type | Description |
| --- | --- | --- |
| visible | <code>boolean</code> | The mode of the Xfo parameter |

<a name="XfoHandle+setTargetParam"></a>

### setTargetParam
Sets global xfo target parameter.



| Param | Type | Description |
| --- | --- | --- |
| param | <code>Parameter</code> | The video param. |

