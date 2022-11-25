[@zeainc/zea-ux](../API.md) / MeasureDistance

# Class: MeasureDistance

## Hierarchy

- `Measure`

  ↳ **`MeasureDistance`**

## Table of contents

### Constructors

- [constructor](MeasureDistance.md#constructor)

### Properties

- [billboard](MeasureDistance.md#billboard)
- [colorParam](MeasureDistance.md#colorparam)
- [label](MeasureDistance.md#label)
- [lineGeomItem](MeasureDistance.md#linegeomitem)
- [lineMaterial](MeasureDistance.md#linematerial)
- [markerA](MeasureDistance.md#markera)
- [markerB](MeasureDistance.md#markerb)
- [markerMaterial](MeasureDistance.md#markermaterial)
- [sceneUnits](MeasureDistance.md#sceneunits)

### Methods

- [getMeasurementText](MeasureDistance.md#getmeasurementtext)
- [setEndMarkerPos](MeasureDistance.md#setendmarkerpos)
- [setGeomBuffersVisibility](MeasureDistance.md#setgeombuffersvisibility)
- [setStartMarkerPos](MeasureDistance.md#setstartmarkerpos)
- [updateMeasurement](MeasureDistance.md#updatemeasurement)

## Constructors

### constructor

• **new MeasureDistance**(`name?`, `color?`, `sceneUnits?`)

Creates an instance of MeasureDistance.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `'MeasureDistance'` |
| `color` | `Color` | `undefined` |
| `sceneUnits` | `string` | `'Meters'` |

#### Overrides

Measure.constructor

#### Defined in

[src/Measurement/MeasureDistance.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureDistance.ts#L38)

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

### lineGeomItem

• **lineGeomItem**: `GeomItem` = `null`

#### Defined in

[src/Measurement/MeasureDistance.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureDistance.ts#L31)

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

___

### sceneUnits

• **sceneUnits**: `String` = `null`

#### Defined in

[src/Measurement/MeasureDistance.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureDistance.ts#L32)

## Methods

### getMeasurementText

▸ **getMeasurementText**(): `any`

#### Returns

`any`

#### Defined in

[src/Measurement/MeasureDistance.ts:145](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureDistance.ts#L145)

___

### setEndMarkerPos

▸ **setEndMarkerPos**(`position`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `Vec3` |

#### Returns

`void`

#### Defined in

[src/Measurement/MeasureDistance.ts:124](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureDistance.ts#L124)

___

### setGeomBuffersVisibility

▸ **setGeomBuffersVisibility**(`isVisible`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `isVisible` | `boolean` |

#### Returns

`void`

#### Defined in

[src/Measurement/MeasureDistance.ts:136](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureDistance.ts#L136)

___

### setStartMarkerPos

▸ **setStartMarkerPos**(`position`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `Vec3` |

#### Returns

`void`

#### Defined in

[src/Measurement/MeasureDistance.ts:112](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureDistance.ts#L112)

___

### updateMeasurement

▸ **updateMeasurement**(): `void`

Updates the measured value

#### Returns

`void`

#### Defined in

[src/Measurement/MeasureDistance.ts:47](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Measurement/MeasureDistance.ts#L47)
