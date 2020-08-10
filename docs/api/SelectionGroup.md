<a name="__bindItem"></a>

## \_\_bindItem(color)
The setSelectionOutlineColor method.



| Param | Type | Description |
| --- | --- | --- |
| color | <code>any</code> | The color param.   setSelectionOutlineColor(color) {     this.selectionOutlineColor = color     subtreeColor = color.lerp(       new Color('white'),       0.5     )     subtreeColor.a = 0.1   } |

