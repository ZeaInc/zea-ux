[@zeainc/zea-ux](../API.md) / CreateCircleChange

# Class: CreateCircleChange

Class representing a create circle change.

**Events**
* **updated:** Triggered when the change is updated

## Hierarchy

- `CreateGeomChange`

  ↳ **`CreateCircleChange`**

## Table of contents

### Constructors

- [constructor](CreateCircleChange.md#constructor)

### Properties

- [childIndex](CreateCircleChange.md#childindex)
- [circle](CreateCircleChange.md#circle)
- [geomItem](CreateCircleChange.md#geomitem)
- [name](CreateCircleChange.md#name)
- [parentItem](CreateCircleChange.md#parentitem)
- [secondaryChanges](CreateCircleChange.md#secondarychanges)
- [suppressPrimaryChange](CreateCircleChange.md#suppressprimarychange)

### Methods

- [addSecondaryChange](CreateCircleChange.md#addsecondarychange)
- [destroy](CreateCircleChange.md#destroy)
- [fromJSON](CreateCircleChange.md#fromjson)
- [redo](CreateCircleChange.md#redo)
- [setParentAndXfo](CreateCircleChange.md#setparentandxfo)
- [toJSON](CreateCircleChange.md#tojson)
- [undo](CreateCircleChange.md#undo)
- [update](CreateCircleChange.md#update)
- [updateFromJSON](CreateCircleChange.md#updatefromjson)

## Constructors

### constructor

• **new CreateCircleChange**(`parentItem`, `xfo`)

Creates an instance of CreateCircleChange.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentItem` | `TreeItem` | The parentItem value. |
| `xfo` | `Xfo` | The xfo value. |

#### Overrides

CreateGeomChange.constructor

#### Defined in

[src/Tools/CreateTools/Change/CreateCircleChange.ts:21](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateCircleChange.ts#L21)

## Properties

### childIndex

• **childIndex**: `number`

#### Inherited from

CreateGeomChange.childIndex

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L12)

___

### circle

• **circle**: `Circle`

#### Defined in

[src/Tools/CreateTools/Change/CreateCircleChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateCircleChange.ts#L14)

___

### geomItem

• **geomItem**: `GeomItem`

#### Inherited from

CreateGeomChange.geomItem

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L11)

___

### name

• **name**: `string`

#### Inherited from

CreateGeomChange.name

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### parentItem

• **parentItem**: `TreeItem`

#### Inherited from

CreateGeomChange.parentItem

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:10](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L10)

___

### secondaryChanges

• **secondaryChanges**: [`Change`](Change.md)[] = `[]`

#### Inherited from

CreateGeomChange.secondaryChanges

#### Defined in

[src/UndoRedo/Change.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L12)

___

### suppressPrimaryChange

• **suppressPrimaryChange**: `boolean` = `false`

#### Inherited from

CreateGeomChange.suppressPrimaryChange

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

CreateGeomChange.addSecondaryChange

#### Defined in

[src/UndoRedo/Change.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L25)

___

### destroy

▸ **destroy**(): `void`

Removes geometry item reference from change change.

#### Returns

`void`

#### Inherited from

CreateGeomChange.destroy

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:99](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L99)

___

### fromJSON

▸ **fromJSON**(`j`, `context`): `void`

Restores geometry from using the specified JSON

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |
| `context` | `Record`<`any`, `any`\> | The appData param. |

#### Returns

`void`

#### Inherited from

CreateGeomChange.fromJSON

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:72](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L72)

___

### redo

▸ **redo**(): `void`

Restores recently created geometry and adds it to the specified parent tree item.

#### Returns

`void`

#### Inherited from

CreateGeomChange.redo

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:45](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L45)

___

### setParentAndXfo

▸ **setParentAndXfo**(`parentItem`, `xfo`): `void`

The setParentAndXfo method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentItem` | `TreeItem` | The parentItem param. |
| `xfo` | `Xfo` | The xfo param. |

#### Returns

`void`

#### Inherited from

CreateGeomChange.setParentAndXfo

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L27)

___

### toJSON

▸ **toJSON**(): `Record`<`any`, `any`\>

Serializes change as a JSON object.

#### Returns

`Record`<`any`, `any`\>

- The return value.

#### Overrides

CreateGeomChange.toJSON

#### Defined in

[src/Tools/CreateTools/Change/CreateCircleChange.ts:49](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateCircleChange.ts#L49)

___

### undo

▸ **undo**(): `void`

Removes recently created geometry from its parent.

#### Returns

`void`

#### Inherited from

CreateGeomChange.undo

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L38)

___

### update

▸ **update**(`updateData`): `void`

Updates circle with the specified data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `updateData` | `Record`<`any`, `any`\> | The updateData param. |

#### Returns

`void`

#### Overrides

CreateGeomChange.update

#### Defined in

[src/Tools/CreateTools/Change/CreateCircleChange.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateCircleChange.ts#L39)

___

### updateFromJSON

▸ **updateFromJSON**(`j`): `void`

Updates circle with the specified JSON

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |

#### Returns

`void`

#### Overrides

CreateGeomChange.updateFromJSON

#### Defined in

[src/Tools/CreateTools/Change/CreateCircleChange.ts:60](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateCircleChange.ts#L60)
