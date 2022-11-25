[@zeainc/zea-ux](../API.md) / SelectionManager

# Class: SelectionManager

Class representing a selection manager

**Events**
**leadSelectionChanged:** Triggered when selecting one item.
**selectionChanged:** Triggered when the selected objects change.

## Hierarchy

- `EventEmitter`

  ↳ **`SelectionManager`**

## Table of contents

### Constructors

- [constructor](SelectionManager.md#constructor)

### Properties

- [\_\_pickCB](SelectionManager.md#__pickcb)
- [\_\_pickCount](SelectionManager.md#__pickcount)
- [\_\_pickFilter](SelectionManager.md#__pickfilter)
- [\_\_picked](SelectionManager.md#__picked)
- [\_\_renderer](SelectionManager.md#__renderer)
- [appData](SelectionManager.md#appdata)
- [leadSelection](SelectionManager.md#leadselection)
- [selectionGroup](SelectionManager.md#selectiongroup)
- [xfoHandle](SelectionManager.md#xfohandle)
- [xfoHandleVisible](SelectionManager.md#xfohandlevisible)

### Methods

- [\_\_setLeadSelection](SelectionManager.md#__setleadselection)
- [cancelPickingMode](SelectionManager.md#cancelpickingmode)
- [clearSelection](SelectionManager.md#clearselection)
- [deselectItems](SelectionManager.md#deselectitems)
- [getSelection](SelectionManager.md#getselection)
- [pick](SelectionManager.md#pick)
- [pickingFilter](SelectionManager.md#pickingfilter)
- [pickingModeActive](SelectionManager.md#pickingmodeactive)
- [selectItems](SelectionManager.md#selectitems)
- [setRenderer](SelectionManager.md#setrenderer)
- [setSelection](SelectionManager.md#setselection)
- [setXfoMode](SelectionManager.md#setxfomode)
- [showHandles](SelectionManager.md#showhandles)
- [startPickingMode](SelectionManager.md#startpickingmode)
- [toggleItemSelection](SelectionManager.md#toggleitemselection)
- [toggleSelectionVisibility](SelectionManager.md#toggleselectionvisibility)
- [updateHandleVisibility](SelectionManager.md#updatehandlevisibility)

## Constructors

### constructor

• **new SelectionManager**(`appData`, `options?`)

Creates an instance of SelectionManager.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appData` | [`AppData`](../interfaces/AppData.md) | The options object. |
| `options?` | `any` | The appData value.   enableXfoHandles - enables display Xfo Gizmo handles when items are selected.   selectionOutlineColor - enables highlight color to use to outline selected items.   branchSelectionOutlineColor - enables highlight color to use to outline selected items. |

#### Overrides

EventEmitter.constructor

#### Defined in

[src/SelectionManager.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L39)

## Properties

### \_\_pickCB

• **\_\_pickCB**: `any`

#### Defined in

[src/SelectionManager.ts:26](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L26)

___

### \_\_pickCount

• **\_\_pickCount**: `number`

#### Defined in

[src/SelectionManager.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L27)

___

### \_\_pickFilter

• **\_\_pickFilter**: `any`

#### Defined in

[src/SelectionManager.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L25)

___

### \_\_picked

• **\_\_picked**: `TreeItem`[]

#### Defined in

[src/SelectionManager.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L28)

___

### \_\_renderer

• **\_\_renderer**: `GLRenderer`

#### Defined in

[src/SelectionManager.ts:24](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L24)

___

### appData

• **appData**: [`AppData`](../interfaces/AppData.md)

#### Defined in

[src/SelectionManager.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L19)

___

### leadSelection

• **leadSelection**: `TreeItem` = `undefined`

#### Defined in

[src/SelectionManager.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L20)

___

### selectionGroup

• **selectionGroup**: `SelectionGroup`

#### Defined in

[src/SelectionManager.ts:21](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L21)

___

### xfoHandle

• **xfoHandle**: [`XfoHandle`](XfoHandle.md)

#### Defined in

[src/SelectionManager.ts:22](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L22)

___

### xfoHandleVisible

• **xfoHandleVisible**: `boolean`

#### Defined in

[src/SelectionManager.ts:23](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L23)

## Methods

### \_\_setLeadSelection

▸ `Private` **__setLeadSelection**(`treeItem?`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `treeItem?` | `TreeItem` | The treeItem value |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:160](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L160)

___

### cancelPickingMode

▸ **cancelPickingMode**(): `void`

The cancelPickingMode method.

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:398](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L398)

___

### clearSelection

▸ **clearSelection**(`newChange?`): `boolean`

Clears selection state by removing previous selected items and the Xfo handlers.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `newChange` | `boolean` | `true` | The newChange param. |

#### Returns

`boolean`

- The return value.

#### Defined in

[src/SelectionManager.ts:258](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L258)

___

### deselectItems

▸ **deselectItems**(`treeItems`): `void`

Deselects the specified items from the selection group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `treeItems` | `Set`<`TreeItem`\> | The treeItems param. |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:320](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L320)

___

### getSelection

▸ **getSelection**(): `Set`<`TreeItem`\>

Returns an array with the selected items.

#### Returns

`Set`<`TreeItem`\>

- The return value.

#### Defined in

[src/SelectionManager.ts:114](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L114)

___

### pick

▸ **pick**(`item`): `void`

The pick method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `TreeItem` \| `TreeItem`[] | The item param. |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:406](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L406)

___

### pickingFilter

▸ **pickingFilter**(`item`): `any`

The pickingFilter method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `TreeItem` | The item param. |

#### Returns

`any`

The return value.

#### Defined in

[src/SelectionManager.ts:382](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L382)

___

### pickingModeActive

▸ **pickingModeActive**(): `boolean`

The pickingModeActive method.

#### Returns

`boolean`

The return value.

#### Defined in

[src/SelectionManager.ts:391](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L391)

___

### selectItems

▸ **selectItems**(`treeItems`, `replaceSelection?`): `void`

Selects the specified items replacing previous selection or concatenating new items to it.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `treeItems` | `Set`<`TreeItem`\> | `undefined` | The treeItems param. |
| `replaceSelection` | `boolean` | `true` | The replaceSelection param. |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:286](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L286)

___

### setRenderer

▸ **setRenderer**(`renderer`): `void`

Adds specified the renderer to the `SelectionManager` and attaches the `SelectionGroup`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `GLRenderer` | The renderer param. |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:66](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L66)

___

### setSelection

▸ **setSelection**(`newSelection`, `createUndo?`): `void`

Sets a new selection of items in the `SelectionManager`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `newSelection` | `Set`<`TreeItem`\> | `undefined` | The newSelection param |
| `createUndo?` | `boolean` | `true` | The createUndo param |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:124](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L124)

___

### setXfoMode

▸ **setXfoMode**(`mode`): `void`

Sets initial Xfo mode of the selection group.

**`See`**

`KinematicGroup` class documentation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | `number` | The Xfo mode |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:82](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L82)

___

### showHandles

▸ **showHandles**(`enabled`): `void`

Displays handles depending on the specified mode(Move, Rotate, Scale).
If nothing is specified, it hides all of them.

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `enabled` | `boolean` | The mode of the Xfo parameter |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:94](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L94)

___

### startPickingMode

▸ **startPickingMode**(`label`, `fn`, `filterFn`, `count`): `void`

The startPickingMode method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `label` | `string` | The label param. |
| `fn` | `any` | The fn param. |
| `filterFn` | `any` | The filterFn param. |
| `count` | `number` | The count param. |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:367](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L367)

___

### toggleItemSelection

▸ **toggleItemSelection**(`treeItem`, `replaceSelection?`): `void`

The toggleItemSelection method.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `treeItem` | `TreeItem` | `undefined` | The treeItem param. |
| `replaceSelection` | `boolean` | `true` | The replaceSelection param. |

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:173](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L173)

___

### toggleSelectionVisibility

▸ **toggleSelectionVisibility**(): `void`

Toggles selection visibility, if the visibility is `true`then sets it to `false` and vice versa.

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:348](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L348)

___

### updateHandleVisibility

▸ **updateHandleVisibility**(): `void`

Determines if the Xfo Manipulation handle should be displayed or not.

#### Returns

`void`

#### Defined in

[src/SelectionManager.ts:101](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/SelectionManager.ts#L101)
