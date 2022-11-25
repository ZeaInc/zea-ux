[@zeainc/zea-ux](../API.md) / CreateConeChange

# Class: CreateConeChange

Class representing a create cone change.

**Events**
* **updated:** Triggered when the change is updated

## Hierarchy

- `CreateGeomChange`

  ↳ **`CreateConeChange`**

## Table of contents

### Constructors

- [constructor](CreateConeChange.md#constructor)

### Properties

- [childIndex](CreateConeChange.md#childindex)
- [geomItem](CreateConeChange.md#geomitem)
- [name](CreateConeChange.md#name)
- [parentItem](CreateConeChange.md#parentitem)
- [secondaryChanges](CreateConeChange.md#secondarychanges)
- [suppressPrimaryChange](CreateConeChange.md#suppressprimarychange)

### Methods

- [addSecondaryChange](CreateConeChange.md#addsecondarychange)
- [destroy](CreateConeChange.md#destroy)
- [fromJSON](CreateConeChange.md#fromjson)
- [redo](CreateConeChange.md#redo)
- [setParentAndXfo](CreateConeChange.md#setparentandxfo)
- [toJSON](CreateConeChange.md#tojson)
- [undo](CreateConeChange.md#undo)
- [update](CreateConeChange.md#update)
- [updateFromJSON](CreateConeChange.md#updatefromjson)

## Constructors

### constructor

• **new CreateConeChange**(`parentItem`, `xfo`, `color`)

Create a create cone change.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentItem` | `TreeItem` | The parentItem value. |
| `xfo` | `Xfo` | The xfo value. |
| `color` | `Color` | - |

#### Overrides

CreateGeomChange.constructor

#### Defined in

[src/Tools/CreateTools/Change/CreateConeChange.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateConeChange.ts#L20)

## Properties

### childIndex

• **childIndex**: `number`

#### Inherited from

CreateGeomChange.childIndex

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L12)

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

▸ **toJSON**(`context?`): `Record`<`any`, `any`\>

Serializes the change as a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context?` | `Record`<`any`, `any`\> | The context value |

#### Returns

`Record`<`any`, `any`\>

- The serialized change

#### Inherited from

CreateGeomChange.toJSON

#### Defined in

[src/Tools/CreateTools/Change/CreateGeomChange.ts:55](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateGeomChange.ts#L55)

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

Updates cone with the specified data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `updateData` | `Record`<`any`, `any`\> | The updateData param. |

#### Returns

`void`

#### Overrides

CreateGeomChange.update

#### Defined in

[src/Tools/CreateTools/Change/CreateConeChange.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateConeChange.ts#L39)

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

CreateGeomChange.updateFromJSON

#### Defined in

[src/UndoRedo/Change.ts:91](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L91)
