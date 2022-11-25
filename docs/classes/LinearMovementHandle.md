[@zeainc/zea-ux](../API.md) / LinearMovementHandle

# Class: LinearMovementHandle

Class representing a linear movement scene widget.

## Hierarchy

- `BaseLinearMovementHandle`

  ↳ **`LinearMovementHandle`**

## Table of contents

### Constructors

- [constructor](LinearMovementHandle.md#constructor)

### Properties

- [activeController](LinearMovementHandle.md#activecontroller)
- [baseXfo](LinearMovementHandle.md#basexfo)
- [captured](LinearMovementHandle.md#captured)
- [change](LinearMovementHandle.md#change)
- [changedTouches](LinearMovementHandle.md#changedtouches)
- [colorParam](LinearMovementHandle.md#colorparam)
- [delta](LinearMovementHandle.md#delta)
- [gizmoRay](LinearMovementHandle.md#gizmoray)
- [grabDist](LinearMovementHandle.md#grabdist)
- [grabPos](LinearMovementHandle.md#grabpos)
- [handleMat](LinearMovementHandle.md#handlemat)
- [highlightColorParam](LinearMovementHandle.md#highlightcolorparam)
- [holdDist](LinearMovementHandle.md#holddist)
- [holdPos](LinearMovementHandle.md#holdpos)
- [param](LinearMovementHandle.md#param)
- [preventDefault](LinearMovementHandle.md#preventdefault)
- [releasePos](LinearMovementHandle.md#releasepos)
- [selectionGroup](LinearMovementHandle.md#selectiongroup)
- [value](LinearMovementHandle.md#value)

### Methods

- [getManipulationPlane](LinearMovementHandle.md#getmanipulationplane)
- [getTargetParam](LinearMovementHandle.md#gettargetparam)
- [handlePointerDown](LinearMovementHandle.md#handlepointerdown)
- [handlePointerMove](LinearMovementHandle.md#handlepointermove)
- [handlePointerUp](LinearMovementHandle.md#handlepointerup)
- [highlight](LinearMovementHandle.md#highlight)
- [onDrag](LinearMovementHandle.md#ondrag)
- [onDragEnd](LinearMovementHandle.md#ondragend)
- [onDragStart](LinearMovementHandle.md#ondragstart)
- [onPointerDown](LinearMovementHandle.md#onpointerdown)
- [onPointerEnter](LinearMovementHandle.md#onpointerenter)
- [onPointerLeave](LinearMovementHandle.md#onpointerleave)
- [onPointerMove](LinearMovementHandle.md#onpointermove)
- [onPointerUp](LinearMovementHandle.md#onpointerup)
- [onVRControllerButtonDown](LinearMovementHandle.md#onvrcontrollerbuttondown)
- [onVRControllerButtonUp](LinearMovementHandle.md#onvrcontrollerbuttonup)
- [onVRPoseChanged](LinearMovementHandle.md#onvrposechanged)
- [onWheel](LinearMovementHandle.md#onwheel)
- [setSelectionGroup](LinearMovementHandle.md#setselectiongroup)
- [setTargetParam](LinearMovementHandle.md#settargetparam)
- [unhighlight](LinearMovementHandle.md#unhighlight)

## Constructors

### constructor

• **new LinearMovementHandle**(`name?`, `length?`, `thickness?`, `color?`)

Create a linear movement scene widget.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name?` | `string` | `undefined` | The name value. |
| `length` | `number` | `0.1` | The length value. |
| `thickness` | `number` | `0.003` | The thickness value. |
| `color` | `Color` | `undefined` | The color value. |

#### Overrides

BaseLinearMovementHandle.constructor

#### Defined in

[src/Handles/LinearMovementHandle.ts:41](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L41)

## Properties

### activeController

• **activeController**: `any`

#### Inherited from

BaseLinearMovementHandle.activeController

#### Defined in

[src/Handles/Handle.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L28)

___

### baseXfo

• **baseXfo**: `Xfo`

#### Defined in

[src/Handles/LinearMovementHandle.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L29)

___

### captured

• **captured**: `boolean` = `false`

#### Inherited from

BaseLinearMovementHandle.captured

#### Defined in

[src/Handles/Handle.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L29)

___

### change

• **change**: [`Change`](Change.md)

#### Defined in

[src/Handles/LinearMovementHandle.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L30)

___

### changedTouches

• **changedTouches**: `boolean`

#### Inherited from

BaseLinearMovementHandle.changedTouches

#### Defined in

[src/Handles/Handle.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L39)

___

### colorParam

• **colorParam**: `ColorParameter`

#### Inherited from

BaseLinearMovementHandle.colorParam

#### Defined in

[src/Handles/Handle.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L30)

___

### delta

• **delta**: `number` \| `Vec3` \| `number`[]

#### Inherited from

BaseLinearMovementHandle.delta

#### Defined in

[src/Handles/Handle.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L37)

___

### gizmoRay

• **gizmoRay**: `Ray`

#### Inherited from

BaseLinearMovementHandle.gizmoRay

#### Defined in

[src/Handles/Handle.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L27)

___

### grabDist

• **grabDist**: `number`

#### Inherited from

BaseLinearMovementHandle.grabDist

#### Defined in

[src/Handles/BaseLinearMovementHandle.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseLinearMovementHandle.ts#L12)

___

### grabPos

• **grabPos**: `Vec3`

#### Inherited from

BaseLinearMovementHandle.grabPos

#### Defined in

[src/Handles/Handle.ts:33](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L33)

___

### handleMat

• **handleMat**: `Material`

#### Defined in

[src/Handles/LinearMovementHandle.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L28)

___

### highlightColorParam

• **highlightColorParam**: `ColorParameter`

#### Inherited from

BaseLinearMovementHandle.highlightColorParam

#### Defined in

[src/Handles/Handle.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L31)

___

### holdDist

• **holdDist**: `number`

#### Inherited from

BaseLinearMovementHandle.holdDist

#### Defined in

[src/Handles/Handle.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L35)

___

### holdPos

• **holdPos**: `Vec3`

#### Inherited from

BaseLinearMovementHandle.holdPos

#### Defined in

[src/Handles/Handle.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L34)

___

### param

• **param**: `Parameter`<`unknown`\>

#### Defined in

[src/Handles/LinearMovementHandle.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L27)

___

### preventDefault

• **preventDefault**: `any`

#### Inherited from

BaseLinearMovementHandle.preventDefault

#### Defined in

[src/Handles/Handle.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L40)

___

### releasePos

• **releasePos**: `Vec3`

#### Inherited from

BaseLinearMovementHandle.releasePos

#### Defined in

[src/Handles/Handle.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L38)

___

### selectionGroup

• **selectionGroup**: `SelectionGroup`

#### Defined in

[src/Handles/LinearMovementHandle.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L32)

___

### value

• **value**: `number` \| `Vec3` \| `number`[]

#### Inherited from

BaseLinearMovementHandle.value

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

BaseLinearMovementHandle.getManipulationPlane

#### Defined in

[src/Handles/Handle.ts:72](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L72)

___

### getTargetParam

▸ **getTargetParam**(): `XfoParameter` \| `Parameter`<`unknown`\>

Returns target's global xfo parameter.

#### Returns

`XfoParameter` \| `Parameter`<`unknown`\>

- returns handle's target global Xfo.

#### Defined in

[src/Handles/LinearMovementHandle.ts:116](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L116)

___

### handlePointerDown

▸ **handlePointerDown**(`event`): `void`

Handles mouse down interaction with the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

BaseLinearMovementHandle.handlePointerDown

#### Defined in

[src/Handles/BaseLinearMovementHandle.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseLinearMovementHandle.ts#L29)

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

BaseLinearMovementHandle.handlePointerMove

#### Defined in

[src/Handles/BaseLinearMovementHandle.ts:43](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseLinearMovementHandle.ts#L43)

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

#### Inherited from

BaseLinearMovementHandle.handlePointerUp

#### Defined in

[src/Handles/BaseLinearMovementHandle.ts:58](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseLinearMovementHandle.ts#L58)

___

### highlight

▸ **highlight**(): `void`

Applies a special shinning shader to the handle to illustrate interaction with it.

#### Returns

`void`

#### Overrides

BaseLinearMovementHandle.highlight

#### Defined in

[src/Handles/LinearMovementHandle.ts:72](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L72)

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

BaseLinearMovementHandle.onDrag

#### Defined in

[src/Handles/LinearMovementHandle.ts:144](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L144)

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

BaseLinearMovementHandle.onDragEnd

#### Defined in

[src/Handles/LinearMovementHandle.ts:166](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L166)

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

BaseLinearMovementHandle.onDragStart

#### Defined in

[src/Handles/LinearMovementHandle.ts:125](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L125)

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

BaseLinearMovementHandle.onPointerDown

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

BaseLinearMovementHandle.onPointerEnter

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

BaseLinearMovementHandle.onPointerLeave

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

BaseLinearMovementHandle.onPointerMove

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

BaseLinearMovementHandle.onPointerUp

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

BaseLinearMovementHandle.onVRControllerButtonDown

#### Defined in

[src/Handles/BaseLinearMovementHandle.ts:77](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseLinearMovementHandle.ts#L77)

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

- The return value.

#### Inherited from

BaseLinearMovementHandle.onVRControllerButtonUp

#### Defined in

[src/Handles/BaseLinearMovementHandle.ts:109](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseLinearMovementHandle.ts#L109)

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

BaseLinearMovementHandle.onVRPoseChanged

#### Defined in

[src/Handles/BaseLinearMovementHandle.ts:94](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseLinearMovementHandle.ts#L94)

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

BaseLinearMovementHandle.onWheel

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

[src/Handles/LinearMovementHandle.ts:90](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L90)

___

### setTargetParam

▸ **setTargetParam**(`param`, `track?`): `void`

Sets global xfo target parameter.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `param` | `Parameter`<`any`\> | `undefined` | The video param. |
| `track` | `boolean` | `true` | The track param. |

#### Returns

`void`

#### Overrides

BaseLinearMovementHandle.setTargetParam

#### Defined in

[src/Handles/LinearMovementHandle.ts:100](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L100)

___

### unhighlight

▸ **unhighlight**(): `void`

Removes the shining shader from the handle.

#### Returns

`void`

#### Overrides

BaseLinearMovementHandle.unhighlight

#### Defined in

[src/Handles/LinearMovementHandle.ts:80](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/LinearMovementHandle.ts#L80)
