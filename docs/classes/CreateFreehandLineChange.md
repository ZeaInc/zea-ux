[@zeainc/zea-ux](../API.md) / CreateFreehandLineChange

# Class: CreateFreehandLineChange

Class representing a create freehand line change.

**Events**
* **updated:** Triggered when the change is updated

## Hierarchy

- `CreateGeomChange`

  ↳ **`CreateFreehandLineChange`**

## Table of contents

### Constructors

- [constructor](CreateFreehandLineChange.md#constructor)

### Properties

- [childIndex](CreateFreehandLineChange.md#childindex)
- [geomItem](CreateFreehandLineChange.md#geomitem)
- [line](CreateFreehandLineChange.md#line)
- [name](CreateFreehandLineChange.md#name)
- [parentItem](CreateFreehandLineChange.md#parentitem)
- [secondaryChanges](CreateFreehandLineChange.md#secondarychanges)
- [suppressPrimaryChange](CreateFreehandLineChange.md#suppressprimarychange)
- [used](CreateFreehandLineChange.md#used)
- [vertexCount](CreateFreehandLineChange.md#vertexcount)

### Methods

- [addSecondaryChange](CreateFreehandLineChange.md#addsecondarychange)
- [destroy](CreateFreehandLineChange.md#destroy)
- [fromJSON](CreateFreehandLineChange.md#fromjson)
- [redo](CreateFreehandLineChange.md#redo)
- [setParentAndXfo](CreateFreehandLineChange.md#setparentandxfo)
- [toJSON](CreateFreehandLineChange.md#tojson)
- [undo](CreateFreehandLineChange.md#undo)
- [update](CreateFreehandLineChange.md#update)
- [updateFromJSON](CreateFreehandLineChange.md#updatefromjson)

## Constructors

### constructor

• **new CreateFreehandLineChange**(`parentItem`, `xfo`, `color`, `thickness?`)

Create a create freehand line change.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `parentItem` | `TreeItem` | `undefined` | The parentItem value. |
| `xfo` | `Xfo` | `undefined` | The xfo value. |
| `color` | `Color` | `undefined` | The color value. |
| `thickness` | `number` | `0.001` | The thickness value. |

#### Overrides

CreateGeomChange.constructor

#### Defined in

[src/Tools/CreateTools/Change/CreateFreehandLineChange.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateFreehandLineChange.ts#L35)

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

### line

• **line**: `Lines`

#### Defined in

[src/Tools/CreateTools/Change/CreateFreehandLineChange.ts:26](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateFreehandLineChange.ts#L26)

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

___

### used

• **used**: `number` = `0`

#### Defined in

[src/Tools/CreateTools/Change/CreateFreehandLineChange.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateFreehandLineChange.ts#L25)

___

### vertexCount

• **vertexCount**: `number` = `100`

#### Defined in

[src/Tools/CreateTools/Change/CreateFreehandLineChange.ts:24](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateFreehandLineChange.ts#L24)

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

Restores free hand line from a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |
| `context` | `Record`<`any`, `any`\> | The appData param. |

#### Returns

`void`

#### Overrides

CreateGeomChange.fromJSON

#### Defined in

[src/Tools/CreateTools/Change/CreateFreehandLineChange.ts:113](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateFreehandLineChange.ts#L113)

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

▸ **toJSON**(`context`): `Record`<`string`, `any`\>

Serializes change as a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`any`, `any`\> | The appData param. |

#### Returns

`Record`<`string`, `any`\>

The return value.

#### Overrides

CreateGeomChange.toJSON

#### Defined in

[src/Tools/CreateTools/Change/CreateFreehandLineChange.ts:99](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateFreehandLineChange.ts#L99)

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

Updates free hand line using the specified data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `updateData` | `Record`<`any`, `any`\> | The updateData param. |

#### Returns

`void`

#### Overrides

CreateGeomChange.update

#### Defined in

[src/Tools/CreateTools/Change/CreateFreehandLineChange.ts:64](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/Change/CreateFreehandLineChange.ts#L64)

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
