[@zeainc/zea-ux](../API.md) / PlanarMovementHandle

# Class: PlanarMovementHandle

Class representing a planar movement scene widget.

## Hierarchy

- `Handle`

  ↳ **`PlanarMovementHandle`**

## Table of contents

### Constructors

- [constructor](PlanarMovementHandle.md#constructor)

### Properties

- [activeController](PlanarMovementHandle.md#activecontroller)
- [baseXfo](PlanarMovementHandle.md#basexfo)
- [captured](PlanarMovementHandle.md#captured)
- [change](PlanarMovementHandle.md#change)
- [changedTouches](PlanarMovementHandle.md#changedtouches)
- [colorParam](PlanarMovementHandle.md#colorparam)
- [delta](PlanarMovementHandle.md#delta)
- [fullXfoManipulationInVR](PlanarMovementHandle.md#fullxfomanipulationinvr)
- [gizmoRay](PlanarMovementHandle.md#gizmoray)
- [grabOffset](PlanarMovementHandle.md#graboffset)
- [grabPos](PlanarMovementHandle.md#grabpos)
- [highlightColorParam](PlanarMovementHandle.md#highlightcolorparam)
- [holdDist](PlanarMovementHandle.md#holddist)
- [holdPos](PlanarMovementHandle.md#holdpos)
- [param](PlanarMovementHandle.md#param)
- [preventDefault](PlanarMovementHandle.md#preventdefault)
- [releasePos](PlanarMovementHandle.md#releasepos)
- [selectionGroup](PlanarMovementHandle.md#selectiongroup)
- [value](PlanarMovementHandle.md#value)

### Methods

- [getManipulationPlane](PlanarMovementHandle.md#getmanipulationplane)
- [getTargetParam](PlanarMovementHandle.md#gettargetparam)
- [handlePointerDown](PlanarMovementHandle.md#handlepointerdown)
- [handlePointerMove](PlanarMovementHandle.md#handlepointermove)
- [handlePointerUp](PlanarMovementHandle.md#handlepointerup)
- [highlight](PlanarMovementHandle.md#highlight)
- [onDrag](PlanarMovementHandle.md#ondrag)
- [onDragEnd](PlanarMovementHandle.md#ondragend)
- [onDragStart](PlanarMovementHandle.md#ondragstart)
- [onPointerDown](PlanarMovementHandle.md#onpointerdown)
- [onPointerEnter](PlanarMovementHandle.md#onpointerenter)
- [onPointerLeave](PlanarMovementHandle.md#onpointerleave)
- [onPointerMove](PlanarMovementHandle.md#onpointermove)
- [onPointerUp](PlanarMovementHandle.md#onpointerup)
- [onVRControllerButtonDown](PlanarMovementHandle.md#onvrcontrollerbuttondown)
- [onVRControllerButtonUp](PlanarMovementHandle.md#onvrcontrollerbuttonup)
- [onVRPoseChanged](PlanarMovementHandle.md#onvrposechanged)
- [onWheel](PlanarMovementHandle.md#onwheel)
- [setSelectionGroup](PlanarMovementHandle.md#setselectiongroup)
- [setTargetParam](PlanarMovementHandle.md#settargetparam)
- [unhighlight](PlanarMovementHandle.md#unhighlight)

## Constructors

### constructor

• **new PlanarMovementHandle**(`name`)

Create a planar movement scene widget.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name value. |

#### Overrides

Handle.constructor

#### Defined in

[src/Handles/PlanarMovementHandle.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L27)

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

[src/Handles/PlanarMovementHandle.ts:18](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L18)

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

[src/Handles/PlanarMovementHandle.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L19)

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

### fullXfoManipulationInVR

• **fullXfoManipulationInVR**: `boolean`

#### Defined in

[src/Handles/PlanarMovementHandle.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L16)

___

### gizmoRay

• **gizmoRay**: `Ray`

#### Inherited from

Handle.gizmoRay

#### Defined in

[src/Handles/Handle.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L27)

___

### grabOffset

• **grabOffset**: `Vec3`

#### Defined in

[src/Handles/PlanarMovementHandle.ts:17](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L17)

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

[src/Handles/PlanarMovementHandle.ts:15](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L15)

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

[src/Handles/PlanarMovementHandle.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L20)

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

[src/Handles/PlanarMovementHandle.ts:63](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L63)

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

#### Inherited from

Handle.handlePointerDown

#### Defined in

[src/Handles/Handle.ts:171](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L171)

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

#### Inherited from

Handle.handlePointerMove

#### Defined in

[src/Handles/Handle.ts:184](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L184)

___

### handlePointerUp

▸ **handlePointerUp**(`event`): `void`

Handles mouse up interaction with the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaMouseEvent` | The event param. |

#### Returns

`void`

#### Inherited from

Handle.handlePointerUp

#### Defined in

[src/Handles/Handle.ts:196](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L196)

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

[src/Handles/PlanarMovementHandle.ts:92](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L92)

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

[src/Handles/PlanarMovementHandle.ts:114](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L114)

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

[src/Handles/PlanarMovementHandle.ts:72](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L72)

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

The return value.

#### Overrides

Handle.onVRControllerButtonDown

#### Defined in

[src/Handles/PlanarMovementHandle.ts:131](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L131)

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

#### Overrides

Handle.onVRControllerButtonUp

#### Defined in

[src/Handles/PlanarMovementHandle.ts:169](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L169)

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

#### Overrides

Handle.onVRPoseChanged

#### Defined in

[src/Handles/PlanarMovementHandle.ts:147](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L147)

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

[src/Handles/PlanarMovementHandle.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L37)

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

[src/Handles/PlanarMovementHandle.ts:47](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/PlanarMovementHandle.ts#L47)

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
