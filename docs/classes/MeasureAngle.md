[@zeainc/zea-ux](../API.md) / MeasureAngle

# Class: MeasureAngle

## Hierarchy

- `Measure`

  ↳ **`MeasureAngle`**

## Table of contents

### Constructors

- [constructor](MeasureAngle.md#constructor)

### Properties

- [billboard](MeasureAngle.md#billboard)
- [colorParam](MeasureAngle.md#colorparam)
- [label](MeasureAngle.md#label)
- [lineMaterial](MeasureAngle.md#linematerial)
- [markerA](MeasureAngle.md#markera)
- [markerB](MeasureAngle.md#markerb)
- [markerMaterial](MeasureAngle.md#markermaterial)

### Methods

- [createLinesAndLabel](MeasureAngle.md#createlinesandlabel)
- [getXfoA](MeasureAngle.md#getxfoa)
- [setXfoA](MeasureAngle.md#setxfoa)
- [setXfoB](MeasureAngle.md#setxfob)

## Constructors

### constructor

• **new MeasureAngle**(`name?`, `color?`)

Creates an instance of MeasureAngle.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `'MeasureAngle'` |
| `color` | `Color` | `undefined` |

#### Overrides

Measure.constructor

#### Defined in

[src/Measurement/MeasureAngle.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngle.ts#L35)

## Properties

### billboard

• **billboard**: `BillboardItem`

#### Inherited from

Measure.billboard

#### Defined in

[src/Measurement/Measure.ts:50](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/Measure.ts#L50)

___

### colorParam

• **colorParam**: `ColorParameter`

#### Inherited from

Measure.colorParam

#### Defined in

[src/Measurement/Measure.ts:44](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/Measure.ts#L44)

___

### label

• **label**: `Label`

#### Inherited from

Measure.label

#### Defined in

[src/Measurement/Measure.ts:49](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/Measure.ts#L49)

___

### lineMaterial

• **lineMaterial**: `LinesMaterial`

#### Inherited from

Measure.lineMaterial

#### Defined in

[src/Measurement/Measure.ts:45](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/Measure.ts#L45)

___

### markerA

• **markerA**: `GeomItem`

#### Inherited from

Measure.markerA

#### Defined in

[src/Measurement/Measure.ts:47](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/Measure.ts#L47)

___

### markerB

• **markerB**: `GeomItem`

#### Inherited from

Measure.markerB

#### Defined in

[src/Measurement/Measure.ts:48](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/Measure.ts#L48)

___

### markerMaterial

• **markerMaterial**: `Material`

#### Inherited from

Measure.markerMaterial

#### Defined in

[src/Measurement/Measure.ts:46](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/Measure.ts#L46)

## Methods

### createLinesAndLabel

▸ **createLinesAndLabel**(): `void`

Given the 2 marker positions, calculate and display the angle.

#### Returns

`void`

#### Defined in

[src/Measurement/MeasureAngle.ts:42](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngle.ts#L42)

___

### getXfoA

▸ **getXfoA**(): `Xfo`

#### Returns

`Xfo`

#### Defined in

[src/Measurement/MeasureAngle.ts:125](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngle.ts#L125)

___

### setXfoA

▸ **setXfoA**(`xfo`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `xfo` | `Xfo` |

#### Returns

`void`

#### Defined in

[src/Measurement/MeasureAngle.ts:115](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngle.ts#L115)

___

### setXfoB

▸ **setXfoB**(`xfo`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `xfo` | `Xfo` |

#### Returns

`void`

#### Defined in

[src/Measurement/MeasureAngle.ts:134](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureAngle.ts#L134)
