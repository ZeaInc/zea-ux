[@zeainc/zea-ux](../API.md) / ViewCube

# Class: ViewCube

## Hierarchy

- `TreeItem`

  ↳ **`ViewCube`**

## Table of contents

### Constructors

- [constructor](ViewCube.md#constructor)

### Properties

- [pointerOverItem](ViewCube.md#pointeroveritem)
- [viewport](ViewCube.md#viewport)

### Methods

- [alignToVector](ViewCube.md#aligntovector)
- [bindToViewport](ViewCube.md#bindtoviewport)
- [onPointerDown](ViewCube.md#onpointerdown)
- [onPointerMove](ViewCube.md#onpointermove)
- [onPointerUp](ViewCube.md#onpointerup)

## Constructors

### constructor

• **new ViewCube**(`size?`, `roundness?`, `faceColor?`, `edgeColor?`, `cornerColor?`, `labels?`, `fontSize?`, `margin?`)

Create an axial rotation scene widget.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `size` | `number` | `1` | The size value. |
| `roundness` | `number` | `0.15` | - |
| `faceColor` | `Color` | `undefined` | - |
| `edgeColor` | `Color` | `undefined` | - |
| `cornerColor` | `Color` | `undefined` | - |
| `labels` | `Record`<`string`, `string`\> | `undefined` | - |
| `fontSize` | `number` | `30` | - |
| `margin` | `number` | `20` | - |

#### Overrides

TreeItem.constructor

#### Defined in

[src/Handles/ViewCube.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ViewCube.ts#L31)

## Properties

### pointerOverItem

• `Private` **pointerOverItem**: `GeomItem`

#### Defined in

[src/Handles/ViewCube.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ViewCube.ts#L25)

___

### viewport

• **viewport**: `GLViewport`

#### Defined in

[src/Handles/ViewCube.ts:24](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ViewCube.ts#L24)

## Methods

### alignToVector

▸ **alignToVector**(`normal`, `duration?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `normal` | `Vec3` | `undefined` |
| `duration` | `number` | `400` |

#### Returns

`void`

#### Defined in

[src/Handles/ViewCube.ts:267](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ViewCube.ts#L267)

___

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

[src/Handles/ViewCube.ts:226](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ViewCube.ts#L226)

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

[src/Handles/ViewCube.ts:371](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ViewCube.ts#L371)

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

[src/Handles/ViewCube.ts:380](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ViewCube.ts#L380)

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

[src/Handles/ViewCube.ts:389](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ViewCube.ts#L389)
