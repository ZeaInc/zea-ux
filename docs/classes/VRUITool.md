[@zeainc/zea-ux](../API.md) / VRUITool

# Class: VRUITool

Class representing a VR UI tool.

## Hierarchy

- `BaseTool`

  ↳ **`VRUITool`**

## Table of contents

### Constructors

- [constructor](VRUITool.md#constructor)

### Properties

- [\_\_pointerLocalXfo](VRUITool.md#__pointerlocalxfo)
- [\_\_triggerDownElem](VRUITool.md#__triggerdownelem)
- [\_\_triggerHeld](VRUITool.md#__triggerheld)
- [\_\_uiPointerItem](VRUITool.md#__uipointeritem)
- [\_\_vrUIDOMElement](VRUITool.md#__vruidomelement)
- [\_element](VRUITool.md#_element)
- [appData](VRUITool.md#appdata)
- [controllerUI](VRUITool.md#controllerui)
- [pointerController](VRUITool.md#pointercontroller)
- [uiController](VRUITool.md#uicontroller)
- [uiOpen](VRUITool.md#uiopen)

### Methods

- [activateTool](VRUITool.md#activatetool)
- [calcUIIntersection](VRUITool.md#calcuiintersection)
- [closeUI](VRUITool.md#closeui)
- [deactivateTool](VRUITool.md#deactivatetool)
- [displayUI](VRUITool.md#displayui)
- [getName](VRUITool.md#getname)
- [onPointerDown](VRUITool.md#onpointerdown)
- [onPointerMove](VRUITool.md#onpointermove)
- [onPointerUp](VRUITool.md#onpointerup)
- [sendEventToUI](VRUITool.md#sendeventtoui)
- [setPointerLength](VRUITool.md#setpointerlength)

## Constructors

### constructor

• **new VRUITool**(`appData`, `vrUIDOMElement`)

Create a VR UI tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value. |
| `vrUIDOMElement` | `HTMLElement` | The  dom element we will use as the VR UI |

#### Overrides

BaseTool.constructor

#### Defined in

[src/Tools/VRTools/VRUITool.ts:45](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L45)

## Properties

### \_\_pointerLocalXfo

• **\_\_pointerLocalXfo**: `Xfo`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L31)

___

### \_\_triggerDownElem

• **\_\_triggerDownElem**: `Element`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L38)

___

### \_\_triggerHeld

• **\_\_triggerHeld**: `boolean`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:33](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L33)

___

### \_\_uiPointerItem

• **\_\_uiPointerItem**: `GeomItem`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L32)

___

### \_\_vrUIDOMElement

• **\_\_vrUIDOMElement**: `HTMLElement`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L29)

___

### \_element

• **\_element**: `Element`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L37)

___

### appData

• **appData**: [`AppData`](../interfaces/AppData.md)

#### Defined in

[src/Tools/VRTools/VRUITool.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L28)

___

### controllerUI

• **controllerUI**: `default`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L30)

___

### pointerController

• **pointerController**: `any`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L36)

___

### uiController

• **uiController**: `any`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L35)

___

### uiOpen

• **uiOpen**: `boolean`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L34)

## Methods

### activateTool

▸ **activateTool**(): `void`

The activateTool method.

#### Returns

`void`

#### Overrides

BaseTool.activateTool

#### Defined in

[src/Tools/VRTools/VRUITool.ts:97](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L97)

___

### calcUIIntersection

▸ **calcUIIntersection**(): `Record`<`any`, `any`\>

The calcUIIntersection method.

#### Returns

`Record`<`any`, `any`\>

The return value.

#### Defined in

[src/Tools/VRTools/VRUITool.ts:206](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L206)

___

### closeUI

▸ **closeUI**(): `void`

The closeUI method.

#### Returns

`void`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:168](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L168)

___

### deactivateTool

▸ **deactivateTool**(): `void`

The deactivateTool method.

#### Returns

`void`

#### Overrides

BaseTool.deactivateTool

#### Defined in

[src/Tools/VRTools/VRUITool.ts:104](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L104)

___

### displayUI

▸ **displayUI**(`uiController`, `pointerController`, `headXfo`): `void`

The displayUI method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uiController` | `XRController` | The uiController param. |
| `pointerController` | `XRController` | - |
| `headXfo` | `Xfo` | The headXfo param. |

#### Returns

`void`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:115](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L115)

___

### getName

▸ **getName**(): `string`

The getName method.

#### Returns

`string`

The return value.

#### Defined in

[src/Tools/VRTools/VRUITool.ts:89](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L89)

___

### onPointerDown

▸ **onPointerDown**(`event`): `void`

The onVRControllerButtonDown method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerDown

#### Defined in

[src/Tools/VRTools/VRUITool.ts:273](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L273)

___

### onPointerMove

▸ **onPointerMove**(`event`): `void`

The onVRPoseChanged method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRPoseEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerMove

#### Defined in

[src/Tools/VRTools/VRUITool.ts:318](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L318)

___

### onPointerUp

▸ **onPointerUp**(`event`): `void`

The onVRControllerButtonUp method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerUp

#### Defined in

[src/Tools/VRTools/VRUITool.ts:295](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L295)

___

### sendEventToUI

▸ **sendEventToUI**(`eventName`, `args`): `Element`

The sendEventToUI method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | The eventName param. |
| `args` | `any` | The args param. |

#### Returns

`Element`

The return value.

#### Defined in

[src/Tools/VRTools/VRUITool.ts:243](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L243)

___

### setPointerLength

▸ **setPointerLength**(`length`): `void`

The setPointerLength method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `length` | `number` | The length param. |

#### Returns

`void`

#### Defined in

[src/Tools/VRTools/VRUITool.ts:196](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/VRTools/VRUITool.ts#L196)
