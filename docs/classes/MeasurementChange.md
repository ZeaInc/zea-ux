[@zeainc/zea-ux](../API.md) / MeasurementChange

# Class: MeasurementChange

Represents a Measurement change.

## Hierarchy

- [`Change`](Change.md)

  ↳ **`MeasurementChange`**

## Table of contents

### Constructors

- [constructor](MeasurementChange.md#constructor)

### Properties

- [childIndex](MeasurementChange.md#childindex)
- [measurement](MeasurementChange.md#measurement)
- [measurementType](MeasurementChange.md#measurementtype)
- [name](MeasurementChange.md#name)
- [parentItem](MeasurementChange.md#parentitem)
- [parentItemPath](MeasurementChange.md#parentitempath)
- [secondaryChanges](MeasurementChange.md#secondarychanges)
- [suppressPrimaryChange](MeasurementChange.md#suppressprimarychange)

### Methods

- [addSecondaryChange](MeasurementChange.md#addsecondarychange)
- [destroy](MeasurementChange.md#destroy)
- [end](MeasurementChange.md#end)
- [fromJSON](MeasurementChange.md#fromjson)
- [redo](MeasurementChange.md#redo)
- [toJSON](MeasurementChange.md#tojson)
- [undo](MeasurementChange.md#undo)
- [update](MeasurementChange.md#update)
- [updateFromJSON](MeasurementChange.md#updatefromjson)

## Constructors

### constructor

• **new MeasurementChange**(`measurement`)

Creates an instance of MeasurementChange.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `measurement` | `TreeItem` | The parent that the measurement will be added to. |

#### Overrides

[Change](Change.md).[constructor](Change.md#constructor)

#### Defined in

[src/Measurement/MeasurementChange.ts:21](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L21)

## Properties

### childIndex

• **childIndex**: `number`

#### Defined in

[src/Measurement/MeasurementChange.ts:15](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L15)

___

### measurement

• **measurement**: [`MeasureDistance`](MeasureDistance.md)

#### Defined in

[src/Measurement/MeasurementChange.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L11)

___

### measurementType

• **measurementType**: `string`

#### Defined in

[src/Measurement/MeasurementChange.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L12)

___

### name

• **name**: `string`

#### Inherited from

[Change](Change.md).[name](Change.md#name)

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### parentItem

• **parentItem**: `TreeItem`

#### Defined in

[src/Measurement/MeasurementChange.ts:13](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L13)

___

### parentItemPath

• **parentItemPath**: `string`[]

#### Defined in

[src/Measurement/MeasurementChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L14)

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

Removes geometry item reference from change change.

#### Returns

`void`

#### Overrides

[Change](Change.md).[destroy](Change.md#destroy)

#### Defined in

[src/Measurement/MeasurementChange.ts:98](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L98)

___

### end

▸ **end**(): `void`

#### Returns

`void`

#### Defined in

[src/Measurement/MeasurementChange.ts:43](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L43)

___

### fromJSON

▸ **fromJSON**(`j`, `context`): `void`

Restores geometry from using the specified JSON

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`string`, `any`\> | The j param. |
| `context` | `Record`<`string`, `any`\> | The appData param. |

#### Returns

`void`

#### Overrides

[Change](Change.md).[fromJSON](Change.md#fromjson)

#### Defined in

[src/Measurement/MeasurementChange.ts:85](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L85)

___

### redo

▸ **redo**(): `void`

Restores recently created geometry and adds it to the specified parent tree item.

#### Returns

`void`

#### Overrides

[Change](Change.md).[redo](Change.md#redo)

#### Defined in

[src/Measurement/MeasurementChange.ts:60](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L60)

___

### toJSON

▸ **toJSON**(`context`): `Record`<`string`, `any`\>

Serializes the change as a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`any`, `any`\> | The context value |

#### Returns

`Record`<`string`, `any`\>

- The serialized change

#### Overrides

[Change](Change.md).[toJSON](Change.md#tojson)

#### Defined in

[src/Measurement/MeasurementChange.ts:71](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L71)

___

### undo

▸ **undo**(): `void`

Removes recently created geometry from its parent.

#### Returns

`void`

#### Overrides

[Change](Change.md).[undo](Change.md#undo)

#### Defined in

[src/Measurement/MeasurementChange.ts:50](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L50)

___

### update

▸ **update**(`data`): `void`

**`Memberof`**

MeasurementChange

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Record`<`string`, `any`\> | An object containing potentially the start and end positions. |

#### Returns

`void`

#### Overrides

[Change](Change.md).[update](Change.md#update)

#### Defined in

[src/Measurement/MeasurementChange.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasurementChange.ts#L35)

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
