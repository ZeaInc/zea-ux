[@zeainc/zea-ux](../API.md) / MeasureAngleTool

# Class: MeasureAngleTool

UI Tool for measurements

## Hierarchy

- `MeasureTool`

  ↳ **`MeasureAngleTool`**

## Table of contents

### Constructors

- [constructor](MeasureAngleTool.md#constructor)

### Properties

- [appData](MeasureAngleTool.md#appdata)
- [colorParam](MeasureAngleTool.md#colorparam)
- [dragging](MeasureAngleTool.md#dragging)
- [geomConstraints](MeasureAngleTool.md#geomconstraints)
- [highlightedItemA](MeasureAngleTool.md#highlighteditema)
- [highlightedItemAHitPos](MeasureAngleTool.md#highlighteditemahitpos)
- [highlightedItemA\_componentId](MeasureAngleTool.md#highlighteditema_componentid)
- [highlightedItemA\_highlightKey](MeasureAngleTool.md#highlighteditema_highlightkey)
- [highlightedItemA\_params](MeasureAngleTool.md#highlighteditema_params)
- [highlightedItemB](MeasureAngleTool.md#highlighteditemb)
- [highlightedItemB\_componentId](MeasureAngleTool.md#highlighteditemb_componentid)
- [highlightedItemB\_highlightKey](MeasureAngleTool.md#highlighteditemb_highlightkey)
- [highlightedItemB\_params](MeasureAngleTool.md#highlighteditemb_params)
- [hitPosA](MeasureAngleTool.md#hitposa)
- [measurement](MeasureAngleTool.md#measurement)
- [measurementChange](MeasureAngleTool.md#measurementchange)
- [numStages](MeasureAngleTool.md#numstages)
- [stage](MeasureAngleTool.md#stage)

### Methods

- [activateTool](MeasureAngleTool.md#activatetool)
- [checkGeom](MeasureAngleTool.md#checkgeom)
- [deactivateTool](MeasureAngleTool.md#deactivatetool)
- [getGeomParams](MeasureAngleTool.md#getgeomparams)
- [getGeomParamsSync](MeasureAngleTool.md#getgeomparamssync)
- [getGeomXfo](MeasureAngleTool.md#getgeomxfo)
- [onPointerDown](MeasureAngleTool.md#onpointerdown)
- [onPointerMove](MeasureAngleTool.md#onpointermove)
- [onPointerUp](MeasureAngleTool.md#onpointerup)
- [snapToSurface](MeasureAngleTool.md#snaptosurface)

## Constructors

### constructor

• **new MeasureAngleTool**(`appData`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value |

#### Overrides

MeasureTool.constructor

#### Defined in

[src/Measurement/MeasureAngleTool.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngleTool.ts#L36)

## Properties

### appData

• `Protected` **appData**: [`AppData`](../interfaces/AppData.md)

#### Inherited from

MeasureTool.appData

#### Defined in

[src/Measurement/MeasureTool.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L29)

___

### colorParam

• **colorParam**: `ColorParameter`

#### Inherited from

MeasureTool.colorParam

#### Defined in

[src/Measurement/MeasureTool.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L30)

___

### dragging

• **dragging**: `boolean`

#### Defined in

[src/Measurement/MeasureAngleTool.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngleTool.ts#L31)

___

### geomConstraints

• `Protected` **geomConstraints**: `Record`<`string`, `string`[]\> = `{}`

#### Inherited from

MeasureTool.geomConstraints

#### Defined in

[src/Measurement/MeasureTool.ts:47](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L47)

___

### highlightedItemA

• `Protected` **highlightedItemA**: `GeomItem`

#### Inherited from

MeasureTool.highlightedItemA

#### Defined in

[src/Measurement/MeasureTool.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L34)

___

### highlightedItemAHitPos

• **highlightedItemAHitPos**: `any` = `null`

#### Defined in

[src/Measurement/MeasureAngleTool.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngleTool.ts#L29)

___

### highlightedItemA\_componentId

• `Protected` **highlightedItemA\_componentId**: `number`

#### Inherited from

MeasureTool.highlightedItemA\_componentId

#### Defined in

[src/Measurement/MeasureTool.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L36)

___

### highlightedItemA\_highlightKey

• `Protected` **highlightedItemA\_highlightKey**: `string`

#### Inherited from

MeasureTool.highlightedItemA\_highlightKey

#### Defined in

[src/Measurement/MeasureTool.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L37)

___

### highlightedItemA\_params

• `Protected` **highlightedItemA\_params**: `ParameterOwner`

#### Inherited from

MeasureTool.highlightedItemA\_params

#### Defined in

[src/Measurement/MeasureTool.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L35)

___

### highlightedItemB

• `Protected` **highlightedItemB**: `GeomItem`

#### Inherited from

MeasureTool.highlightedItemB

#### Defined in

[src/Measurement/MeasureTool.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L38)

___

### highlightedItemB\_componentId

• `Protected` **highlightedItemB\_componentId**: `number`

#### Inherited from

MeasureTool.highlightedItemB\_componentId

#### Defined in

[src/Measurement/MeasureTool.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L40)

___

### highlightedItemB\_highlightKey

• `Protected` **highlightedItemB\_highlightKey**: `string`

#### Inherited from

MeasureTool.highlightedItemB\_highlightKey

#### Defined in

[src/Measurement/MeasureTool.ts:41](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L41)

___

### highlightedItemB\_params

• `Protected` **highlightedItemB\_params**: `ParameterOwner`

#### Inherited from

MeasureTool.highlightedItemB\_params

#### Defined in

[src/Measurement/MeasureTool.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L39)

___

### hitPosA

• **hitPosA**: `Vec3`

#### Defined in

[src/Measurement/MeasureAngleTool.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngleTool.ts#L30)

___

### measurement

• `Protected` **measurement**: `Measure`

#### Inherited from

MeasureTool.measurement

#### Defined in

[src/Measurement/MeasureTool.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L32)

___

### measurementChange

• `Protected` **measurementChange**: [`MeasurementChange`](MeasurementChange.md)

#### Inherited from

MeasureTool.measurementChange

#### Defined in

[src/Measurement/MeasureTool.ts:33](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L33)

___

### numStages

• `Protected` **numStages**: `number` = `1`

#### Inherited from

MeasureTool.numStages

#### Defined in

[src/Measurement/MeasureTool.ts:44](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L44)

___

### stage

• `Protected` **stage**: `number` = `0`

#### Inherited from

MeasureTool.stage

#### Defined in

[src/Measurement/MeasureTool.ts:43](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L43)

## Methods

### activateTool

▸ **activateTool**(): `void`

The activateTool method.

#### Returns

`void`

#### Inherited from

MeasureTool.activateTool

#### Defined in

[src/Measurement/MeasureTool.ts:70](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L70)

___

### checkGeom

▸ **checkGeom**(`geomItem`, `componentId?`): `Promise`<`ParameterOwner`\>

Checks to see if the surface is appropriate for this kind of measurement.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `geomItem` | `GeomItem` | `undefined` | The geomItem to check |
| `componentId` | `number` | `-1` | - |

#### Returns

`Promise`<`ParameterOwner`\>

#### Inherited from

MeasureTool.checkGeom

#### Defined in

[src/Measurement/MeasureTool.ts:162](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L162)

___

### deactivateTool

▸ **deactivateTool**(): `void`

The deactivateTool method.

#### Returns

`void`

#### Inherited from

MeasureTool.deactivateTool

#### Defined in

[src/Measurement/MeasureTool.ts:81](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L81)

___

### getGeomParams

▸ `Protected` **getGeomParams**(`geomItem`, `componentId?`): `Promise`<`ParameterOwner`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `geomItem` | `GeomItem` | `undefined` |
| `componentId` | `number` | `-1` |

#### Returns

`Promise`<`ParameterOwner`\>

#### Inherited from

MeasureTool.getGeomParams

#### Defined in

[src/Measurement/MeasureTool.ts:109](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L109)

___

### getGeomParamsSync

▸ `Protected` **getGeomParamsSync**(`geomItem`, `componentId?`): `ParameterOwner`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `geomItem` | `GeomItem` | `undefined` |
| `componentId` | `number` | `-1` |

#### Returns

`ParameterOwner`

#### Inherited from

MeasureTool.getGeomParamsSync

#### Defined in

[src/Measurement/MeasureTool.ts:130](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L130)

___

### getGeomXfo

▸ `Private` **getGeomXfo**(`geomItem`, `componentId?`): `Xfo`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `geomItem` | `GeomItem` | `undefined` |
| `componentId` | `number` | `-1` |

#### Returns

`Xfo`

#### Inherited from

MeasureTool.getGeomXfo

#### Defined in

[src/Measurement/MeasureTool.ts:145](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L145)

___

### onPointerDown

▸ **onPointerDown**(`event`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event value |

#### Returns

`void`

#### Overrides

MeasureTool.onPointerDown

#### Defined in

[src/Measurement/MeasureAngleTool.ts:157](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngleTool.ts#L157)

___

### onPointerMove

▸ **onPointerMove**(`event`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event value |

#### Returns

`void`

#### Inherited from

MeasureTool.onPointerMove

#### Defined in

[src/Measurement/MeasureTool.ts:185](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L185)

___

### onPointerUp

▸ **onPointerUp**(`event`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event value |

#### Returns

`void`

#### Inherited from

MeasureTool.onPointerUp

#### Defined in

[src/Measurement/MeasureTool.ts:285](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureTool.ts#L285)

___

### snapToSurface

▸ `Private` **snapToSurface**(`geomXfo`, `geomParams`, `hitPos`, `pointerRay`, `closestTo?`): `Xfo`

#### Parameters

| Name | Type |
| :------ | :------ |
| `geomXfo` | `Xfo` |
| `geomParams` | `ParameterOwner` |
| `hitPos` | `Vec3` |
| `pointerRay` | `Ray` |
| `closestTo?` | `Xfo` |

#### Returns

`Xfo`

#### Defined in

[src/Measurement/MeasureAngleTool.ts:48](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngleTool.ts#L48)
