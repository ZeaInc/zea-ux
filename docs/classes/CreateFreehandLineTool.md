[@zeainc/zea-ux](../API.md) / CreateFreehandLineTool

# Class: CreateFreehandLineTool

Tool for creating a free hand line.

**Events**
* **actionFinished:** Triggered when the creation of the geometry is completed.

## Hierarchy

- [`CreateLineTool`](CreateLineTool.md)

  ↳ **`CreateFreehandLineTool`**

## Table of contents

### Constructors

- [constructor](CreateFreehandLineTool.md#constructor)

### Properties

- [\_\_activeController](CreateFreehandLineTool.md#__activecontroller)
- [appData](CreateFreehandLineTool.md#appdata)
- [change](CreateFreehandLineTool.md#change)
- [colorParam](CreateFreehandLineTool.md#colorparam)
- [constructionPlane](CreateFreehandLineTool.md#constructionplane)
- [invXfo](CreateFreehandLineTool.md#invxfo)
- [length](CreateFreehandLineTool.md#length)
- [lineThickness](CreateFreehandLineTool.md#linethickness)
- [mp](CreateFreehandLineTool.md#mp)
- [parentItem](CreateFreehandLineTool.md#parentitem)
- [prevCursor](CreateFreehandLineTool.md#prevcursor)
- [prevP](CreateFreehandLineTool.md#prevp)
- [removeToolOnRightClick](CreateFreehandLineTool.md#removetoolonrightclick)
- [stage](CreateFreehandLineTool.md#stage)
- [vrControllerToolTip](CreateFreehandLineTool.md#vrcontrollertooltip)
- [vrControllerToolTipMat](CreateFreehandLineTool.md#vrcontrollertooltipmat)
- [xfo](CreateFreehandLineTool.md#xfo)

### Methods

- [activateTool](CreateFreehandLineTool.md#activatetool)
- [addIconToVRController](CreateFreehandLineTool.md#addicontovrcontroller)
- [controllerAddedHandler](CreateFreehandLineTool.md#controlleraddedhandler)
- [createMove](CreateFreehandLineTool.md#createmove)
- [createPoint](CreateFreehandLineTool.md#createpoint)
- [createRelease](CreateFreehandLineTool.md#createrelease)
- [createStart](CreateFreehandLineTool.md#createstart)
- [deactivateTool](CreateFreehandLineTool.md#deactivatetool)
- [onKeyDown](CreateFreehandLineTool.md#onkeydown)
- [onKeyPressed](CreateFreehandLineTool.md#onkeypressed)
- [onKeyUp](CreateFreehandLineTool.md#onkeyup)
- [onPointerDown](CreateFreehandLineTool.md#onpointerdown)
- [onPointerMove](CreateFreehandLineTool.md#onpointermove)
- [onPointerUp](CreateFreehandLineTool.md#onpointerup)
- [onTouchCancel](CreateFreehandLineTool.md#ontouchcancel)
- [onVRControllerButtonDown](CreateFreehandLineTool.md#onvrcontrollerbuttondown)
- [onVRControllerButtonUp](CreateFreehandLineTool.md#onvrcontrollerbuttonup)
- [onVRPoseChanged](CreateFreehandLineTool.md#onvrposechanged)
- [onWheel](CreateFreehandLineTool.md#onwheel)
- [screenPosToXfo](CreateFreehandLineTool.md#screenpostoxfo)

## Constructors

### constructor

• **new CreateFreehandLineTool**(`appData`)

Create a create freehand line tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value. |

#### Overrides

[CreateLineTool](CreateLineTool.md).[constructor](CreateLineTool.md#constructor)

#### Defined in

[src/Tools/CreateTools/CreateFreehandLineTool.ts:25](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateFreehandLineTool.ts#L25)

## Properties

### \_\_activeController

• **\_\_activeController**: `any`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[__activeController](CreateLineTool.md#__activecontroller)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L40)

___

### appData

• **appData**: [`AppData`](../interfaces/AppData.md)

#### Inherited from

[CreateLineTool](CreateLineTool.md).[appData](CreateLineTool.md#appdata)

#### Defined in

[src/Tools/BaseCreateTool.ts:10](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/BaseCreateTool.ts#L10)

___

### change

• **change**: [`CreateLineChange`](CreateLineChange.md)

#### Inherited from

[CreateLineTool](CreateLineTool.md).[change](CreateLineTool.md#change)

#### Defined in

[src/Tools/CreateTools/CreateLineTool.ts:18](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateLineTool.ts#L18)

___

### colorParam

• **colorParam**: `ColorParameter`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[colorParam](CreateLineTool.md#colorparam)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L35)

___

### constructionPlane

• **constructionPlane**: `Xfo`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[constructionPlane](CreateLineTool.md#constructionplane)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:39](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L39)

___

### invXfo

• **invXfo**: `Xfo`

#### Defined in

[src/Tools/CreateTools/CreateFreehandLineTool.ts:18](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateFreehandLineTool.ts#L18)

___

### length

• **length**: `number`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[length](CreateLineTool.md#length)

#### Defined in

[src/Tools/CreateTools/CreateLineTool.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateLineTool.ts#L19)

___

### lineThickness

• **lineThickness**: `NumberParameter`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[lineThickness](CreateLineTool.md#linethickness)

#### Defined in

[src/Tools/CreateTools/CreateLineTool.ts:17](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateLineTool.ts#L17)

___

### mp

• **mp**: `BooleanParameter`

#### Defined in

[src/Tools/CreateTools/CreateFreehandLineTool.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateFreehandLineTool.ts#L16)

___

### parentItem

• **parentItem**: `TreeItem`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[parentItem](CreateLineTool.md#parentitem)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L34)

___

### prevCursor

• **prevCursor**: `string`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[prevCursor](CreateLineTool.md#prevcursor)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:38](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L38)

___

### prevP

• **prevP**: `Vec3`

#### Defined in

[src/Tools/CreateTools/CreateFreehandLineTool.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateFreehandLineTool.ts#L19)

___

### removeToolOnRightClick

• **removeToolOnRightClick**: `boolean`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[removeToolOnRightClick](CreateLineTool.md#removetoolonrightclick)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:33](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L33)

___

### stage

• **stage**: `number`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[stage](CreateLineTool.md#stage)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L32)

___

### vrControllerToolTip

• **vrControllerToolTip**: `BaseGeom` \| `Cross`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[vrControllerToolTip](CreateLineTool.md#vrcontrollertooltip)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L37)

___

### vrControllerToolTipMat

• **vrControllerToolTipMat**: `Material`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[vrControllerToolTipMat](CreateLineTool.md#vrcontrollertooltipmat)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L36)

___

### xfo

• **xfo**: `Xfo`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[xfo](CreateLineTool.md#xfo)

#### Defined in

[src/Tools/CreateTools/CreateLineTool.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateLineTool.ts#L20)

## Methods

### activateTool

▸ **activateTool**(): `void`

The activateTool method.

#### Returns

`void`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[activateTool](CreateLineTool.md#activatetool)

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

[CreateLineTool](CreateLineTool.md).[addIconToVRController](CreateLineTool.md#addicontovrcontroller)

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

[CreateLineTool](CreateLineTool.md).[controllerAddedHandler](CreateLineTool.md#controlleraddedhandler)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:77](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L77)

___

### createMove

▸ **createMove**(`pt`): `void`

Updates the free hand line data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pt` | `Vec3` | The pt param. |

#### Returns

`void`

#### Overrides

[CreateLineTool](CreateLineTool.md).[createMove](CreateLineTool.md#createmove)

#### Defined in

[src/Tools/CreateTools/CreateFreehandLineTool.ts:54](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateFreehandLineTool.ts#L54)

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

[CreateLineTool](CreateLineTool.md).[createPoint](CreateLineTool.md#createpoint)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:162](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L162)

___

### createRelease

▸ **createRelease**(`pt`): `void`

Finishes free hand line creation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pt` | `Vec3` | The pt param. |

#### Returns

`void`

#### Overrides

[CreateLineTool](CreateLineTool.md).[createRelease](CreateLineTool.md#createrelease)

#### Defined in

[src/Tools/CreateTools/CreateFreehandLineTool.ts:70](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateFreehandLineTool.ts#L70)

___

### createStart

▸ **createStart**(`xfo`): `void`

Starts the creation of a free hand line.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xfo` | `Xfo` | The xfo param. |

#### Returns

`void`

#### Overrides

[CreateLineTool](CreateLineTool.md).[createStart](CreateLineTool.md#createstart)

#### Defined in

[src/Tools/CreateTools/CreateFreehandLineTool.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateFreehandLineTool.ts#L35)

___

### deactivateTool

▸ **deactivateTool**(): `void`

The deactivateTool method.

#### Returns

`void`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[deactivateTool](CreateLineTool.md#deactivatetool)

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

[CreateLineTool](CreateLineTool.md).[onKeyDown](CreateLineTool.md#onkeydown)

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

[CreateLineTool](CreateLineTool.md).[onKeyPressed](CreateLineTool.md#onkeypressed)

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

[CreateLineTool](CreateLineTool.md).[onKeyUp](CreateLineTool.md#onkeyup)

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

[CreateLineTool](CreateLineTool.md).[onPointerDown](CreateLineTool.md#onpointerdown)

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

[CreateLineTool](CreateLineTool.md).[onPointerMove](CreateLineTool.md#onpointermove)

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

[CreateLineTool](CreateLineTool.md).[onPointerUp](CreateLineTool.md#onpointerup)

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

[CreateLineTool](CreateLineTool.md).[onTouchCancel](CreateLineTool.md#ontouchcancel)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:300](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L300)

___

### onVRControllerButtonDown

▸ **onVRControllerButtonDown**(`event`): `void`

The onVRControllerButtonDown method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

#### Inherited from

[CreateLineTool](CreateLineTool.md).[onVRControllerButtonDown](CreateLineTool.md#onvrcontrollerbuttondown)

#### Defined in

[src/Tools/CreateTools/CreateLineTool.ts:75](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateLineTool.ts#L75)

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

[CreateLineTool](CreateLineTool.md).[onVRControllerButtonUp](CreateLineTool.md#onvrcontrollerbuttonup)

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

[CreateLineTool](CreateLineTool.md).[onVRPoseChanged](CreateLineTool.md#onvrposechanged)

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

[CreateLineTool](CreateLineTool.md).[onWheel](CreateLineTool.md#onwheel)

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

[CreateLineTool](CreateLineTool.md).[screenPosToXfo](CreateLineTool.md#screenpostoxfo)

#### Defined in

[src/Tools/CreateTools/CreateGeomTool.ts:120](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/CreateTools/CreateGeomTool.ts#L120)
