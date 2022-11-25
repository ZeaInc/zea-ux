[@zeainc/zea-ux](../API.md) / CreateSphereChange

# Class: CreateSphereChange

Class representing a create sphere change.

**Events**
* **updated:** Triggered when the change is updated

## Hierarchy

- `CreateGeomChange`

  ↳ **`CreateSphereChange`**

## Table of contents

### Constructors

- [constructor](CreateSphereChange.md#constructor)

### Properties

- [childIndex](CreateSphereChange.md#childindex)
- [geomItem](CreateSphereChange.md#geomitem)
- [name](CreateSphereChange.md#name)
- [parentItem](CreateSphereChange.md#parentitem)
- [secondaryChanges](CreateSphereChange.md#secondarychanges)
- [sphere](CreateSphereChange.md#sphere)
- [suppressPrimaryChange](CreateSphereChange.md#suppressprimarychange)

### Methods

- [addSecondaryChange](CreateSphereChange.md#addsecondarychange)
- [destroy](CreateSphereChange.md#destroy)
- [fromJSON](CreateSphereChange.md#fromjson)
- [redo](CreateSphereChange.md#redo)
- [setParentAndXfo](CreateSphereChange.md#setparentandxfo)
- [toJSON](CreateSphereChange.md#tojson)
- [undo](CreateSphereChange.md#undo)
- [update](CreateSphereChange.md#update)
- [updateFromJSON](CreateSphereChange.md#updatefromjson)

## Constructors

### constructor

• **new CreateSphereChange**(`parentItem`, `xfo`, `color`)

Create a create sphere change.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentItem` | `TreeItem` | The parentItem value. |
| `xfo` | `Xfo` | The xfo value. |
| `color` | `Color` | The color of the sphere to create. |

#### Overrides

CreateGeomChange.constructor

#### Defined in

[src/Tools/CreateTools/Change/CreateSphereChange.ts:21](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateSphereChange.ts#L21)

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

### sphere

• **sphere**: `Sphere`

#### Defined in

[src/Tools/CreateTools/Change/CreateSphereChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateSphereChange.ts#L14)

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

Serializes sphere geometry as a JSON object.

#### Returns

`Record`<`any`, `any`\>

The return value.

#### Overrides

CreateGeomChange.toJSON

#### Defined in

[src/Tools/CreateTools/Change/CreateSphereChange.ts:50](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateSphereChange.ts#L50)

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

Updates sphere geometry using the specified data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `updateData` | `Record`<`any`, `any`\> | The updateData param. |

#### Returns

`void`

#### Overrides

CreateGeomChange.update

#### Defined in

[src/Tools/CreateTools/Change/CreateSphereChange.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateSphereChange.ts#L39)

___

### updateFromJSON

▸ **updateFromJSON**(`j`): `void`

Updates sphere geometry using a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |

#### Returns

`void`

#### Overrides

CreateGeomChange.updateFromJSON

#### Defined in

[src/Tools/CreateTools/Change/CreateSphereChange.ts:61](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateSphereChange.ts#L61)
