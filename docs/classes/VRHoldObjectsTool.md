[@zeainc/zea-ux](../API.md) / VRHoldObjectsTool

# Class: VRHoldObjectsTool

Class representing a VR hold objects tool.

## Hierarchy

- `BaseTool`

  ↳ **`VRHoldObjectsTool`**

## Table of contents

### Constructors

- [constructor](VRHoldObjectsTool.md#constructor)

### Properties

- [\_\_freeIndices](VRHoldObjectsTool.md#__freeindices)
- [\_\_heldGeomItemIds](VRHoldObjectsTool.md#__heldgeomitemids)
- [\_\_heldGeomItemOffsets](VRHoldObjectsTool.md#__heldgeomitemoffsets)
- [\_\_heldGeomItemRefs](VRHoldObjectsTool.md#__heldgeomitemrefs)
- [\_\_heldGeomItems](VRHoldObjectsTool.md#__heldgeomitems)
- [\_\_heldObjectCount](VRHoldObjectsTool.md#__heldobjectcount)
- [\_\_highlightedGeomItemIds](VRHoldObjectsTool.md#__highlightedgeomitemids)
- [\_\_pressedButtonCount](VRHoldObjectsTool.md#__pressedbuttoncount)
- [\_\_vrControllers](VRHoldObjectsTool.md#__vrcontrollers)
- [addIconToControllerId](VRHoldObjectsTool.md#addicontocontrollerid)
- [appData](VRHoldObjectsTool.md#appdata)
- [change](VRHoldObjectsTool.md#change)

### Methods

- [activateTool](VRHoldObjectsTool.md#activatetool)
- [computeGrabXfo](VRHoldObjectsTool.md#computegrabxfo)
- [deactivateTool](VRHoldObjectsTool.md#deactivatetool)
- [initAction](VRHoldObjectsTool.md#initaction)
- [onPointerDoublePress](VRHoldObjectsTool.md#onpointerdoublepress)
- [onPointerDown](VRHoldObjectsTool.md#onpointerdown)
- [onPointerMove](VRHoldObjectsTool.md#onpointermove)
- [onPointerUp](VRHoldObjectsTool.md#onpointerup)

## Constructors

### constructor

• **new VRHoldObjectsTool**(`appData`)

Create a VR hold objects tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value. |

#### Overrides

BaseTool.constructor

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:160](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L160)

## Properties

### \_\_freeIndices

• **\_\_freeIndices**: `number`[] = `[]`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:145](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L145)

___

### \_\_heldGeomItemIds

• **\_\_heldGeomItemIds**: `number`[] = `[]`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:150](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L150)

___

### \_\_heldGeomItemOffsets

• **\_\_heldGeomItemOffsets**: `Xfo`[] = `[]`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:152](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L152)

___

### \_\_heldGeomItemRefs

• **\_\_heldGeomItemRefs**: `any` = `[]`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:151](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L151)

___

### \_\_heldGeomItems

• **\_\_heldGeomItems**: `GeomItem`[] = `[]`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:148](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L148)

___

### \_\_heldObjectCount

• **\_\_heldObjectCount**: `number` = `0`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:147](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L147)

___

### \_\_highlightedGeomItemIds

• **\_\_highlightedGeomItemIds**: `TreeItem`[] = `[]`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:149](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L149)

___

### \_\_pressedButtonCount

• **\_\_pressedButtonCount**: `number` = `0`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:143](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L143)

___

### \_\_vrControllers

• **\_\_vrControllers**: `any`[] = `[]`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:146](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L146)

___

### addIconToControllerId

• **addIconToControllerId**: `number`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:154](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L154)

___

### appData

• **appData**: [`AppData`](../interfaces/AppData.md)

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:142](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L142)

___

### change

• **change**: `HoldObjectsChange`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:155](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L155)

## Methods

### activateTool

▸ **activateTool**(): `void`

The activateTool method.

#### Returns

`void`

#### Overrides

BaseTool.activateTool

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:168](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L168)

___

### computeGrabXfo

▸ **computeGrabXfo**(`refs`): `any`

The computeGrabXfo method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `refs` | `any`[] | The refs param. |

#### Returns

`any`

The return value.

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:215](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L215)

___

### deactivateTool

▸ **deactivateTool**(): `void`

The deactivateTool method.

#### Returns

`void`

#### Overrides

BaseTool.deactivateTool

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:196](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L196)

___

### initAction

▸ **initAction**(): `void`

The initAction method.

#### Returns

`void`

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:249](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L249)

___

### onPointerDoublePress

▸ **onPointerDoublePress**(`event`): `void`

Event fired when a pointing device button is double clicked on the tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaMouseEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerDoublePress

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:384](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L384)

___

### onPointerDown

▸ **onPointerDown**(`event`): `void`

Event fired when a pointing device button is pressed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerDown

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:263](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L263)

___

### onPointerMove

▸ **onPointerMove**(`event`): `void`

Event fired when a pointing device is moved

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRPoseEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerMove

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:336](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L336)

___

### onPointerUp

▸ **onPointerUp**(`event`): `void`

Event fired when a pointing device button is released while the pointer is over the tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerUp

#### Defined in

[src/Tools/VRTools/VRHoldObjectsTool.ts:309](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRHoldObjectsTool.ts#L309)
