[@zeainc/zea-ux](../API.md) / TreeItemsRemoveChange

# Class: TreeItemsRemoveChange

Class representing a TreeItems removal Change,
taking into account that it would remove all the specified items ti their children

## Hierarchy

- [`Change`](Change.md)

  ↳ **`TreeItemsRemoveChange`**

## Table of contents

### Constructors

- [constructor](TreeItemsRemoveChange.md#constructor)

### Properties

- [itemIndices](TreeItemsRemoveChange.md#itemindices)
- [itemOwners](TreeItemsRemoveChange.md#itemowners)
- [itemPaths](TreeItemsRemoveChange.md#itempaths)
- [items](TreeItemsRemoveChange.md#items)
- [name](TreeItemsRemoveChange.md#name)
- [newSelection](TreeItemsRemoveChange.md#newselection)
- [prevSelection](TreeItemsRemoveChange.md#prevselection)
- [secondaryChanges](TreeItemsRemoveChange.md#secondarychanges)
- [selectionManager](TreeItemsRemoveChange.md#selectionmanager)
- [suppressPrimaryChange](TreeItemsRemoveChange.md#suppressprimarychange)

### Methods

- [addSecondaryChange](TreeItemsRemoveChange.md#addsecondarychange)
- [destroy](TreeItemsRemoveChange.md#destroy)
- [fromJSON](TreeItemsRemoveChange.md#fromjson)
- [redo](TreeItemsRemoveChange.md#redo)
- [toJSON](TreeItemsRemoveChange.md#tojson)
- [undo](TreeItemsRemoveChange.md#undo)
- [update](TreeItemsRemoveChange.md#update)
- [updateFromJSON](TreeItemsRemoveChange.md#updatefromjson)

## Constructors

### constructor

• **new TreeItemsRemoveChange**(`items`, `appData`)

Creates an instance of TreeItemsRemoveChange.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | `TreeItem`[] | List of TreeItems |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value |

#### Overrides

[Change](Change.md).[constructor](Change.md#constructor)

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L28)

## Properties

### itemIndices

• **itemIndices**: `number`[] = `[]`

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:17](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L17)

___

### itemOwners

• **itemOwners**: `TreeItem`[] = `[]`

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:15](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L15)

___

### itemPaths

• **itemPaths**: `string`[][] = `[]`

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L16)

___

### items

• **items**: `TreeItem`[] = `[]`

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L14)

___

### name

• **name**: `string`

#### Inherited from

[Change](Change.md).[name](Change.md#name)

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### newSelection

• **newSelection**: `Set`<`TreeItem`\>

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:21](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L21)

___

### prevSelection

• **prevSelection**: `Set`<`TreeItem`\>

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L20)

___

### secondaryChanges

• **secondaryChanges**: [`Change`](Change.md)[] = `[]`

#### Inherited from

[Change](Change.md).[secondaryChanges](Change.md#secondarychanges)

#### Defined in

[src/UndoRedo/Change.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L12)

___

### selectionManager

• **selectionManager**: [`SelectionManager`](SelectionManager.md)

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L19)

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

The destroy method cleans up any data requiring manual cleanup.
Deleted items still on the undo stack are then flushed and any
GPU resources cleaned up.

#### Returns

`void`

#### Overrides

[Change](Change.md).[destroy](Change.md#destroy)

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:162](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L162)

___

### fromJSON

▸ **fromJSON**(`j`, `appData`): `void`

Restores Change action from a JSON object.

**`Memberof`**

TreeItemsRemoveChange

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`string`, `any`\> | The JSON object with Change data. |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value |

#### Returns

`void`

#### Overrides

[Change](Change.md).[fromJSON](Change.md#fromjson)

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:142](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L142)

___

### redo

▸ **redo**(): `void`

Executes initial change to remove items from their owners.

#### Returns

`void`

#### Overrides

[Change](Change.md).[redo](Change.md#redo)

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:94](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L94)

___

### toJSON

▸ **toJSON**(`appData`): `Record`<`string`, `any`\>

Serializes current change data as a JSON object, so this action can be stored/replicated somewhere else.

**`Memberof`**

TreeItemsRemoveChange

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value |

#### Returns

`Record`<`string`, `any`\>

- JSON Object representation of current change

#### Overrides

[Change](Change.md).[toJSON](Change.md#tojson)

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:122](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L122)

___

### undo

▸ **undo**(): `void`

Restores all items removed in the change, reattaching them to their old owners.

#### Returns

`void`

#### Overrides

[Change](Change.md).[undo](Change.md#undo)

#### Defined in

[src/UndoRedo/Changes/TreeItemsRemoveChange.ts:71](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemsRemoveChange.ts#L71)

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
