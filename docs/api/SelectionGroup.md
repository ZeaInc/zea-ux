<a name="SelectionGroup"></a>

### SelectionGroup 
A specific type of `Group` class that contains/handles selection of one or more items from the scene.**Option parameter values**| Option | type | default | Description || --- | --- | --- | --- || selectionOutlineColor | `Color` | `new Color('#03e3ac'))`  and opacity of `0.1` | See `Color` documentation || branchSelectionOutlineColor | `Color` | `new Color('#81f1d5')` and opacity of `0.55` | See `Color` documentation |


**Extends**: <code>Group</code>  

* [SelectionGroup ⇐ <code>Group</code>](#SelectionGroup)
    * [new SelectionGroup(options)](#new-SelectionGroup)
    * _instance_
        * [clone()](#clone)
    * _static_
        * [INITIAL_XFO_MODES](#INITIAL_XFO_MODES)

<a name="new_SelectionGroup_new"></a>

### new SelectionGroup
Creates an instance of SelectionGroup.**Parameters**


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Custom options for selection |

<a name="SelectionGroup+clone"></a>

### clone
Constructs a new selection group by copying the values from current one and returns it.


**Returns**: [<code>SelectionGroup</code>](#SelectionGroup) - - Cloned selection group.  
<a name="SelectionGroup.INITIAL_XFO_MODES"></a>

### INITIAL
Returns enum of available xfo modes.| Name | Default || --- | --- || manual | <code>0</code> || first | <code>1</code> || average | <code>2</code> || globalOri | <code>3</code> |


