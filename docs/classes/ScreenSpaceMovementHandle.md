[@zeainc/zea-ux](../API.md) / ScreenSpaceMovementHandle

# Class: ScreenSpaceMovementHandle

Class representing a planar movement scene widget.

## Hierarchy

- `Handle`

  ↳ **`ScreenSpaceMovementHandle`**

## Table of contents

### Constructors

- [constructor](ScreenSpaceMovementHandle.md#constructor)

### Properties

- [activeController](ScreenSpaceMovementHandle.md#activecontroller)
- [baseXfo](ScreenSpaceMovementHandle.md#basexfo)
- [captured](ScreenSpaceMovementHandle.md#captured)
- [change](ScreenSpaceMovementHandle.md#change)
- [changedTouches](ScreenSpaceMovementHandle.md#changedtouches)
- [colorParam](ScreenSpaceMovementHandle.md#colorparam)
- [delta](ScreenSpaceMovementHandle.md#delta)
- [gizmoRay](ScreenSpaceMovementHandle.md#gizmoray)
- [grabPos](ScreenSpaceMovementHandle.md#grabpos)
- [highlightColorParam](ScreenSpaceMovementHandle.md#highlightcolorparam)
- [holdDist](ScreenSpaceMovementHandle.md#holddist)
- [holdPos](ScreenSpaceMovementHandle.md#holdpos)
- [param](ScreenSpaceMovementHandle.md#param)
- [preventDefault](ScreenSpaceMovementHandle.md#preventdefault)
- [releasePos](ScreenSpaceMovementHandle.md#releasepos)
- [selectionGroup](ScreenSpaceMovementHandle.md#selectiongroup)
- [value](ScreenSpaceMovementHandle.md#value)

### Methods

- [getManipulationPlane](ScreenSpaceMovementHandle.md#getmanipulationplane)
- [getTargetParam](ScreenSpaceMovementHandle.md#gettargetparam)
- [handlePointerDown](ScreenSpaceMovementHandle.md#handlepointerdown)
- [handlePointerMove](ScreenSpaceMovementHandle.md#handlepointermove)
- [handlePointerUp](ScreenSpaceMovementHandle.md#handlepointerup)
- [highlight](ScreenSpaceMovementHandle.md#highlight)
- [onDrag](ScreenSpaceMovementHandle.md#ondrag)
- [onDragEnd](ScreenSpaceMovementHandle.md#ondragend)
- [onDragStart](ScreenSpaceMovementHandle.md#ondragstart)
- [onPointerDown](ScreenSpaceMovementHandle.md#onpointerdown)
- [onPointerEnter](ScreenSpaceMovementHandle.md#onpointerenter)
- [onPointerLeave](ScreenSpaceMovementHandle.md#onpointerleave)
- [onPointerMove](ScreenSpaceMovementHandle.md#onpointermove)
- [onPointerUp](ScreenSpaceMovementHandle.md#onpointerup)
- [onVRControllerButtonDown](ScreenSpaceMovementHandle.md#onvrcontrollerbuttondown)
- [onVRControllerButtonUp](ScreenSpaceMovementHandle.md#onvrcontrollerbuttonup)
- [onVRPoseChanged](ScreenSpaceMovementHandle.md#onvrposechanged)
- [onWheel](ScreenSpaceMovementHandle.md#onwheel)
- [setSelectionGroup](ScreenSpaceMovementHandle.md#setselectiongroup)
- [setTargetParam](ScreenSpaceMovementHandle.md#settargetparam)
- [unhighlight](ScreenSpaceMovementHandle.md#unhighlight)

## Constructors

### constructor

• **new ScreenSpaceMovementHandle**(`name?`)

Create a planar movement scene widget.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | The name value |

#### Overrides

Handle.constructor

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:26](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L26)

## Properties

### activeController

• **activeController**: `any`

#### Inherited from

Handle.activeController

#### Defined in

[src/Handles/Handle.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L28)

___

### baseXfo

• **baseXfo**: `Xfo`

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:18](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L18)

___

### captured

• **captured**: `boolean` = `false`

#### Inherited from

Handle.captured

#### Defined in

[src/Handles/Handle.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L29)

___

### change

• **change**: [`Change`](Change.md)

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L19)

___

### changedTouches

• **changedTouches**: `boolean`

#### Inherited from

Handle.changedTouches

#### Defined in

[src/Handles/Handle.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L39)

___

### colorParam

• **colorParam**: `ColorParameter`

#### Inherited from

Handle.colorParam

#### Defined in

[src/Handles/Handle.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L30)

___

### delta

• **delta**: `number` \| `Vec3` \| `number`[]

#### Inherited from

Handle.delta

#### Defined in

[src/Handles/Handle.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L37)

___

### gizmoRay

• **gizmoRay**: `Ray`

#### Inherited from

Handle.gizmoRay

#### Defined in

[src/Handles/Handle.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L27)

___

### grabPos

• **grabPos**: `Vec3`

#### Inherited from

Handle.grabPos

#### Defined in

[src/Handles/Handle.ts:33](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L33)

___

### highlightColorParam

• **highlightColorParam**: `ColorParameter`

#### Inherited from

Handle.highlightColorParam

#### Defined in

[src/Handles/Handle.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L31)

___

### holdDist

• **holdDist**: `number`

#### Inherited from

Handle.holdDist

#### Defined in

[src/Handles/Handle.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L35)

___

### holdPos

• **holdPos**: `Vec3`

#### Inherited from

Handle.holdPos

#### Defined in

[src/Handles/Handle.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L34)

___

### param

• **param**: `Parameter`<`unknown`\>

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:17](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L17)

___

### preventDefault

• **preventDefault**: `any`

#### Inherited from

Handle.preventDefault

#### Defined in

[src/Handles/Handle.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L40)

___

### releasePos

• **releasePos**: `Vec3`

#### Inherited from

Handle.releasePos

#### Defined in

[src/Handles/Handle.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L38)

___

### selectionGroup

• **selectionGroup**: `SelectionGroup`

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L20)

___

### value

• **value**: `number` \| `Vec3` \| `number`[]

#### Inherited from

Handle.value

#### Defined in

[src/Handles/Handle.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L36)

## Methods

### getManipulationPlane

▸ **getManipulationPlane**(): `Ray`

Returns the manipulation plane of the handle, denoting a start and a direction.

#### Returns

`Ray`

The return value.

#### Inherited from

Handle.getManipulationPlane

#### Defined in

[src/Handles/Handle.ts:72](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L72)

___

### getTargetParam

▸ **getTargetParam**(): `Parameter`<`unknown`\>

Returns target's global xfo parameter.

#### Returns

`Parameter`<`unknown`\>

- returns handle's target global Xfo.

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:61](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L61)

___

### handlePointerDown

▸ **handlePointerDown**(`event`): `void`

Handles mouse down interaction with the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaMouseEvent` | The event param. |

#### Returns

`void`

#### Overrides

Handle.handlePointerDown

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:73](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L73)

___

### handlePointerMove

▸ **handlePointerMove**(`event`): `void`

Handles mouse move interaction with the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param |

#### Returns

`void`

#### Overrides

Handle.handlePointerMove

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:92](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L92)

___

### handlePointerUp

▸ **handlePointerUp**(`event`): `void`

Handles mouse up interaction with the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

Handle.handlePointerUp

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:104](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L104)

___

### highlight

▸ **highlight**(): `void`

Applies a special shinning shader to the handle to illustrate interaction with it.

#### Returns

`void`

#### Inherited from

Handle.highlight

#### Defined in

[src/Handles/Handle.ts:56](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L56)

___

### onDrag

▸ **onDrag**(`event`): `void`

Handles drag action of the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

Handle.onDrag

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:142](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L142)

___

### onDragEnd

▸ **onDragEnd**(`event`): `void`

Handles the end of dragging the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

Handle.onDragEnd

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:164](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L164)

___

### onDragStart

▸ **onDragStart**(`event`): `void`

Handles the initially drag of the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

Handle.onDragStart

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:122](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L122)

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

#### Inherited from

Handle.onPointerDown

#### Defined in

[src/Handles/Handle.ts:103](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L103)

___

### onPointerEnter

▸ **onPointerEnter**(`event`): `void`

Event fired when a pointing device is initially moved within the space of the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

Handle.onPointerEnter

#### Defined in

[src/Handles/Handle.ts:85](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L85)

___

### onPointerLeave

▸ **onPointerLeave**(`event`): `void`

Event fired when a pointing device moves outside of the space of the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

Handle.onPointerLeave

#### Defined in

[src/Handles/Handle.ts:94](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L94)

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

#### Inherited from

Handle.onPointerMove

#### Defined in

[src/Handles/Handle.ts:124](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L124)

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

#### Inherited from

Handle.onPointerUp

#### Defined in

[src/Handles/Handle.ts:143](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L143)

___

### onVRControllerButtonDown

▸ **onVRControllerButtonDown**(`event`): `void`

Event fired when a VR controller button is pressed over the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

Handle.onVRControllerButtonDown

#### Defined in

[src/Handles/Handle.ts:214](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L214)

___

### onVRControllerButtonUp

▸ **onVRControllerButtonUp**(`event`): `void`

Event fired when a VR controller button is released over the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

Handle.onVRControllerButtonUp

#### Defined in

[src/Handles/Handle.ts:246](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L246)

___

### onVRPoseChanged

▸ **onVRPoseChanged**(`event`): `void`

The onVRPoseChanged method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

Handle.onVRPoseChanged

#### Defined in

[src/Handles/Handle.ts:230](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L230)

___

### onWheel

▸ **onWheel**(`event`): `void`

Event fired when the user rotates the pointing device wheel over the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaWheelEvent` | The event param. |

#### Returns

`void`

#### Inherited from

Handle.onWheel

#### Defined in

[src/Handles/Handle.ts:164](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L164)

___

### setSelectionGroup

▸ **setSelectionGroup**(`selectionGroup`): `void`

Sets selectionGroup so this handle can modify the items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selectionGroup` | `SelectionGroup` | The SelectionGroup. |

#### Returns

`void`

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L35)

___

### setTargetParam

▸ **setTargetParam**(`param`, `track?`): `void`

Sets global xfo target parameter.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `param` | `any` | `undefined` | The video param. |
| `track` | `boolean` | `true` | The track param. |

#### Returns

`void`

#### Overrides

Handle.setTargetParam

#### Defined in

[src/Handles/ScreenSpaceMovementHandle.ts:45](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ScreenSpaceMovementHandle.ts#L45)

___

### unhighlight

▸ **unhighlight**(): `void`

Removes the shining shader from the handle.

#### Returns

`void`

#### Inherited from

Handle.unhighlight

#### Defined in

[src/Handles/Handle.ts:63](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L63)
