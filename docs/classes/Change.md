[@zeainc/zea-ux](../API.md) / Change

# Class: Change

Kind of an abstract class, that represents the mandatory structure of a change classes that are used in the [`UndoRedoManager`]().

**`Note`**

If you don't extend this class, ensure to implement all methods specified in here.

## Hierarchy

- `EventEmitter`

  ↳ **`Change`**

  ↳↳ [`ParameterValueChange`](ParameterValueChange.md)

  ↳↳ [`SelectionChange`](SelectionChange.md)

  ↳↳ [`SelectionVisibilityChange`](SelectionVisibilityChange.md)

  ↳↳ [`TreeItemAddChange`](TreeItemAddChange.md)

  ↳↳ [`TreeItemMoveChange`](TreeItemMoveChange.md)

  ↳↳ [`TreeItemsRemoveChange`](TreeItemsRemoveChange.md)

  ↳↳ [`SelectionXfoChange`](SelectionXfoChange.md)

  ↳↳ [`MeasurementChange`](MeasurementChange.md)

## Table of contents

### Constructors

- [constructor](Change.md#constructor)

### Properties

- [name](Change.md#name)
- [secondaryChanges](Change.md#secondarychanges)
- [suppressPrimaryChange](Change.md#suppressprimarychange)

### Methods

- [addSecondaryChange](Change.md#addsecondarychange)
- [destroy](Change.md#destroy)
- [fromJSON](Change.md#fromjson)
- [redo](Change.md#redo)
- [toJSON](Change.md#tojson)
- [undo](Change.md#undo)
- [update](Change.md#update)
- [updateFromJSON](Change.md#updatefromjson)

## Constructors

### constructor

• **new Change**(`name?`)

Every class that extends from `Change` must contain a global `name` attribute.
It is used by the `UndoRedoManager` factory to re-construct the class of the specific implementation of the `Change` class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | The name value. |

#### Overrides

EventEmitter.constructor

#### Defined in

[src/UndoRedo/Change.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L20)

## Properties

### name

• **name**: `string`

#### Defined in

[src/UndoRedo/Change.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L11)

___

### secondaryChanges

• **secondaryChanges**: [`Change`](Change.md)[] = `[]`

#### Defined in

[src/UndoRedo/Change.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L12)

___

### suppressPrimaryChange

• **suppressPrimaryChange**: `boolean` = `false`

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

#### Defined in

[src/UndoRedo/Change.ts:103](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L103)

___

### fromJSON

▸ **fromJSON**(`j`, `context`): `void`

The counterpart of the `toJSON` method, restoring `Change` instance's state with the specified JSON object.
Each `Change` class must implement the logic for reconstructing itself.
Very often used to restore from persisted/replicated JSON.

**`Note`**

This method needs to be implemented, otherwise it will do nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `Record`<`any`, `any`\> | The j param. |
| `context` | `Record`<`any`, `any`\> | The context param. |

#### Returns

`void`

#### Defined in

[src/UndoRedo/Change.ts:82](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L82)

___

### redo

▸ **redo**(): `void`

Called by the `UndoRedoManager` in the `redo` method, and is the same as the `undo` method, contains the specific code you wanna run.

**`Note`**

This method needs to be implemented, otherwise it will throw an Error.

#### Returns

`void`

#### Defined in

[src/UndoRedo/Change.ts:46](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L46)

___

### toJSON

▸ **toJSON**(`context`): `Record`<`any`, `any`\>

Serializes the `Change` instance as a JSON object, allowing persistence/replication

**`Note`**

This method needs to be implemented, otherwise it will return an empty object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`any`, `any`\> | The appData param. |

#### Returns

`Record`<`any`, `any`\>

#### Defined in

[src/UndoRedo/Change.ts:68](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L68)

___

### undo

▸ **undo**(): `void`

Called by the `UndoRedoManager` in the `undo` method, and contains the code you wanna run when the undo action is triggered,
of course it depends on what you're doing.

**`Note`**

This method needs to be implemented, otherwise it will throw an Error.

#### Returns

`void`

#### Defined in

[src/UndoRedo/Change.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L37)

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

#### Defined in

[src/UndoRedo/Change.ts:91](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/Change.ts#L91)
