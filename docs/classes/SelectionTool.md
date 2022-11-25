[@zeainc/zea-ux](../API.md) / SelectionTool

# Class: SelectionTool

Class representing a selection tool.

## Hierarchy

- `BaseTool`

  ↳ **`SelectionTool`**

## Table of contents

### Constructors

- [constructor](SelectionTool.md#constructor)

### Properties

- [\_\_selectionFilterFn](SelectionTool.md#__selectionfilterfn)
- [appData](SelectionTool.md#appdata)
- [dragging](SelectionTool.md#dragging)
- [pointerDownPos](SelectionTool.md#pointerdownpos)
- [rectItem](SelectionTool.md#rectitem)
- [selectionManager](SelectionTool.md#selectionmanager)
- [selectionRect](SelectionTool.md#selectionrect)
- [selectionRectMat](SelectionTool.md#selectionrectmat)
- [selectionRectXfo](SelectionTool.md#selectionrectxfo)

### Methods

- [\_\_resizeRect](SelectionTool.md#__resizerect)
- [activateTool](SelectionTool.md#activatetool)
- [deactivateTool](SelectionTool.md#deactivatetool)
- [onPointerDoublePress](SelectionTool.md#onpointerdoublepress)
- [onPointerDown](SelectionTool.md#onpointerdown)
- [onPointerMove](SelectionTool.md#onpointermove)
- [onPointerUp](SelectionTool.md#onpointerup)
- [onVRControllerButtonDown](SelectionTool.md#onvrcontrollerbuttondown)
- [setSelectionFilter](SelectionTool.md#setselectionfilter)
- [setSelectionManager](SelectionTool.md#setselectionmanager)

## Constructors

### constructor

• **new SelectionTool**(`appData`)

Creates an instance of SelectionTool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appData` | [`AppData`](../interfaces/AppData.md) | The appData value |

#### Overrides

BaseTool.constructor

#### Defined in

[src/Tools/SelectionTool.ts:43](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L43)

## Properties

### \_\_selectionFilterFn

• **\_\_selectionFilterFn**: `any`

#### Defined in

[src/Tools/SelectionTool.ts:36](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L36)

___

### appData

• **appData**: [`AppData`](../interfaces/AppData.md)

#### Defined in

[src/Tools/SelectionTool.ts:29](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L29)

___

### dragging

• **dragging**: `boolean`

#### Defined in

[src/Tools/SelectionTool.ts:30](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L30)

___

### pointerDownPos

• **pointerDownPos**: `Vec2`

#### Defined in

[src/Tools/SelectionTool.ts:37](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L37)

___

### rectItem

• **rectItem**: `GeomItem`

#### Defined in

[src/Tools/SelectionTool.ts:35](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L35)

___

### selectionManager

• **selectionManager**: [`SelectionManager`](SelectionManager.md)

#### Defined in

[src/Tools/SelectionTool.ts:32](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L32)

___

### selectionRect

• **selectionRect**: `Rect`

#### Defined in

[src/Tools/SelectionTool.ts:31](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L31)

___

### selectionRectMat

• **selectionRectMat**: `Material`

#### Defined in

[src/Tools/SelectionTool.ts:33](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L33)

___

### selectionRectXfo

• **selectionRectXfo**: `Xfo`

#### Defined in

[src/Tools/SelectionTool.ts:34](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L34)

## Methods

### \_\_resizeRect

▸ `Private` **__resizeRect**(`viewport`, `delta`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `viewport` | `GLBaseViewport` | The viewport value |
| `delta` | `any` | The delta value |

#### Returns

`void`

#### Defined in

[src/Tools/SelectionTool.ts:115](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L115)

___

### activateTool

▸ **activateTool**(): `void`

Activates selection tool.

#### Returns

`void`

#### Overrides

BaseTool.activateTool

#### Defined in

[src/Tools/SelectionTool.ts:84](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L84)

___

### deactivateTool

▸ **deactivateTool**(): `void`

Deactivates the selection tool.

#### Returns

`void`

#### Overrides

BaseTool.deactivateTool

#### Defined in

[src/Tools/SelectionTool.ts:91](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L91)

___

### onPointerDoublePress

▸ `Private` **onPointerDoublePress**(`event`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerDoublePress

#### Defined in

[src/Tools/SelectionTool.ts:134](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L134)

___

### onPointerDown

▸ **onPointerDown**(`event`): `void`

Event fired when a pointing device button is pressed while the pointer is over the tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

The return value.

#### Overrides

BaseTool.onPointerDown

#### Defined in

[src/Tools/SelectionTool.ts:142](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L142)

___

### onPointerMove

▸ **onPointerMove**(`event`): `void`

Event fired when a pointing device is moved while the cursor's hotspot is inside it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

The return value.

#### Overrides

BaseTool.onPointerMove

#### Defined in

[src/Tools/SelectionTool.ts:157](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L157)

___

### onPointerUp

▸ **onPointerUp**(`event`): `void`

Event fired when a pointing device button is released while the pointer is over the tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaPointerEvent` | The event param. |

#### Returns

`void`

The return value.

#### Overrides

BaseTool.onPointerUp

#### Defined in

[src/Tools/SelectionTool.ts:183](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L183)

___

### onVRControllerButtonDown

▸ **onVRControllerButtonDown**(`event`): `void`

Event fired when a VR controller button is pressed over a tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `XRControllerEvent` | The event param. |

#### Returns

`void`

The return value.

#### Defined in

[src/Tools/SelectionTool.ts:266](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L266)

___

### setSelectionFilter

▸ **setSelectionFilter**(`fn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `any` |

#### Returns

`void`

#### Defined in

[src/Tools/SelectionTool.ts:104](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L104)

___

### setSelectionManager

▸ **setSelectionManager**(`selectionManager`): `void`

Activates selection tool.

#### Parameters

| Name | Type |
| :------ | :------ |
| `selectionManager` | [`SelectionManager`](SelectionManager.md) |

#### Returns

`void`

#### Defined in

[src/Tools/SelectionTool.ts:100](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/SelectionTool.ts#L100)
