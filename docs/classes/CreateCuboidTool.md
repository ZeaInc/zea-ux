[@zeainc/zea-ux](../API.md) / CreateCuboidTool

# Class: CreateCuboidTool

Tool for creating Cuboid geometry.

**Events**
* **actionFinished:** Triggered when the creation of the geometry is completed.

## Hierarchy

- `CreateGeomTool`

  ↳ **`CreateCuboidTool`**

## Table of contents

### Constructors

- [constructor](CreateCuboidTool.md#constructor)

### Properties

- [\_\_activeController](CreateCuboidTool.md#__activecontroller)
- [\_height](CreateCuboidTool.md#_height)
- [appData](CreateCuboidTool.md#appdata)
- [change](CreateCuboidTool.md#change)
- [colorParam](CreateCuboidTool.md#colorparam)
- [constructionPlane](CreateCuboidTool.md#constructionplane)
- [invXfo](CreateCuboidTool.md#invxfo)
- [parentItem](CreateCuboidTool.md#parentitem)
- [prevCursor](CreateCuboidTool.md#prevcursor)
- [pt1](CreateCuboidTool.md#pt1)
- [removeToolOnRightClick](CreateCuboidTool.md#removetoolonrightclick)
- [stage](CreateCuboidTool.md#stage)
- [vrControllerToolTip](CreateCuboidTool.md#vrcontrollertooltip)
- [vrControllerToolTipMat](CreateCuboidTool.md#vrcontrollertooltipmat)
- [xfo](CreateCuboidTool.md#xfo)

### Methods

- [activateTool](CreateCuboidTool.md#activatetool)
- [addIconToVRController](CreateCuboidTool.md#addicontovrcontroller)
- [controllerAddedHandler](CreateCuboidTool.md#controlleraddedhandler)
- [createMove](CreateCuboidTool.md#createmove)
- [createPoint](CreateCuboidTool.md#createpoint)
- [createRelease](CreateCuboidTool.md#createrelease)
- [createStart](CreateCuboidTool.md#createstart)
- [deactivateTool](CreateCuboidTool.md#deactivatetool)
- [onKeyDown](CreateCuboidTool.md#onkeydown)
- [onKeyPressed](CreateCuboidTool.md#onkeypressed)
- [onKeyUp](CreateCuboidTool.md#onkeyup)
- [onPointerDown](CreateCuboidTool.md#onpointerdown)
- [onPointerMove](CreateCuboidTool.md#onpointermove)
- [onPointerUp](CreateCuboidTool.md#onpointerup)
- [onTouchCancel](CreateCuboidTool.md#ontouchcancel)
- [onVRControllerButtonDown](CreateCuboidTool.md#onvrcontrollerbuttondown)
- [onVRControllerButtonUp](CreateCuboidTool.md#onvrcontrollerbuttonup)
- [onVRPoseChanged](CreateCuboidTool.md#onvrposechanged)
- [onWheel](CreateCuboidTool.md#onwheel)
- [screenPosToXfo](CreateCuboidTool.md#screenpostoxfo)

## Constructors

### constructor

• **new CreateCuboidTool**(`appData`)

Create a create cuboid tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value. |

#### Overrides

CreateGeomTool.constructor

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:26](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L26)

## Properties

### \_\_activeController

• **\_\_activeController**: `any`

#### Inherited from

CreateGeomTool.\_\_activeController

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L40)

___

### \_height

• **\_height**: `number`

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L19)

___

### appData

• **appData**: [`AppData`](../interfaces/AppData.md)

#### Inherited from

CreateGeomTool.appData

#### Defined in

[src/Tools/BaseCreateTool.ts:10](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/BaseCreateTool.ts#L10)

___

### change

• **change**: [`CreateCuboidChange`](CreateCuboidChange.md)

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L16)

___

### colorParam

• **colorParam**: `ColorParameter`

#### Inherited from

CreateGeomTool.colorParam

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L35)

___

### constructionPlane

• **constructionPlane**: `Xfo`

#### Inherited from

CreateGeomTool.constructionPlane

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L39)

___

### invXfo

• **invXfo**: `Xfo`

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:18](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L18)

___

### parentItem

• **parentItem**: `TreeItem`

#### Inherited from

CreateGeomTool.parentItem

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L34)

___

### prevCursor

• **prevCursor**: `string`

#### Inherited from

CreateGeomTool.prevCursor

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L38)

___

### pt1

• **pt1**: `Vec3`

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L20)

___

### removeToolOnRightClick

• **removeToolOnRightClick**: `boolean`

#### Inherited from

CreateGeomTool.removeToolOnRightClick

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:33](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L33)

___

### stage

• **stage**: `number`

#### Inherited from

CreateGeomTool.stage

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L32)

___

### vrControllerToolTip

• **vrControllerToolTip**: `BaseGeom` \| `Cross`

#### Inherited from

CreateGeomTool.vrControllerToolTip

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L37)

___

### vrControllerToolTipMat

• **vrControllerToolTipMat**: `Material`

#### Inherited from

CreateGeomTool.vrControllerToolTipMat

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L36)

___

### xfo

• **xfo**: `Xfo`

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:17](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L17)

## Methods

### activateTool

▸ **activateTool**(): `void`

The activateTool method.

#### Returns

`void`

#### Inherited from

CreateGeomTool.activateTool

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:84](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L84)

___

### addIconToVRController

▸ **addIconToVRController**(`controller`): `void`

Adds a geometry icon to the VR Controller

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `controller` | `XRController` | The controller object. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.addIconToVRController

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:64](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L64)

___

### controllerAddedHandler

▸ **controllerAddedHandler**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Object` |
| `event.controller` | `any` |

#### Returns

`void`

#### Inherited from

CreateGeomTool.controllerAddedHandler

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:77](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L77)

___

### createMove

▸ **createMove**(`pt`): `void`

Updates cuboid structural properties.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pt` | `Vec3` | The pt param. |

#### Returns

`void`

#### Overrides

CreateGeomTool.createMove

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:54](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L54)

___

### createPoint

▸ **createPoint**(`pt`): `void`

The createPoint method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pt` | `Vec3` | The pt param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.createPoint

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:162](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L162)

___

### createRelease

▸ **createRelease**(`pt`): `void`

Finishes the creation of the cuboid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pt` | `Vec3` | The pt param. |

#### Returns

`void`

#### Overrides

CreateGeomTool.createRelease

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:74](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L74)

___

### createStart

▸ **createStart**(`xfo`): `void`

Starts the creation of the cuboid.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xfo` | `Xfo` | The xfo param. |

#### Returns

`void`

#### Overrides

CreateGeomTool.createStart

#### Defined in

[src/Tools/CreateTools/CreateCuboidTool.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateCuboidTool.ts#L35)

___

### deactivateTool

▸ **deactivateTool**(): `void`

The deactivateTool method.

#### Returns

`void`

#### Inherited from

CreateGeomTool.deactivateTool

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:101](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L101)

___

### onKeyDown

▸ **onKeyDown**(`event`): `void`

Event fired when the user presses down a key on the keyboard, while the tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `KeyboardEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onKeyDown

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:280](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L280)

___

### onKeyPressed

▸ **onKeyPressed**(`event`): `void`

Event fired when the user presses a key on the keyboard, while the tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `KeyboardEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onKeyPressed

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:271](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L271)

___

### onKeyUp

▸ **onKeyUp**(`event`): `void`

Event fired when the user releases a key on the keyboard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `KeyboardEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onKeyUp

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:289](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L289)

___

### onPointerDown

▸ **onPointerDown**(`event`): `void`

Event fired when a pointing device button is pressed over the viewport while the tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onPointerDown

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:192](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L192)

___

### onPointerMove

▸ **onPointerMove**(`event`): `void`

Event fired when a pointing device is moved while the cursor's hotspot is inside the viewport, while tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onPointerMove

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:227](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L227)

___

### onPointerUp

▸ **onPointerUp**(`event`): `void`

Event fired when a pointing device button is released while the pointer is over the viewport, while the tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onPointerUp

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:244](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L244)

___

### onTouchCancel

▸ **onTouchCancel**(`event`): `void`

Event fired when one or more touch points have been disrupted in an implementation-specific manner inside the viewport, when the tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onTouchCancel

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:300](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L300)

___

### onVRControllerButtonDown

▸ **onVRControllerButtonDown**(`event`): `void`

Event fired when a VR controller button is pressed inside the viewport, when the tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onVRControllerButtonDown

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:312](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L312)

___

### onVRControllerButtonUp

▸ **onVRControllerButtonUp**(`event`): `void`

Event fired when a VR controller button is released inside the viewport, when the tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onVRControllerButtonUp

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:343](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L343)

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

CreateGeomTool.onVRPoseChanged

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:329](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L329)

___

### onWheel

▸ **onWheel**(`event`): `void`

Event fired when the user rotates the pointing device wheel, while the tool is activated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

CreateGeomTool.onWheel

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:259](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L259)

___

### screenPosToXfo

▸ **screenPosToXfo**(`event`): `Xfo`

Transforms the screen position in the viewport to an Xfo object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param |

#### Returns

`Xfo`

The return value.

#### Inherited from

CreateGeomTool.screenPosToXfo

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:120](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L120)
