<a name="SelectionGroupXfoOperator"></a>

### SelectionGroupXfoOperator 
An operator for aiming items at targets.


**Extends**: <code>Operator</code>  

* [SelectionGroupXfoOperator ⇐ <code>Operator</code>](#SelectionGroupXfoOperator)
    * [new SelectionGroupXfoOperator(initialXfoModeParam, globalXfoParam)](#new-SelectionGroupXfoOperator)
    * [addItem(item)](#addItem)
    * [removeItem(item)](#removeItem)
    * [backPropagateValue(xfo)](#backPropagateValue)
    * [evaluate()](#evaluate)

<a name="new_SelectionGroupXfoOperator_new"></a>

### new SelectionGroupXfoOperator
Creates an instance of SelectionGroupXfoOperator.


| Param | Type | Description |
| --- | --- | --- |
| initialXfoModeParam | <code>number</code> | Initial XFO Mode, check `INITIAL_XFO_MODES` in `Group` documentation |
| globalXfoParam | <code>XfoParameter</code> | The GlobalXfo param found on the Group. |

<a name="SelectionGroupXfoOperator+addItem"></a>

### addItem
Updates operator inputs(`OperatorInput`) of current `Operator` using the specified `TreeItem`.



| Param | Type | Description |
| --- | --- | --- |
| item | <code>TreeItem</code> | The tree item being added |

<a name="SelectionGroupXfoOperator+removeItem"></a>

### removeItem
Finds and removes the `OperatorInput` of the specified `TreeItem` from current`Operator`.



| Param | Type | Description |
| --- | --- | --- |
| item | <code>TreeItem</code> | The Bind Xfo calculated from the initial Transforms of the Group Members. |

<a name="SelectionGroupXfoOperator+backPropagateValue"></a>

### backPropagateValue
Move the group. When the selection group is manipulated, this method is called.Here we propagate the delta to each of the selection members.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The new value being set to the Groups GlobalXfo param. |

<a name="SelectionGroupXfoOperator+evaluate"></a>

### evaluate
Calculates a new Xfo for the group based on the members.


