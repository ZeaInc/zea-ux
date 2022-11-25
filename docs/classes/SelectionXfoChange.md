[@zeainc/zea-ux](../API.md) / SelectionXfoChange

# Class: SelectionXfoChange

Represents a `Change` class for storing `Parameter` values.

**Events**
* **updated:** Triggered when the `SelectionXfoChange` value is updated.

## Hierarchy

- [`Change`](Change.md)

  ↳ **`SelectionXfoChange`**

## Table of contents

### Constructors

- [constructor](SelectionXfoChange.md#constructor)

### Properties

- [baseXfo](SelectionXfoChange.md#basexfo)
- [localXfos](SelectionXfoChange.md#localxfos)
- [name](SelectionXfoChange.md#name)
- [newValues](SelectionXfoChange.md#newvalues)
- [prevValues](SelectionXfoChange.md#prevvalues)
- [secondaryChanges](SelectionXfoChange.md#secondarychanges)
- [suppressPrimaryChange](SelectionXfoChange.md#suppressprimarychange)
- [treeItems](SelectionXfoChange.md#treeitems)

### Methods

- [addSecondaryChange](SelectionXfoChange.md#addsecondarychange)
- [destroy](SelectionXfoChange.md#destroy)
- [fromJSON](SelectionXfoChange.md#fromjson)
- [redo](SelectionXfoChange.md#redo)
- [setDeltaXfo](SelectionXfoChange.md#setdeltaxfo)
- [setDone](SelectionXfoChange.md#setdone)
- [toJSON](SelectionXfoChange.md#tojson)
- [undo](SelectionXfoChange.md#undo)
- [update](SelectionXfoChange.md#update)
- [updateFromJSON](SelectionXfoChange.md#updatefromjson)

## Constructors

### constructor

• **new SelectionXfoChange**(`treeItems`, `baseXfo`)

Creates an instance of SelectionXfoChange.

#### Parameters

| Name | Type |
| :------ | :------ |
| `treeItems` | `TreeItem`[] |
| `baseXfo` | `Xfo` |

#### Overrides

[Change](Change.md).[constructor](Change.md#constructor)

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L25)

## Properties

### baseXfo

• **baseXfo**: `Xfo`

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:15](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L15)

___

### localXfos

• **localXfos**: `Xfo`[] = `[]`

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L16)

___

### name

• **name**: `string`

#### Inherited from

[Change](Change.md).[name](Change.md#name)

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### newValues

• **newValues**: `Xfo`[] = `[]`

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:18](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L18)

___

### prevValues

• **prevValues**: `Xfo`[] = `[]`

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:17](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L17)

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

___

### treeItems

• **treeItems**: `TreeItem`[] = `[]`

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L14)

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

▸ **fromJSON**(`j`, `context`): `Record`<`any`, `any`\>

Restores `Parameter` instance's state with the specified JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |
| `context` | `Record`<`any`, `any`\> | The context param. |

#### Returns

`Record`<`any`, `any`\>

#### Overrides

[Change](Change.md).[fromJSON](Change.md#fromjson)

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:126](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L126)

___

### redo

▸ **redo**(): `void`

Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack
and updating the parameter with the new value.

#### Returns

`void`

#### Overrides

[Change](Change.md).[redo](Change.md#redo)

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:75](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L75)

___

### setDeltaXfo

▸ **setDeltaXfo**(`delta`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `delta` | `Xfo` |

#### Returns

`void`

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L39)

___

### setDone

▸ **setDone**(): `void`

#### Returns

`void`

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:56](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L56)

___

### toJSON

▸ **toJSON**(`context`): `Record`<`any`, `any`\>

Serializes `Parameter` instance value as a JSON object, allowing persistence/replication.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`any`, `any`\> | The context param. |

#### Returns

`Record`<`any`, `any`\>

The return value.

#### Overrides

[Change](Change.md).[toJSON](Change.md#tojson)

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:103](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L103)

___

### undo

▸ **undo**(): `void`

Rollbacks the value of the parameter to the previous one, passing it to the redo stack in case you wanna recover it later on.

#### Returns

`void`

#### Overrides

[Change](Change.md).[undo](Change.md#undo)

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:63](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L63)

___

### update

▸ **update**(`updateData`): `void`

Updates the state of the current parameter change value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `updateData` | `Record`<`string`, `any`\> | The updateData param. |

#### Returns

`void`

#### Overrides

[Change](Change.md).[update](Change.md#update)

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:88](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L88)

___

### updateFromJSON

▸ **updateFromJSON**(`j`): `void`

Updates the state of an existing identified `Parameter` through replication.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |

#### Returns

`void`

#### Overrides

[Change](Change.md).[updateFromJSON](Change.md#updatefromjson)

#### Defined in

[src/UndoRedo/Changes/SelectionXfoChange.ts:147](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/SelectionXfoChange.ts#L147)
