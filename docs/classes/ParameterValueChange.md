[@zeainc/zea-ux](../API.md) / ParameterValueChange

# Class: ParameterValueChange

Represents a `Change` class for storing `Parameter` values.

**Events**
* **updated:** Triggered when the `ParameterValueChange` value is updated.

## Hierarchy

- [`Change`](Change.md)

  ↳ **`ParameterValueChange`**

## Table of contents

### Constructors

- [constructor](ParameterValueChange.md#constructor)

### Properties

- [name](ParameterValueChange.md#name)
- [nextValue](ParameterValueChange.md#nextvalue)
- [param](ParameterValueChange.md#param)
- [prevValue](ParameterValueChange.md#prevvalue)
- [secondaryChanges](ParameterValueChange.md#secondarychanges)
- [suppressPrimaryChange](ParameterValueChange.md#suppressprimarychange)

### Methods

- [addSecondaryChange](ParameterValueChange.md#addsecondarychange)
- [destroy](ParameterValueChange.md#destroy)
- [fromJSON](ParameterValueChange.md#fromjson)
- [redo](ParameterValueChange.md#redo)
- [toJSON](ParameterValueChange.md#tojson)
- [undo](ParameterValueChange.md#undo)
- [update](ParameterValueChange.md#update)
- [updateFromJSON](ParameterValueChange.md#updatefromjson)

## Constructors

### constructor

• **new ParameterValueChange**(`param?`, `newValue?`)

Creates an instance of ParameterValueChange.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param?` | `Parameter`<`unknown`\> | The param value. |
| `newValue?` | `any` | The newValue value. |

#### Overrides

[Change](Change.md).[constructor](Change.md#constructor)

#### Defined in

[src/UndoRedo/Changes/ParameterValueChange.ts:23](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L23)

## Properties

### name

• **name**: `string`

#### Inherited from

[Change](Change.md).[name](Change.md#name)

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### nextValue

• **nextValue**: `any`

#### Defined in

[src/UndoRedo/Changes/ParameterValueChange.ts:15](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L15)

___

### param

• **param**: `Parameter`<`unknown`\>

#### Defined in

[src/UndoRedo/Changes/ParameterValueChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L14)

___

### prevValue

• **prevValue**: `any`

#### Defined in

[src/UndoRedo/Changes/ParameterValueChange.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L16)

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

[src/UndoRedo/Changes/ParameterValueChange.ts:100](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L100)

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

[src/UndoRedo/Changes/ParameterValueChange.ts:52](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L52)

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

[src/UndoRedo/Changes/ParameterValueChange.ts:78](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L78)

___

### undo

▸ **undo**(): `void`

Rollbacks the value of the parameter to the previous one, passing it to the redo stack in case you wanna recover it later on.

#### Returns

`void`

#### Overrides

[Change](Change.md).[undo](Change.md#undo)

#### Defined in

[src/UndoRedo/Changes/ParameterValueChange.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L40)

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

[src/UndoRedo/Changes/ParameterValueChange.ts:65](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L65)

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

[src/UndoRedo/Changes/ParameterValueChange.ts:120](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/ParameterValueChange.ts#L120)
