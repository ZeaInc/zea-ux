[@zeainc/zea-ux](../API.md) / XfoHandle

# Class: XfoHandle

Class representing a xfo handle. Base transformations for objects in the scene

**Parameters**
* **HighlightColor(`ColorParameter`):** Specifies the highlight color of the handle.

## Hierarchy

- `TreeItem`

  ↳ **`XfoHandle`**

## Table of contents

### Constructors

- [constructor](XfoHandle.md#constructor)

### Properties

- [highlightColorParam](XfoHandle.md#highlightcolorparam)
- [param](XfoHandle.md#param)

### Methods

- [setSelectionGroup](XfoHandle.md#setselectiongroup)
- [setTargetParam](XfoHandle.md#settargetparam)
- [showHandles](XfoHandle.md#showhandles)

## Constructors

### constructor

• **new XfoHandle**(`size?`, `thickness?`)

Create an axial rotation scene widget.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `size` | `number` | `0.1` | The size value. |
| `thickness` | `number` | `0.001` | The thickness value. |

#### Overrides

TreeItem.constructor

#### Defined in

[src/Handles/XfoHandle.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/XfoHandle.ts#L27)

## Properties

### highlightColorParam

• **highlightColorParam**: `ColorParameter`

#### Defined in

[src/Handles/XfoHandle.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/XfoHandle.ts#L19)

___

### param

• **param**: `Parameter`<`unknown`\>

#### Defined in

[src/Handles/XfoHandle.ts:18](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/XfoHandle.ts#L18)

## Methods

### setSelectionGroup

▸ **setSelectionGroup**(`selectionGroup`): `void`

Sets selectionGroup so this handle can modify the items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selectionGroup` | `SelectionGroup` | The SelectionGroup. |

#### Returns

`void`

#### Defined in

[src/Handles/XfoHandle.ts:197](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/XfoHandle.ts#L197)

___

### setTargetParam

▸ **setTargetParam**(`param`, `track?`): `void`

Sets global xfo target parameter.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `param` | `Parameter`<`unknown`\> | `undefined` | The video param. |
| `track` | `boolean` | `true` | - |

#### Returns

`void`

#### Defined in

[src/Handles/XfoHandle.ts:185](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/XfoHandle.ts#L185)

___

### showHandles

▸ **showHandles**(`visible`): `void`

Displays handles depending on the specified mode(Move, Rotate, Scale).
If nothing is specified, it hides all of them.

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `visible` | `boolean` | The mode of the Xfo parameter |

#### Returns

`void`

#### Defined in

[src/Handles/XfoHandle.ts:175](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/XfoHandle.ts#L175)
