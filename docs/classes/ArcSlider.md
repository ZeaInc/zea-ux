[@zeainc/zea-ux](../API.md) / ArcSlider

# Class: ArcSlider

Class representing a slider scene widget with an arc shape. There are two parts in this widget, the slider and the handle.<br>
The **Handle** is the moving part of the widget, the object you interact with. The **Slider** is the path that the **handle** follows.

**Parameters**
* **ArcRadius(`NumberParameter`):** Specifies the radius of the slider.
* **ArcAngle(`NumberParameter`):** Specifies the arc angle of the slider.
* **HandleRadius(`NumberParameter`):** Specifies the radius of the handle in the slider.

**Events**
* **dragStart:** Triggered when the pointer is down.
* **dragEnd:** Triggered when the pointer is released.

## Hierarchy

- `BaseAxialRotationHandle`

  ↳ **`ArcSlider`**

## Table of contents

### Constructors

- [constructor](ArcSlider.md#constructor)

### Properties

- [activeController](ArcSlider.md#activecontroller)
- [arc](ArcSlider.md#arc)
- [arcAngleParam](ArcSlider.md#arcangleparam)
- [arcRadiusParam](ArcSlider.md#arcradiusparam)
- [baseXfo](ArcSlider.md#basexfo)
- [captured](ArcSlider.md#captured)
- [change](ArcSlider.md#change)
- [changedTouches](ArcSlider.md#changedtouches)
- [colorParam](ArcSlider.md#colorparam)
- [delta](ArcSlider.md#delta)
- [gizmoRay](ArcSlider.md#gizmoray)
- [grabCircleRadius](ArcSlider.md#grabcircleradius)
- [grabPos](ArcSlider.md#grabpos)
- [handle](ArcSlider.md#handle)
- [handleGeomOffsetXfo](ArcSlider.md#handlegeomoffsetxfo)
- [handleMat](ArcSlider.md#handlemat)
- [handleRadiusParam](ArcSlider.md#handleradiusparam)
- [handleXfo](ArcSlider.md#handlexfo)
- [highlightColorParam](ArcSlider.md#highlightcolorparam)
- [holdDist](ArcSlider.md#holddist)
- [holdPos](ArcSlider.md#holdpos)
- [param](ArcSlider.md#param)
- [preventDefault](ArcSlider.md#preventdefault)
- [range](ArcSlider.md#range)
- [releasePos](ArcSlider.md#releasepos)
- [selectionGroup](ArcSlider.md#selectiongroup)
- [value](ArcSlider.md#value)
- [vec0](ArcSlider.md#vec0)

### Methods

- [fromJSON](ArcSlider.md#fromjson)
- [getBaseXfo](ArcSlider.md#getbasexfo)
- [getManipulationPlane](ArcSlider.md#getmanipulationplane)
- [getTargetParam](ArcSlider.md#gettargetparam)
- [handlePointerDown](ArcSlider.md#handlepointerdown)
- [handlePointerMove](ArcSlider.md#handlepointermove)
- [handlePointerUp](ArcSlider.md#handlepointerup)
- [highlight](ArcSlider.md#highlight)
- [onDrag](ArcSlider.md#ondrag)
- [onDragEnd](ArcSlider.md#ondragend)
- [onDragStart](ArcSlider.md#ondragstart)
- [onPointerDown](ArcSlider.md#onpointerdown)
- [onPointerEnter](ArcSlider.md#onpointerenter)
- [onPointerLeave](ArcSlider.md#onpointerleave)
- [onPointerMove](ArcSlider.md#onpointermove)
- [onPointerUp](ArcSlider.md#onpointerup)
- [onVRControllerButtonDown](ArcSlider.md#onvrcontrollerbuttondown)
- [onVRControllerButtonUp](ArcSlider.md#onvrcontrollerbuttonup)
- [onVRPoseChanged](ArcSlider.md#onvrposechanged)
- [onWheel](ArcSlider.md#onwheel)
- [setSelectionGroup](ArcSlider.md#setselectiongroup)
- [setTargetParam](ArcSlider.md#settargetparam)
- [toJSON](ArcSlider.md#tojson)
- [unhighlight](ArcSlider.md#unhighlight)

## Constructors

### constructor

• **new ArcSlider**(`name?`, `arcRadius?`, `arcAngle?`, `handleRadius?`, `color?`)

Creates an instance of ArcSlider.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name?` | `string` | `undefined` | The name value |
| `arcRadius?` | `number` | `1` | The arcRadius value |
| `arcAngle?` | `number` | `1` | The arcAngle value |
| `handleRadius?` | `number` | `0.02` | The handleRadius value |
| `color?` | `Color` | `undefined` | - |

#### Overrides

BaseAxialRotationHandle.constructor

#### Defined in

[src/Handles/ArcSlider.ts:59](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L59)

## Properties

### activeController

• **activeController**: `any`

#### Inherited from

BaseAxialRotationHandle.activeController

#### Defined in

[src/Handles/Handle.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L28)

___

### arc

• **arc**: `GeomItem`

#### Defined in

[src/Handles/ArcSlider.ts:46](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L46)

___

### arcAngleParam

• **arcAngleParam**: `NumberParameter`

#### Defined in

[src/Handles/ArcSlider.ts:42](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L42)

___

### arcRadiusParam

• **arcRadiusParam**: `NumberParameter`

#### Defined in

[src/Handles/ArcSlider.ts:41](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L41)

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

[src/Handles/ArcSlider.ts:45](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L45)

___

### handleGeomOffsetXfo

• **handleGeomOffsetXfo**: `Xfo`

#### Defined in

[src/Handles/ArcSlider.ts:48](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L48)

___

### handleMat

• **handleMat**: `Material`

#### Defined in

[src/Handles/ArcSlider.ts:44](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L44)

___

### handleRadiusParam

• **handleRadiusParam**: `NumberParameter`

#### Defined in

[src/Handles/ArcSlider.ts:43](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L43)

___

### handleXfo

• **handleXfo**: `Xfo`

#### Defined in

[src/Handles/ArcSlider.ts:47](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L47)

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

### fromJSON

▸ **fromJSON**(`json`, `context`): `void`

Restores handle item from a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `json` | `Record`<`string`, `any`\> | The json param. |
| `context` | `Record`<`string`, `any`\> | The context param. |

#### Returns

`void`

#### Overrides

BaseAxialRotationHandle.fromJSON

#### Defined in

[src/Handles/ArcSlider.ts:329](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L329)

___

### getBaseXfo

▸ **getBaseXfo**(): `Xfo`

Returns handle's global Xfo

#### Returns

`Xfo`

- The Xfo value

#### Defined in

[src/Handles/ArcSlider.ts:221](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L221)

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

[src/Handles/ArcSlider.ts:150](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L150)

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

[src/Handles/ArcSlider.ts:254](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L254)

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

[src/Handles/ArcSlider.ts:303](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L303)

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

[src/Handles/ArcSlider.ts:230](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L230)

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

BaseAxialRotationHandle.onPointerDown

#### Defined in

[src/Handles/ArcSlider.ts:140](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L140)

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

#### Overrides

BaseAxialRotationHandle.onPointerEnter

#### Defined in

[src/Handles/ArcSlider.ts:122](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L122)

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

#### Overrides

BaseAxialRotationHandle.onPointerLeave

#### Defined in

[src/Handles/ArcSlider.ts:131](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L131)

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
| `param` | `NumberParameter` \| `XfoParameter` | `undefined` | The param param. |
| `track` | `boolean` | `true` | The track param. |

#### Returns

`void`

#### Overrides

BaseAxialRotationHandle.setTargetParam

#### Defined in

[src/Handles/ArcSlider.ts:182](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L182)

___

### toJSON

▸ **toJSON**(`context`): `Record`<`string`, `any`\>

Serializes handle item as a JSON object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`<`string`, `any`\> | The context param. |

#### Returns

`Record`<`string`, `any`\>

The return value.

#### Overrides

BaseAxialRotationHandle.toJSON

#### Defined in

[src/Handles/ArcSlider.ts:317](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L317)

___

### unhighlight

▸ **unhighlight**(): `void`

Removes the shining shader from the handle.

#### Returns

`void`

#### Overrides

BaseAxialRotationHandle.unhighlight

#### Defined in

[src/Handles/ArcSlider.ts:158](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/ArcSlider.ts#L158)
