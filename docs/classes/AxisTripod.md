[@zeainc/zea-ux](../API.md) / AxisTripod

# Class: AxisTripod

## Hierarchy

- `TreeItem`

  ↳ **`AxisTripod`**

## Table of contents

### Constructors

- [constructor](AxisTripod.md#constructor)

### Properties

- [size](AxisTripod.md#size)

### Methods

- [bindToViewport](AxisTripod.md#bindtoviewport)
- [onPointerDown](AxisTripod.md#onpointerdown)
- [onPointerMove](AxisTripod.md#onpointermove)
- [onPointerUp](AxisTripod.md#onpointerup)

## Constructors

### constructor

• **new AxisTripod**(`size?`)

Create an axial rotation scene widget.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `size` | `number` | `1` | The size value. |

#### Overrides

TreeItem.constructor

#### Defined in

[src/Handles/AxisTripod.ts:24](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxisTripod.ts#L24)

## Properties

### size

• **size**: `number` = `1`

The size value.

#### Defined in

[src/Handles/AxisTripod.ts:24](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxisTripod.ts#L24)

## Methods

### bindToViewport

▸ **bindToViewport**(`renderer`, `viewport`, `pixelOffset?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `renderer` | `GLRenderer` | `undefined` |
| `viewport` | `GLViewport` | `undefined` |
| `pixelOffset` | `number` | `100` |

#### Returns

`void`

#### Defined in

[src/Handles/AxisTripod.ts:61](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxisTripod.ts#L61)

___

### onPointerDown

▸ **onPointerDown**(`event`): `void`

Event fired when a pointing device button is pressed while the pointer is over the handle element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

TreeItem.onPointerDown

#### Defined in

[src/Handles/AxisTripod.ts:106](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxisTripod.ts#L106)

___

### onPointerMove

▸ **onPointerMove**(`event`): `void`

Event fired when a pointing device is moved while the cursor's hotspot is over the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

TreeItem.onPointerMove

#### Defined in

[src/Handles/AxisTripod.ts:115](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxisTripod.ts#L115)

___

### onPointerUp

▸ **onPointerUp**(`event`): `void`

Event fired when a pointing device button is released while the pointer is over the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

TreeItem.onPointerUp

#### Defined in

[src/Handles/AxisTripod.ts:124](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxisTripod.ts#L124)
