[@zeainc/zea-ux](../API.md) / HandleMaterial

# Class: HandleMaterial

The Material Class to use for Handle items.
The Handle shader is used to display geometry that must provide a fixed size on
screen and not get smaller or bigger as the user gets closer/farther away.

## Hierarchy

- `Material`

  ↳ **`HandleMaterial`**

## Table of contents

### Constructors

- [constructor](HandleMaterial.md#constructor)

### Properties

- [baseColorParam](HandleMaterial.md#basecolorparam)
- [maintainScreenSizeParam](HandleMaterial.md#maintainscreensizeparam)
- [overlayParam](HandleMaterial.md#overlayparam)

## Constructors

### constructor

• **new HandleMaterial**(`name?`)

Creates an instance of HandleMaterial.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | The name of the material. Note: this value is entirely optional. |

#### Overrides

Material.constructor

#### Defined in

[src/Handles/Shaders/HandleMaterial.ts:19](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Shaders/HandleMaterial.ts#L19)

## Properties

### baseColorParam

• **baseColorParam**: `MaterialColorParam`

#### Defined in

[src/Handles/Shaders/HandleMaterial.ts:11](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Shaders/HandleMaterial.ts#L11)

___

### maintainScreenSizeParam

• **maintainScreenSizeParam**: `NumberParameter`

#### Defined in

[src/Handles/Shaders/HandleMaterial.ts:12](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Shaders/HandleMaterial.ts#L12)

___

### overlayParam

• **overlayParam**: `NumberParameter`

#### Defined in

[src/Handles/Shaders/HandleMaterial.ts:13](https://github.com/ZeaInc/zea-ux/blob/8c31065/src/Handles/Shaders/HandleMaterial.ts#L13)
