### Functions

<dl>
<dt><a href="#addItem">addItem(item)</a></dt>
<dd><p>adds a new item to the SelectionGroupXfoOperator.</p>
</dd>
<dt><a href="#removeItem">removeItem(item)</a></dt>
<dd><p>removes an item that was previously added to the SelectionGroupXfoOperator.</p>
</dd>
<dt><a href="#setValue">setValue(xfo)</a></dt>
<dd><p>Move the group. When the selection group is manipulated, this method is called. Here we propagate the delta to each of the selection members.</p>
</dd>
<dt><a href="#evaluate">evaluate()</a></dt>
<dd><p>Calculate a new Xfo for the group based on the members.</p>
</dd>
</dl>

<a name="addItem"></a>

### addItem
adds a new item to the SelectionGroupXfoOperator.



| Param | Type | Description |
| --- | --- | --- |
| item | <code>TreeItem</code> | The tree item being added |

<a name="removeItem"></a>

### removeItem
removes an item that was previously added to the SelectionGroupXfoOperator.



| Param | Type | Description |
| --- | --- | --- |
| item | <code>TreeItem</code> | The Bind Xfo calculated from the initial Transforms of the Group Members. |

<a name="setValue"></a>

### setValue
Move the group. When the selection group is manipulated, this method is called. Here we propagate the delta to each of the selection members.



| Param | Type | Description |
| --- | --- | --- |
| xfo | <code>Xfo</code> | The new value being set to the Groups GlobalXfo param. |

<a name="evaluate"></a>

### evaluate
Calculate a new Xfo for the group based on the members.


