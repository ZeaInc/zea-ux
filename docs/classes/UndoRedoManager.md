[@zeainc/zea-ux](../API.md) / UndoRedoManager

# Class: UndoRedoManager

`UndoRedoManager` is a mixture of the [Factory Design Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) and the actual changes stacks manager.
This is the heart of the Undo/Redo System, letting you navigate through the changes history you've saved.

**Events**
* **changeAdded:** Triggered when a change is added.
* **changeUpdated:** Triggered when the last change added updates its state.
* **changeUndone:** Triggered when the `undo` method is called, after removing the last change from the stack.
* **changeRedone:** Triggered when the `redo` method is called, after restoring the last change removed from the undo stack.

## Hierarchy

- `EventEmitter`

  ↳ **`UndoRedoManager`**

## Table of contents

### Constructors

- [constructor](UndoRedoManager.md#constructor)

### Properties

- [\_\_currChange](UndoRedoManager.md#__currchange)
- [\_\_redoStack](UndoRedoManager.md#__redostack)
- [\_\_undoStack](UndoRedoManager.md#__undostack)

### Methods

- [\_\_currChangeUpdated](UndoRedoManager.md#__currchangeupdated)
- [addChange](UndoRedoManager.md#addchange)
- [cancel](UndoRedoManager.md#cancel)
- [constructChange](UndoRedoManager.md#constructchange)
- [flush](UndoRedoManager.md#flush)
- [getCurrentChange](UndoRedoManager.md#getcurrentchange)
- [redo](UndoRedoManager.md#redo)
- [undo](UndoRedoManager.md#undo)
- [getChangeClassName](UndoRedoManager.md#getchangeclassname)
- [getInstance](UndoRedoManager.md#getinstance)
- [isChangeClassRegistered](UndoRedoManager.md#ischangeclassregistered)
- [registerChange](UndoRedoManager.md#registerchange)

## Constructors

### constructor

• **new UndoRedoManager**()

It doesn't have any parameters, but under the hood it uses [EventsEmitter]() to notify subscribers when something happens.
The implementation is really simple, just initialize it like any other class.

#### Overrides

EventEmitter.constructor

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:22](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L22)

## Properties

### \_\_currChange

• **\_\_currChange**: [`Change`](Change.md) = `null`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:17](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L17)

___

### \_\_redoStack

• **\_\_redoStack**: [`Change`](Change.md)[] = `[]`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L16)

___

### \_\_undoStack

• **\_\_undoStack**: [`Change`](Change.md)[] = `[]`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:15](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L15)

## Methods

### \_\_currChangeUpdated

▸ `Private` **__currChangeUpdated**(`updateData`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `updateData` | `Record`<`any`, `any`\> |

#### Returns

`void`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:79](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L79)

___

### addChange

▸ **addChange**(`change`): `void`

Receives an instance of a class that extends or has the same structure as `Change` class.
When this action happens, the last added change update notifications will get disconnected.
Which implies that any future updates to changes that are not the last one, would need a new call to the `addChange` method.
Also, resets the redo stack(Calls destroy method when doing it).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `change` | [`Change`](Change.md) | The change param. |

#### Returns

`void`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:50](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L50)

___

### cancel

▸ **cancel**(): `void`

Method to cancel the current change added to the UndoRedoManager.
Reverts the change and discards it.

#### Returns

`void`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:109](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L109)

___

### constructChange

▸ **constructChange**(`className`): [`Change`](Change.md)

Basically returns a new instance of the derived `Change` class. This is why we need the `name` attribute.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `className` | `string` | The className param. |

#### Returns

[`Change`](Change.md)

- The return value.

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:144](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L144)

___

### flush

▸ **flush**(): `void`

As the name indicates, it empties undo/redo stacks permanently, losing all stored actions.
Right now, before flushing the stacks it calls the `destroy` method on all changes, ensure to at least declare it.

#### Returns

`void`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L31)

___

### getCurrentChange

▸ **getCurrentChange**(): [`Change`](Change.md)

Returns the last change added to the undo stack, but in case it is empty a `null` is returned.

#### Returns

[`Change`](Change.md)

The return value.

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:71](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L71)

___

### redo

▸ **redo**(): `void`

Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack.
Emits the `changeRedone` event, if you want to subscribe to it.

#### Returns

`void`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:125](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L125)

___

### undo

▸ **undo**(`pushOnRedoStack?`): `void`

Rollback the latest action, passing it to the redo stack in case you wanna recover it later on.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pushOnRedoStack` | `boolean` | `true` | The pushOnRedoStack param. |

#### Returns

`void`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:88](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L88)

___

### getChangeClassName

▸ `Static` **getChangeClassName**(`inst`): `string`

Very simple method that returns the name of the instantiated class, checking first in the registry and returning if found,
if not then checks the `name` attribute declared in constructor.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inst` | [`Change`](Change.md) | The instance of the Change class. |

#### Returns

`string`

- The return value.

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:172](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L172)

___

### getInstance

▸ `Static` **getInstance**(): [`UndoRedoManager`](UndoRedoManager.md)

#### Returns

[`UndoRedoManager`](UndoRedoManager.md)

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:189](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L189)

___

### isChangeClassRegistered

▸ `Static` **isChangeClassRegistered**(`inst`): `boolean`

Checks if a class of an instantiated object is registered in the UndoRedo Factory.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inst` | [`Change`](Change.md) | The instance of the Change class. |

#### Returns

`boolean`

- Returns 'true' if the class has been registered.

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:155](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L155)

___

### registerChange

▸ `Static` **registerChange**(`name`, `cls`): `void`

Registers the class in the UndoRedoManager Factory.
Why do we need to specify the name of the class?
Because when the code is transpiled, the defined class names change, so it won't be known as we declared it anymore.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name param. |
| `cls` | `any` | The cls param. |

#### Returns

`void`

#### Defined in

[src/UndoRedo/UndoRedoManager.ts:185](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/UndoRedo/UndoRedoManager.ts#L185)
