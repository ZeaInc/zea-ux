[@zeainc/zea-ux](../API.md) / SelectionChange

# Class: SelectionChange

Represents a `Change` class for storing `Selection` values.

## Hierarchy

- [`Change`](Change.md)

  ↳ **`SelectionChange`**

## Table of contents

### Constructors

- [constructor](SelectionChange.md#constructor)

### Properties

- [\_\_newSelection](SelectionChange.md#__newselection)
- [\_\_prevSelection](SelectionChange.md#__prevselection)
- [\_\_selectionManager](SelectionChange.md#__selectionmanager)
- [name](SelectionChange.md#name)
- [secondaryChanges](SelectionChange.md#secondarychanges)
- [suppressPrimaryChange](SelectionChange.md#suppressprimarychange)

### Methods

- [addSecondaryChange](SelectionChange.md#addsecondarychange)
- [destroy](SelectionChange.md#destroy)
- [fromJSON](SelectionChange.md#fromjson)
- [redo](SelectionChange.md#redo)
- [toJSON](SelectionChange.md#tojson)
- [undo](SelectionChange.md#undo)
- [update](SelectionChange.md#update)
- [updateFromJSON](SelectionChange.md#updatefromjson)

## Constructors

### constructor

• **new SelectionChange**(`selectionManager`, `prevSelection`, `newSelection`)

Creates an instance of SelectionChange.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selectionManager` | [`SelectionManager`](SelectionManager.md) | The selectionManager value. |
| `prevSelection` | `Set`<`TreeItem`\> | The prevSelection value. |
| `newSelection` | `Set`<`TreeItem`\> | The newSelection value. |

#### Overrides

[Change](Change.md).[constructor](Change.md#constructor)

#### Defined in

[src/UndoRedo/Changes/SelectionChange.ts:22](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionChange.ts#L22)

## Properties

### \_\_newSelection

• **\_\_newSelection**: `Set`<`TreeItem`\>

#### Defined in

[src/UndoRedo/Changes/SelectionChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionChange.ts#L14)

___

### \_\_prevSelection

• **\_\_prevSelection**: `Set`<`TreeItem`\>

#### Defined in

[src/UndoRedo/Changes/SelectionChange.ts:13](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionChange.ts#L13)

___

### \_\_selectionManager

• **\_\_selectionManager**: [`SelectionManager`](SelectionManager.md)

#### Defined in

[src/UndoRedo/Changes/SelectionChange.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionChange.ts#L12)

___

### name

• **name**: `string`

#### Inherited from

[Change](Change.md).[name](Change.md#name)

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### secondaryChanges

• **secondaryChanges**: [`Change`](Change.md)[] = `[]`

#### Inherited from

[Change](Change.md).[secondaryChanges](Change.md#secondarychanges)

#### Defined in

[src/UndoRedo/Change.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L12)

___

### suppressPrimaryChange

• **suppressPrimaryChange**: `boolean` = `false`

#### Inherited from

[Change](Change.md).[suppressPrimaryChange](Change.md#suppressprimarychange)

#### Defined in

[src/UndoRedo/Change.ts:13](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L13)

## Methods

### addSecondaryChange

▸ **addSecondaryChange**(`secondaryChange`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `secondaryChange` | [`Change`](Change.md) |

#### Returns

`number`

#### Inherited from

[Change](Change.md).[addSecondaryChange](Change.md#addsecondarychange)

#### Defined in

[src/UndoRedo/Change.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L25)

___

### destroy

▸ **destroy**(): `void`

Method destined to clean up things that would need to be cleaned manually.
It is executed when flushing the undo/redo stacks or adding a new change to the undo stack,
so it is require in any class that represents a change.

#### Returns

`void`

#### Inherited from

[Change](Change.md).[destroy](Change.md#destroy)

#### Defined in

[src/UndoRedo/Change.ts:103](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L103)

___

### fromJSON

▸ **fromJSON**(`j`, `context`): `void`

Restores selection state from a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |
| `context` | `Record`<`any`, `any`\> | The context param. |

#### Returns

`void`

#### Overrides

[Change](Change.md).[fromJSON](Change.md#fromjson)

#### Defined in

[src/UndoRedo/Changes/SelectionChange.ts:66](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionChange.ts#L66)

___

### redo

▸ **redo**(): `void`

Restores the state of the selections to the latest the list of items selected.

#### Returns

`void`

#### Overrides

[Change](Change.md).[redo](Change.md#redo)

#### Defined in

[src/UndoRedo/Changes/SelectionChange.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionChange.ts#L39)

___

### toJSON

▸ **toJSON**(`context`): `Record`<`any`, `any`\>

Serializes selection values as a JSON object, allowing persistence/replication.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`any`, `any`\> | The appData param. |

#### Returns

`Record`<`any`, `any`\>

The return value.

#### Overrides

[Change](Change.md).[toJSON](Change.md#tojson)

#### Defined in

[src/UndoRedo/Changes/SelectionChange.ts:49](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionChange.ts#L49)

___

### undo

▸ **undo**(): `void`

Sets the state of selections to the previous list of items selected.

#### Returns

`void`

#### Overrides

[Change](Change.md).[undo](Change.md#undo)

#### Defined in

[src/UndoRedo/Changes/SelectionChange.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionChange.ts#L32)

___

### update

▸ **update**(`updateData`): `void`

Use this method to update the state of your `Change` class.

**`Note`**

This method needs to be implemented, otherwise it will throw an Error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `updateData` | `Record`<`any`, `any`\> | The updateData param. |

#### Returns

`void`

#### Inherited from

[Change](Change.md).[update](Change.md#update)

#### Defined in

[src/UndoRedo/Change.ts:57](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L57)

___

### updateFromJSON

▸ **updateFromJSON**(`j`): `void`

Useful method to update the state of an existing identified `Change` through replication.

**`Note`**

By default it calls the `update` method in the `Change` class, but you can override this if you need to.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |

#### Returns

`void`

#### Inherited from

[Change](Change.md).[updateFromJSON](Change.md#updatefromjson)

#### Defined in

[src/UndoRedo/Change.ts:91](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L91)
