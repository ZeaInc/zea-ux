[@zeainc/zea-ux](../API.md) / ToolManager

# Class: ToolManager

## Hierarchy

- `BaseTool`

  ↳ **`ToolManager`**

## Table of contents

### Constructors

- [constructor](ToolManager.md#constructor)

### Properties

- [toolStack](ToolManager.md#toolstack)
- [tools](ToolManager.md#tools)

### Methods

- [activeTool](ToolManager.md#activetool)
- [activeToolName](ToolManager.md#activetoolname)
- [onKeyDown](ToolManager.md#onkeydown)
- [onKeyPressed](ToolManager.md#onkeypressed)
- [onKeyUp](ToolManager.md#onkeyup)
- [onPointerDoublePress](ToolManager.md#onpointerdoublepress)
- [onPointerDown](ToolManager.md#onpointerdown)
- [onPointerMove](ToolManager.md#onpointermove)
- [onPointerUp](ToolManager.md#onpointerup)
- [onWheel](ToolManager.md#onwheel)
- [popTool](ToolManager.md#poptool)
- [pushTool](ToolManager.md#pushtool)
- [registerTool](ToolManager.md#registertool)

## Constructors

### constructor

• **new ToolManager**()

#### Overrides

BaseTool.constructor

#### Defined in

[src/Tools/ToolManager.ts:10](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L10)

## Properties

### toolStack

• **toolStack**: `any`[]

#### Defined in

[src/Tools/ToolManager.ts:8](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L8)

___

### tools

• **tools**: `Record`<`string`, `BaseTool`\>

#### Defined in

[src/Tools/ToolManager.ts:9](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L9)

## Methods

### activeTool

▸ **activeTool**(): `BaseTool`

Returns the tool currently at the top of the stack.

#### Returns

`BaseTool`

- the currently active tool.

#### Defined in

[src/Tools/ToolManager.ts:40](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L40)

___

### activeToolName

▸ **activeToolName**(): `string`

Returns the name of the tool currently at the top of the stack.

#### Returns

`string`

- the name of the tool.

#### Defined in

[src/Tools/ToolManager.ts:50](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L50)

___

### onKeyDown

▸ **onKeyDown**(`event`): `void`

Event fired when the user presses down a key on the keyboard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `KeyboardEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onKeyDown

#### Defined in

[src/Tools/ToolManager.ts:161](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L161)

___

### onKeyPressed

▸ **onKeyPressed**(`event`): `void`

Event fired when the user presses a key on the keyboard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `KeyboardEvent` | The event param. |

#### Returns

`void`

#### Defined in

[src/Tools/ToolManager.ts:146](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L146)

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

#### Overrides

BaseTool.onKeyUp

#### Defined in

[src/Tools/ToolManager.ts:176](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L176)

___

### onPointerDoublePress

▸ **onPointerDoublePress**(`event`): `void`

Event fired when a pointing device button is double clicked on the tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaMouseEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerDoublePress

#### Defined in

[src/Tools/ToolManager.ts:113](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L113)

___

### onPointerDown

▸ **onPointerDown**(`event`): `void`

Event fired when a pointing device button is pressed while the pointer is over the tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaMouseEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerDown

#### Defined in

[src/Tools/ToolManager.ts:68](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L68)

___

### onPointerMove

▸ **onPointerMove**(`event`): `void`

Event fired when a pointing device is moved while the cursor's hotspot is inside it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaMouseEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerMove

#### Defined in

[src/Tools/ToolManager.ts:83](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L83)

___

### onPointerUp

▸ **onPointerUp**(`event`): `void`

Event fired when a pointing device button is released while the pointer is over the tool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaMouseEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onPointerUp

#### Defined in

[src/Tools/ToolManager.ts:98](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L98)

___

### onWheel

▸ **onWheel**(`event`): `void`

Event fired when the user rotates the pointing device wheel.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `ZeaMouseEvent` | The event param. |

#### Returns

`void`

#### Overrides

BaseTool.onWheel

#### Defined in

[src/Tools/ToolManager.ts:128](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L128)

___

### popTool

▸ **popTool**(): `void`

#### Returns

`void`

#### Defined in

[src/Tools/ToolManager.ts:27](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L27)

___

### pushTool

▸ **pushTool**(`toolName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `toolName` | `string` |

#### Returns

`void`

#### Defined in

[src/Tools/ToolManager.ts:20](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L20)

___

### registerTool

▸ **registerTool**(`toolName`, `tool`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `toolName` | `string` |
| `tool` | `BaseTool` |

#### Returns

`void`

#### Defined in

[src/Tools/ToolManager.ts:16](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Tools/ToolManager.ts#L16)
