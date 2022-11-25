[@zeainc/zea-ux](../API.md) / TreeItemMoveChange

# Class: TreeItemMoveChange

Class representing a `Move TreeItem` Change(Moving a TreeItem from one parent to another).

## Hierarchy

- [`Change`](Change.md)

  ↳ **`TreeItemMoveChange`**

## Table of contents

### Constructors

- [constructor](TreeItemMoveChange.md#constructor)

### Properties

- [name](TreeItemMoveChange.md#name)
- [newOwner](TreeItemMoveChange.md#newowner)
- [oldOwner](TreeItemMoveChange.md#oldowner)
- [oldOwnerIndex](TreeItemMoveChange.md#oldownerindex)
- [secondaryChanges](TreeItemMoveChange.md#secondarychanges)
- [suppressPrimaryChange](TreeItemMoveChange.md#suppressprimarychange)
- [treeItem](TreeItemMoveChange.md#treeitem)

### Methods

- [addSecondaryChange](TreeItemMoveChange.md#addsecondarychange)
- [destroy](TreeItemMoveChange.md#destroy)
- [fromJSON](TreeItemMoveChange.md#fromjson)
- [redo](TreeItemMoveChange.md#redo)
- [toJSON](TreeItemMoveChange.md#tojson)
- [undo](TreeItemMoveChange.md#undo)
- [update](TreeItemMoveChange.md#update)
- [updateFromJSON](TreeItemMoveChange.md#updatefromjson)

## Constructors

### constructor

• **new TreeItemMoveChange**(`treeItem`, `newOwner`)

Creates an instance of TreeItemMoveChange.

**`Memberof`**

TreeItemMoveChange

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `treeItem` | `TreeItem` | The item to move. |
| `newOwner` | `TreeItem` | The new owner item. |

#### Overrides

[Change](Change.md).[constructor](Change.md#constructor)

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:22](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L22)

## Properties

### name

• **name**: `string`

#### Inherited from

[Change](Change.md).[name](Change.md#name)

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### newOwner

• **newOwner**: `TreeItem`

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L14)

___

### oldOwner

• **oldOwner**: `TreeItem`

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L12)

___

### oldOwnerIndex

• **oldOwnerIndex**: `number`

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:13](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L13)

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

### treeItem

• **treeItem**: `TreeItem`

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L11)

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

Restores the Change state from the specified JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`string`, `any`\> | The serialized object with the change data. |
| `context` | `Record`<`string`, `any`\> | The context value |

#### Returns

`void`

#### Overrides

[Change](Change.md).[fromJSON](Change.md#fromjson)

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:71](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L71)

___

### redo

▸ **redo**(): `void`

Executes the move action inserting the TreeItem back to the new owner item.

#### Returns

`void`

#### Overrides

[Change](Change.md).[redo](Change.md#redo)

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:45](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L45)

___

### toJSON

▸ **toJSON**(`context`): `Record`<`string`, `any`\>

Returns a JSON object with the specifications of the change(Typically used for replication).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`string`, `any`\> | The context value |

#### Returns

`Record`<`string`, `any`\>

- JSON object of the change

#### Overrides

[Change](Change.md).[toJSON](Change.md#tojson)

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:55](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L55)

___

### undo

▸ **undo**(): `void`

Inserts back the moved TreeItem in the old owner item(Rollbacks the move action).

#### Returns

`void`

#### Overrides

[Change](Change.md).[undo](Change.md#undo)

#### Defined in

[src/UndoRedo/Changes/TreeItemMoveChange.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemMoveChange.ts#L38)

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
