[@zeainc/zea-ux](../API.md) / SelectionVisibilityChange

# Class: SelectionVisibilityChange

Class representing a change of visibility state for selected items.

## Hierarchy

- [`Change`](Change.md)

  ↳ **`SelectionVisibilityChange`**

## Table of contents

### Constructors

- [constructor](SelectionVisibilityChange.md#constructor)

### Properties

- [name](SelectionVisibilityChange.md#name)
- [secondaryChanges](SelectionVisibilityChange.md#secondarychanges)
- [selection](SelectionVisibilityChange.md#selection)
- [state](SelectionVisibilityChange.md#state)
- [suppressPrimaryChange](SelectionVisibilityChange.md#suppressprimarychange)

### Methods

- [\_changeItemsVisibility](SelectionVisibilityChange.md#_changeitemsvisibility)
- [addSecondaryChange](SelectionVisibilityChange.md#addsecondarychange)
- [destroy](SelectionVisibilityChange.md#destroy)
- [fromJSON](SelectionVisibilityChange.md#fromjson)
- [redo](SelectionVisibilityChange.md#redo)
- [toJSON](SelectionVisibilityChange.md#tojson)
- [undo](SelectionVisibilityChange.md#undo)
- [update](SelectionVisibilityChange.md#update)
- [updateFromJSON](SelectionVisibilityChange.md#updatefromjson)

## Constructors

### constructor

• **new SelectionVisibilityChange**(`selection`, `state`)

Create a toggle selection visibility.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selection` | `Set`<`TreeItem`\> | The selection value. |
| `state` | `boolean` | The state value. |

#### Overrides

[Change](Change.md).[constructor](Change.md#constructor)

#### Defined in

[src/UndoRedo/Changes/SelectionVisibilityChange.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionVisibilityChange.ts#L19)

## Properties

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

### selection

• **selection**: `Set`<`TreeItem`\>

#### Defined in

[src/UndoRedo/Changes/SelectionVisibilityChange.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionVisibilityChange.ts#L11)

___

### state

• **state**: `boolean`

#### Defined in

[src/UndoRedo/Changes/SelectionVisibilityChange.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionVisibilityChange.ts#L12)

___

### suppressPrimaryChange

• **suppressPrimaryChange**: `boolean` = `false`

#### Inherited from

[Change](Change.md).[suppressPrimaryChange](Change.md#suppressprimarychange)

#### Defined in

[src/UndoRedo/Change.ts:13](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L13)

## Methods

### \_changeItemsVisibility

▸ `Private` **_changeItemsVisibility**(`state`): `void`

Changes items visibility.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `boolean` | The state param. |

#### Returns

`void`

#### Defined in

[src/UndoRedo/Changes/SelectionVisibilityChange.ts:46](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionVisibilityChange.ts#L46)

___

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

The counterpart of the `toJSON` method, restoring `Change` instance's state with the specified JSON object.
Each `Change` class must implement the logic for reconstructing itself.
Very often used to restore from persisted/replicated JSON.

**`Note`**

This method needs to be implemented, otherwise it will do nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |
| `context` | `Record`<`any`, `any`\> | The context param. |

#### Returns

`void`

#### Inherited from

[Change](Change.md).[fromJSON](Change.md#fromjson)

#### Defined in

[src/UndoRedo/Change.ts:82](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L82)

___

### redo

▸ **redo**(): `void`

Recreates previous visibility status of the selected items

#### Returns

`void`

#### Overrides

[Change](Change.md).[redo](Change.md#redo)

#### Defined in

[src/UndoRedo/Changes/SelectionVisibilityChange.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionVisibilityChange.ts#L36)

___

### toJSON

▸ **toJSON**(`context`): `Record`<`any`, `any`\>

Serializes the `Change` instance as a JSON object, allowing persistence/replication

**`Note`**

This method needs to be implemented, otherwise it will return an empty object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`any`, `any`\> | The appData param. |

#### Returns

`Record`<`any`, `any`\>

#### Inherited from

[Change](Change.md).[toJSON](Change.md#tojson)

#### Defined in

[src/UndoRedo/Change.ts:68](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L68)

___

### undo

▸ **undo**(): `void`

Restores previous visibility status of the selected items

#### Returns

`void`

#### Overrides

[Change](Change.md).[undo](Change.md#undo)

#### Defined in

[src/UndoRedo/Changes/SelectionVisibilityChange.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionVisibilityChange.ts#L29)

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
