[@zeainc/zea-ux](../API.md) / AxialRotationHandle

# Class: AxialRotationHandle

Class representing an axial rotation scene widget. It has a `Torus` shape and is used to rotate objects around the specified axes.
You can do it by specifying the localXfo orientation:

```javascript
const xfo = new Xfo()
// This is rotation over `Y` axis
xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
axialRotationHandle.localXfoParam.value = xfo
```
**Parameters**
* **Radius(`NumberParameter`):** Specifies the radius of the handler.

## Hierarchy

- `BaseAxialRotationHandle`

  ↳ **`AxialRotationHandle`**

## Table of contents

### Constructors

- [constructor](AxialRotationHandle.md#constructor)

### Properties

- [activeController](AxialRotationHandle.md#activecontroller)
- [baseXfo](AxialRotationHandle.md#basexfo)
- [captured](AxialRotationHandle.md#captured)
- [change](AxialRotationHandle.md#change)
- [changedTouches](AxialRotationHandle.md#changedtouches)
- [colorParam](AxialRotationHandle.md#colorparam)
- [delta](AxialRotationHandle.md#delta)
- [gizmoRay](AxialRotationHandle.md#gizmoray)
- [grabCircleRadius](AxialRotationHandle.md#grabcircleradius)
- [grabPos](AxialRotationHandle.md#grabpos)
- [handle](AxialRotationHandle.md#handle)
- [handleMat](AxialRotationHandle.md#handlemat)
- [handleXfo](AxialRotationHandle.md#handlexfo)
- [highlightColorParam](AxialRotationHandle.md#highlightcolorparam)
- [holdDist](AxialRotationHandle.md#holddist)
- [holdPos](AxialRotationHandle.md#holdpos)
- [param](AxialRotationHandle.md#param)
- [preventDefault](AxialRotationHandle.md#preventdefault)
- [radiusParam](AxialRotationHandle.md#radiusparam)
- [range](AxialRotationHandle.md#range)
- [releasePos](AxialRotationHandle.md#releasepos)
- [selectionGroup](AxialRotationHandle.md#selectiongroup)
- [value](AxialRotationHandle.md#value)
- [vec0](AxialRotationHandle.md#vec0)

### Methods

- [getBaseXfo](AxialRotationHandle.md#getbasexfo)
- [getManipulationPlane](AxialRotationHandle.md#getmanipulationplane)
- [getTargetParam](AxialRotationHandle.md#gettargetparam)
- [handlePointerDown](AxialRotationHandle.md#handlepointerdown)
- [handlePointerMove](AxialRotationHandle.md#handlepointermove)
- [handlePointerUp](AxialRotationHandle.md#handlepointerup)
- [highlight](AxialRotationHandle.md#highlight)
- [onDrag](AxialRotationHandle.md#ondrag)
- [onDragEnd](AxialRotationHandle.md#ondragend)
- [onDragStart](AxialRotationHandle.md#ondragstart)
- [onPointerDown](AxialRotationHandle.md#onpointerdown)
- [onPointerEnter](AxialRotationHandle.md#onpointerenter)
- [onPointerLeave](AxialRotationHandle.md#onpointerleave)
- [onPointerMove](AxialRotationHandle.md#onpointermove)
- [onPointerUp](AxialRotationHandle.md#onpointerup)
- [onVRControllerButtonDown](AxialRotationHandle.md#onvrcontrollerbuttondown)
- [onVRControllerButtonUp](AxialRotationHandle.md#onvrcontrollerbuttonup)
- [onVRPoseChanged](AxialRotationHandle.md#onvrposechanged)
- [onWheel](AxialRotationHandle.md#onwheel)
- [setSelectionGroup](AxialRotationHandle.md#setselectiongroup)
- [setTargetParam](AxialRotationHandle.md#settargetparam)
- [unhighlight](AxialRotationHandle.md#unhighlight)

## Constructors

### constructor

• **new AxialRotationHandle**(`name`, `radius`, `thickness`, `color?`)

Create an axial rotation scene widget.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name value. |
| `radius` | `number` | The radius value. |
| `thickness` | `number` | The thickness value. |
| `color` | `Color` | The color value. |

#### Overrides

BaseAxialRotationHandle.constructor

#### Defined in

[src/Handles/AxialRotationHandle.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L34)

## Properties

### activeController

• **activeController**: `any`

#### Inherited from

BaseAxialRotationHandle.activeController

#### Defined in

[src/Handles/Handle.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L28)

___

### baseXfo

• **baseXfo**: `Xfo`

#### Inherited from

BaseAxialRotationHandle.baseXfo

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:26](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L26)

___

### captured

• **captured**: `boolean` = `false`

#### Inherited from

BaseAxialRotationHandle.captured

#### Defined in

[src/Handles/Handle.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L29)

___

### change

• **change**: [`Change`](Change.md)

#### Inherited from

BaseAxialRotationHandle.change

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L29)

___

### changedTouches

• **changedTouches**: `boolean`

#### Inherited from

BaseAxialRotationHandle.changedTouches

#### Defined in

[src/Handles/Handle.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L39)

___

### colorParam

• **colorParam**: `ColorParameter`

#### Inherited from

BaseAxialRotationHandle.colorParam

#### Defined in

[src/Handles/Handle.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L30)

___

### delta

• **delta**: `number` \| `Vec3` \| `number`[]

#### Inherited from

BaseAxialRotationHandle.delta

#### Defined in

[src/Handles/Handle.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L37)

___

### gizmoRay

• **gizmoRay**: `Ray`

#### Inherited from

BaseAxialRotationHandle.gizmoRay

#### Defined in

[src/Handles/Handle.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L27)

___

### grabCircleRadius

• **grabCircleRadius**: `number`

#### Inherited from

BaseAxialRotationHandle.grabCircleRadius

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L27)

___

### grabPos

• **grabPos**: `Vec3`

#### Inherited from

BaseAxialRotationHandle.grabPos

#### Defined in

[src/Handles/Handle.ts:33](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L33)

___

### handle

• **handle**: `GeomItem`

#### Defined in

[src/Handles/AxialRotationHandle.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L25)

___

### handleMat

• **handleMat**: `Material`

#### Defined in

[src/Handles/AxialRotationHandle.ts:23](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L23)

___

### handleXfo

• **handleXfo**: `Xfo`

#### Defined in

[src/Handles/AxialRotationHandle.ts:24](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L24)

___

### highlightColorParam

• **highlightColorParam**: `ColorParameter`

#### Inherited from

BaseAxialRotationHandle.highlightColorParam

#### Defined in

[src/Handles/Handle.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L31)

___

### holdDist

• **holdDist**: `number`

#### Inherited from

BaseAxialRotationHandle.holdDist

#### Defined in

[src/Handles/Handle.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L35)

___

### holdPos

• **holdPos**: `Vec3`

#### Inherited from

BaseAxialRotationHandle.holdPos

#### Defined in

[src/Handles/Handle.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L34)

___

### param

• **param**: `NumberParameter` \| `XfoParameter`

#### Inherited from

BaseAxialRotationHandle.param

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L25)

___

### preventDefault

• **preventDefault**: `any`

#### Inherited from

BaseAxialRotationHandle.preventDefault

#### Defined in

[src/Handles/Handle.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L40)

___

### radiusParam

• **radiusParam**: `NumberParameter`

#### Defined in

[src/Handles/AxialRotationHandle.ts:22](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L22)

___

### range

• **range**: `number`[]

#### Inherited from

BaseAxialRotationHandle.range

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L30)

___

### releasePos

• **releasePos**: `Vec3`

#### Inherited from

BaseAxialRotationHandle.releasePos

#### Defined in

[src/Handles/Handle.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L38)

___

### selectionGroup

• **selectionGroup**: `SelectionGroup`

#### Inherited from

BaseAxialRotationHandle.selectionGroup

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L32)

___

### value

• **value**: `number` \| `Vec3` \| `number`[]

#### Inherited from

BaseAxialRotationHandle.value

#### Defined in

[src/Handles/Handle.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L36)

___

### vec0

• **vec0**: `Vec3`

#### Inherited from

BaseAxialRotationHandle.vec0

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L28)

## Methods

### getBaseXfo

▸ **getBaseXfo**(): `Xfo`

Returns handle's global Xfo

#### Returns

`Xfo`

- The Xfo value

#### Defined in

[src/Handles/AxialRotationHandle.ts:85](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L85)

___

### getManipulationPlane

▸ **getManipulationPlane**(): `Ray`

Returns the manipulation plane of the handle, denoting a start and a direction.

#### Returns

`Ray`

The return value.

#### Inherited from

BaseAxialRotationHandle.getManipulationPlane

#### Defined in

[src/Handles/Handle.ts:72](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L72)

___

### getTargetParam

▸ **getTargetParam**(): `NumberParameter` \| `XfoParameter`

Returns target's global xfo parameter.

#### Returns

`NumberParameter` \| `XfoParameter`

- returns handle's target global Xfo.

#### Inherited from

BaseAxialRotationHandle.getTargetParam

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:73](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L73)

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

BaseAxialRotationHandle.handlePointerDown

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

BaseAxialRotationHandle.handlePointerMove

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

BaseAxialRotationHandle.handlePointerUp

#### Defined in

[src/Handles/Handle.ts:196](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L196)

___

### highlight

▸ **highlight**(): `void`

Applies a special shinning shader to the handle to illustrate interaction with it.

#### Returns

`void`

#### Overrides

BaseAxialRotationHandle.highlight

#### Defined in

[src/Handles/AxialRotationHandle.ts:67](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L67)

___

### onDrag

▸ **onDrag**(`event`): `void`

Handles drag interaction of the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseAxialRotationHandle.onDrag

#### Defined in

[src/Handles/AxialRotationHandle.ts:103](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L103)

___

### onDragEnd

▸ **onDragEnd**(`event`): `void`

Handles the end of dragging interaction with the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseAxialRotationHandle.onDragEnd

#### Defined in

[src/Handles/AxialRotationHandle.ts:112](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L112)

___

### onDragStart

▸ **onDragStart**(`event`): `void`

Handles the initially drag interaction of the handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseAxialRotationHandle.onDragStart

#### Defined in

[src/Handles/AxialRotationHandle.ts:94](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L94)

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

BaseAxialRotationHandle.onPointerDown

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

BaseAxialRotationHandle.onPointerEnter

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

BaseAxialRotationHandle.onPointerLeave

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

BaseAxialRotationHandle.onPointerMove

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

BaseAxialRotationHandle.onPointerUp

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

BaseAxialRotationHandle.onVRControllerButtonDown

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

BaseAxialRotationHandle.onVRControllerButtonUp

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

BaseAxialRotationHandle.onVRPoseChanged

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

BaseAxialRotationHandle.onWheel

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

#### Inherited from

BaseAxialRotationHandle.setSelectionGroup

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:47](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L47)

___

### setTargetParam

▸ **setTargetParam**(`param`, `track?`): `void`

Sets global xfo target parameter

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `param` | `XfoParameter` | `undefined` | The param param. |
| `track` | `boolean` | `true` | The track param. |

#### Returns

`void`

#### Inherited from

BaseAxialRotationHandle.setTargetParam

#### Defined in

[src/Handles/BaseAxialRotationHandle.ts:57](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/BaseAxialRotationHandle.ts#L57)

___

### unhighlight

▸ **unhighlight**(): `void`

Removes the shining shader from the handle.

#### Returns

`void`

#### Overrides

BaseAxialRotationHandle.unhighlight

#### Defined in

[src/Handles/AxialRotationHandle.ts:75](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/AxialRotationHandle.ts#L75)
