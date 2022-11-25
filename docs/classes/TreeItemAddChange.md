[@zeainc/zea-ux](../API.md) / TreeItemAddChange

# Class: TreeItemAddChange

Class representing an `Add TreeItem` Change. Meaning that this should be called when you add a new `TreeItem` to the scene.

## Hierarchy

- [`Change`](Change.md)

  ↳ **`TreeItemAddChange`**

## Table of contents

### Constructors

- [constructor](TreeItemAddChange.md#constructor)

### Properties

- [name](TreeItemAddChange.md#name)
- [owner](TreeItemAddChange.md#owner)
- [prevSelection](TreeItemAddChange.md#prevselection)
- [secondaryChanges](TreeItemAddChange.md#secondarychanges)
- [selectionManager](TreeItemAddChange.md#selectionmanager)
- [suppressPrimaryChange](TreeItemAddChange.md#suppressprimarychange)
- [treeItem](TreeItemAddChange.md#treeitem)
- [treeItemIndex](TreeItemAddChange.md#treeitemindex)

### Methods

- [addSecondaryChange](TreeItemAddChange.md#addsecondarychange)
- [destroy](TreeItemAddChange.md#destroy)
- [fromJSON](TreeItemAddChange.md#fromjson)
- [redo](TreeItemAddChange.md#redo)
- [toJSON](TreeItemAddChange.md#tojson)
- [undo](TreeItemAddChange.md#undo)
- [update](TreeItemAddChange.md#update)
- [updateFromJSON](TreeItemAddChange.md#updatefromjson)

## Constructors

### constructor

• **new TreeItemAddChange**(`treeItem`, `owner`, `selectionManager`)

Creates an instance of TreeItemAddChange.

#### Parameters

| Name | Type |
| :------ | :------ |
| `treeItem` | `TreeItem` |
| `owner` | `TreeItem` |
| `selectionManager` | [`SelectionManager`](SelectionManager.md) |

#### Overrides

[Change](Change.md).[constructor](Change.md#constructor)

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:24](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L24)

## Properties

### name

• **name**: `string`

#### Inherited from

[Change](Change.md).[name](Change.md#name)

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### owner

• **owner**: `TreeItem`

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:13](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L13)

___

### prevSelection

• **prevSelection**: `Set`<`TreeItem`\>

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:14](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L14)

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

[src/UndoRedo/Changes/TreeItemAddChange.ts:15](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L15)

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

[src/UndoRedo/Changes/TreeItemAddChange.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L12)

___

### treeItemIndex

• **treeItemIndex**: `number`

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L16)

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

Removes reference of the `TreeItem` from current change.

#### Returns

`void`

#### Overrides

[Change](Change.md).[destroy](Change.md#destroy)

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:115](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L115)

___

### fromJSON

▸ **fromJSON**(`j`, `context`): `void`

Reconstructs `TreeItem` like parameter from JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j treeItem |
| `context` | `Record`<`any`, `any`\> | The context treeItem |

#### Returns

`void`

#### Overrides

[Change](Change.md).[fromJSON](Change.md#fromjson)

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:99](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L99)

___

### redo

▸ **redo**(): `void`

Restores undone `TreeItem`.

#### Returns

`void`

#### Overrides

[Change](Change.md).[redo](Change.md#redo)

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:60](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L60)

___

### toJSON

▸ **toJSON**(`context`): `Record`<`string`, `any`\>

Serializes `TreeItem` like instanced class into a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`any`, `any`\> | The context treeItem |

#### Returns

`Record`<`string`, `any`\>

- JSON object

#### Overrides

[Change](Change.md).[toJSON](Change.md#tojson)

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:83](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L83)

___

### undo

▸ **undo**(): `void`

Removes the newly added TreeItem from its owner.

#### Returns

`void`

#### Overrides

[Change](Change.md).[undo](Change.md#undo)

#### Defined in

[src/UndoRedo/Changes/TreeItemAddChange.ts:41](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Changes/TreeItemAddChange.ts#L41)

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
