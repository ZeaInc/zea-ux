### Classes

<dl>
<dt><a href="#CreateSphereChange">CreateSphereChange</a> ⇐ <code>CreateGeomChange</code></dt>
<dd><p>Class representing a create sphere change.</p>
</dd>
<dt><a href="#CreateSphereTool">CreateSphereTool</a> ⇐ <code>CreateGeomTool</code></dt>
<dd><p>Class representing a create sphere tool.</p>
</dd>
</dl>

<a name="CreateSphereChange"></a>

### CreateSphereChange 
Class representing a create sphere change.


**Extends**: <code>CreateGeomChange</code>  

* [CreateSphereChange ⇐ <code>CreateGeomChange</code>](#CreateSphereChange)
    * [new CreateSphereChange(parentItem, xfo)](#new-CreateSphereChange)
    * [update(updateData)](#update)
    * [toJSON() ⇒ <code>any</code>](#toJSON)
    * [changeFromJSON(j)](#changeFromJSON)

<a name="new_CreateSphereChange_new"></a>

### new CreateSphereChange
Create a create sphere change.


| Param | Type | Description |
| --- | --- | --- |
| parentItem | <code>any</code> | The parentItem value. |
| xfo | <code>any</code> | The xfo value. |

<a name="CreateSphereChange+update"></a>

### update
The update method.



| Param | Type | Description |
| --- | --- | --- |
| updateData | <code>any</code> | The updateData param. |

<a name="CreateSphereChange+toJSON"></a>

### toJSON
The toJSON method.


**Returns**: <code>any</code> - The return value.  
<a name="CreateSphereChange+changeFromJSON"></a>

### changeFromJSON
The changeFromJSON method.



| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | The j param. |

<a name="CreateSphereTool"></a>

### CreateSphereTool 
Class representing a create sphere tool.


**Extends**: <code>CreateGeomTool</code>  

* [CreateSphereTool ⇐ <code>CreateGeomTool</code>](#CreateSphereTool)
    * [new CreateSphereTool(appData)](#new-CreateSphereTool)
    * [createStart(xfo, parentItem)](#createStart)
    * [createMove(pt)](#createMove)
    * [createRelease(pt)](#createRelease)

<a name="new_CreateSphereTool_new"></a>

### new CreateSphereTool
Create a create sphere tool.


| Param | Type | Description |
| --- | --- | --- |
| appData | <code>any</code> | The appData value. |

<a name="CreateSphereTool+createStart"></a>

### createStart
The createStart method.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>any</code> | The xfo param. |
| parentItem | <code>any</code> | The parentItem param. |

<a name="CreateSphereTool+createMove"></a>

### createMove
The createMove method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

<a name="CreateSphereTool+createRelease"></a>

### createRelease
The createRelease method.



| Param | Type | Description |
| --- | --- | --- |
| pt | <code>any</code> | The pt param. |

