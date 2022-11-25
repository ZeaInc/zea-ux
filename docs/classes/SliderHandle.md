[@zeainc/zea-ux](../API.md) / SliderHandle

# Class: SliderHandle

Class representing a slider scene widget. There are two parts in this widget, the slider and the handle.<br>
The **Handle** is the moving part of the widget, the object you interact with. The **Slider** is the path that the **handle** follows.

**Parameters**
* **Length(`NumberParameter`):** Specifies the length of the slider.
* **HandleRadius(`NumberParameter`):** Specifies the handle radius.
* **BarRadius(`NumberParameter`):** Specifies the radius of the slider.

## Hierarchy

- `BaseLinearMovementHandle`

  ↳ **`SliderHandle`**

## Table of contents

### Constructors

- [constructor](SliderHandle.md#constructor)

### Properties

- [activeController](SliderHandle.md#activecontroller)
- [barRadiusParam](SliderHandle.md#barradiusparam)
- [baseBar](SliderHandle.md#basebar)
- [baseBarXfo](SliderHandle.md#basebarxfo)
- [captured](SliderHandle.md#captured)
- [change](SliderHandle.md#change)
- [changedTouches](SliderHandle.md#changedtouches)
- [colorParam](SliderHandle.md#colorparam)
- [delta](SliderHandle.md#delta)
- [gizmoRay](SliderHandle.md#gizmoray)
- [grabDist](SliderHandle.md#grabdist)
- [grabPos](SliderHandle.md#grabpos)
- [handle](SliderHandle.md#handle)
- [handleMat](SliderHandle.md#handlemat)
- [handleRadiusParam](SliderHandle.md#handleradiusparam)
- [handleXfo](SliderHandle.md#handlexfo)
- [highlightColorParam](SliderHandle.md#highlightcolorparam)
- [holdDist](SliderHandle.md#holddist)
- [holdPos](SliderHandle.md#holdpos)
- [lengthParam](SliderHandle.md#lengthparam)
- [param](SliderHandle.md#param)
- [preventDefault](SliderHandle.md#preventdefault)
- [releasePos](SliderHandle.md#releasepos)
- [topBar](SliderHandle.md#topbar)
- [topBarXfo](SliderHandle.md#topbarxfo)
- [value](SliderHandle.md#value)

### Methods

- [\_\_updateSlider](SliderHandle.md#__updateslider)
- [fromJSON](SliderHandle.md#fromjson)
- [getManipulationPlane](SliderHandle.md#getmanipulationplane)
- [handlePointerDown](SliderHandle.md#handlepointerdown)
- [handlePointerMove](SliderHandle.md#handlepointermove)
- [handlePointerUp](SliderHandle.md#handlepointerup)
- [highlight](SliderHandle.md#highlight)
- [onDrag](SliderHandle.md#ondrag)
- [onDragEnd](SliderHandle.md#ondragend)
- [onDragStart](SliderHandle.md#ondragstart)
- [onPointerDown](SliderHandle.md#onpointerdown)
- [onPointerEnter](SliderHandle.md#onpointerenter)
- [onPointerLeave](SliderHandle.md#onpointerleave)
- [onPointerMove](SliderHandle.md#onpointermove)
- [onPointerUp](SliderHandle.md#onpointerup)
- [onVRControllerButtonDown](SliderHandle.md#onvrcontrollerbuttondown)
- [onVRControllerButtonUp](SliderHandle.md#onvrcontrollerbuttonup)
- [onVRPoseChanged](SliderHandle.md#onvrposechanged)
- [onWheel](SliderHandle.md#onwheel)
- [setTargetParam](SliderHandle.md#settargetparam)
- [toJSON](SliderHandle.md#tojson)
- [unhighlight](SliderHandle.md#unhighlight)

## Constructors

### constructor

• **new SliderHandle**(`name?`, `length?`, `radius?`, `color?`)

Create a slider scene widget.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name?` | `string` | `undefined` | The name value. |
| `length` | `number` | `0.5` | The length value. |
| `radius` | `number` | `0.02` | The radius value. |
| `color` | `Color` | `undefined` | The color value. |

#### Overrides

BaseLinearMovementHandle.constructor

#### Defined in

[src/Handles/SliderHandle.ts:54](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L54)

## Properties

### activeController

• **activeController**: `any`

#### Inherited from

BaseLinearMovementHandle.activeController

#### Defined in

[src/Handles/Handle.ts:28](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L28)

___

### barRadiusParam

• **barRadiusParam**: `NumberParameter`

#### Defined in

[src/Handles/SliderHandle.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L36)

___

### baseBar

• **baseBar**: `GeomItem`

#### Defined in

[src/Handles/SliderHandle.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L40)

___

### baseBarXfo

• **baseBarXfo**: `Xfo`

#### Defined in

[src/Handles/SliderHandle.ts:43](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L43)

___

### captured

• **captured**: `boolean` = `false`

#### Inherited from

BaseLinearMovementHandle.captured

#### Defined in

[src/Handles/Handle.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L29)

___

### change

• **change**: [`ParameterValueChange`](ParameterValueChange.md)

#### Defined in

[src/Handles/SliderHandle.ts:45](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L45)

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

### handle

• **handle**: `GeomItem`

#### Defined in

[src/Handles/SliderHandle.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L39)

___

### handleMat

• **handleMat**: `Material`

#### Defined in

[src/Handles/SliderHandle.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L38)

___

### handleRadiusParam

• **handleRadiusParam**: `NumberParameter`

#### Defined in

[src/Handles/SliderHandle.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L37)

___

### handleXfo

• **handleXfo**: `Xfo`

#### Defined in

[src/Handles/SliderHandle.ts:42](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L42)

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

### lengthParam

• **lengthParam**: `NumberParameter`

#### Defined in

[src/Handles/SliderHandle.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L35)

___

### param

• **param**: `Parameter`<`unknown`\>

#### Defined in

[src/Handles/SliderHandle.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L34)

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

### topBar

• **topBar**: `GeomItem`

#### Defined in

[src/Handles/SliderHandle.ts:41](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L41)

___

### topBarXfo

• **topBarXfo**: `Xfo`

#### Defined in

[src/Handles/SliderHandle.ts:44](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L44)

___

### value

• **value**: `number` \| `Vec3` \| `number`[]

#### Inherited from

BaseLinearMovementHandle.value

#### Defined in

[src/Handles/Handle.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Handle.ts#L36)

## Methods

### \_\_updateSlider

▸ `Private` **__updateSlider**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[src/Handles/SliderHandle.ts:135](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L135)

___

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

BaseLinearMovementHandle.fromJSON

#### Defined in

[src/Handles/SliderHandle.ts:225](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L225)

___

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

[src/Handles/SliderHandle.ts:101](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L101)

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

[src/Handles/SliderHandle.ts:175](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L175)

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

[src/Handles/SliderHandle.ts:200](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L200)

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

[src/Handles/SliderHandle.ts:158](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L158)

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

### setTargetParam

▸ **setTargetParam**(`param`): `void`

Sets global xfo target parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param` | `Parameter`<`unknown`\> | The video param. |

#### Returns

`void`

#### Overrides

BaseLinearMovementHandle.setTargetParam

#### Defined in

[src/Handles/SliderHandle.ts:120](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L120)

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

BaseLinearMovementHandle.toJSON

#### Defined in

[src/Handles/SliderHandle.ts:213](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L213)

___

### unhighlight

▸ **unhighlight**(): `void`

Removes the shining shader from the handle.

#### Returns

`void`

#### Overrides

BaseLinearMovementHandle.unhighlight

#### Defined in

[src/Handles/SliderHandle.ts:109](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/SliderHandle.ts#L109)
