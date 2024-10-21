# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.7.0](https://github.com/ZeaInc/zea-ux/compare/v4.6.0...v4.7.0) (2024-10-21)


### Features

* Provide SmoothFactor setting for motion when holding objects in VR ([9b4a13c](https://github.com/ZeaInc/zea-ux/commit/9b4a13c76da0941ad453b12260b01ce9a61f82aa))
* the tolerance for opening the UI is now customizable ([5eedbf3](https://github.com/ZeaInc/zea-ux/commit/5eedbf3486abf06b83a6c8f7d7fcc34804ab4e5f))


### Bug Fixes

* avoid opening VR UI if pointer controller is not detected. ([25dfdfb](https://github.com/ZeaInc/zea-ux/commit/25dfdfbb2d78db05f31483cd4e89965a15fd635d))
* Fixed regression in SelectionManager caused by [#70](https://github.com/ZeaInc/zea-ux/issues/70)a8e48 ([7d5c9d7](https://github.com/ZeaInc/zea-ux/commit/7d5c9d7d8f25a121fb8d95e093f1988c08e22300)), closes [#70a8e48](https://github.com/ZeaInc/zea-ux/issues/70a8e48)
* Fixed synchronization of node deletion through collab ([fb33c3d](https://github.com/ZeaInc/zea-ux/commit/fb33c3d4e6e44e4b8df7251f6c1ab32672894b10))
* implemented controller smoothing for the VRHoldObjectsTool ([caa887e](https://github.com/ZeaInc/zea-ux/commit/caa887ebb9b680d9ff9113ecec5407509a875dd7))
* upgraded typescript and fixed a bunch of compiler warnings. ([cec6505](https://github.com/ZeaInc/zea-ux/commit/cec650534c2e19d64e33349bcc70055e2797e0b2))
* VRUITool now stops propagation of both pointerDown and pointerClick events ([898d512](https://github.com/ZeaInc/zea-ux/commit/898d512859e2e44e4076e5b3a6a7e63f7e719476))

## [4.5.0](https://github.com/ZeaInc/zea-ux/compare/v4.4.1...v4.5.0) (2023-08-28)


### Features

* Each method on the SelectionManager that causes a selection change now has the option of providing a parent change to allow selection changes to be more easily layered on top of other changes. ([cc5e28f](https://github.com/ZeaInc/zea-ux/commit/cc5e28f35b5c3c03231155b7ed8781cc32c2c575))
* SelectionManager methods toggleItemSelection and clearSelection and selectItems and deselectItems now all take an optional argument to constol if an undo is created. ([b92b84e](https://github.com/ZeaInc/zea-ux/commit/b92b84e55d7e690ec53df3d9edd77f9bc5edbea2))


### Bug Fixes

* A regression caused exceptions to be thrown when the SelectionTool was activated and the pointer moved. ([6018ee4](https://github.com/ZeaInc/zea-ux/commit/6018ee473753bcf182a3ecfb178e16093d42c7ee))
* added support for onPointerClick event propagation in the ToolManager. ([7332f4e](https://github.com/ZeaInc/zea-ux/commit/7332f4e6d71b5846fb5eef48266cf597ca7c05fd))
* Create Sphere and circle tools now draw from one edge of the geometry to the other, instead of from the center of the to the boundary. ([e467abf](https://github.com/ZeaInc/zea-ux/commit/e467abfbb9bd17d73a18c9321c04b01fabc72d51))
* CreateMultiLineTool snapping is now in screen space. ([e7fcaeb](https://github.com/ZeaInc/zea-ux/commit/e7fcaeb11b2d14e27a6807d99bfb868f288aeb09))
* CreateRectTool now works on any construction plane. ([7a138dd](https://github.com/ZeaInc/zea-ux/commit/7a138dd0eaa7b412c791acea938549999216dc4a))
* Handles can no longer be accidentally selected by single clicking on them. ([b942f11](https://github.com/ZeaInc/zea-ux/commit/b942f11f6542a291cab2c5fa6c6304a632146c54))
* HandleShader became incompatible with the non-multidraw pipeline. ([7565f40](https://github.com/ZeaInc/zea-ux/commit/7565f40ab5ac3df1b5054dbd9e8cc09840b42e2f))
* ParameterValueChange read instance supressed value instead of json ([cd3ec02](https://github.com/ZeaInc/zea-ux/commit/cd3ec02606810ba19bbec2eb17938bee642c2eb5))
* The Create tools now work correctly when drawing on top of existing geometries. ([e7df2e9](https://github.com/ZeaInc/zea-ux/commit/e7df2e9e2350ed38028b5c4347014cfab57536fc))
* The UndoRedoManager now correctly handles undo and redo on multiple levels of nesting in the Undo/Redo change object tree. ([64e78cb](https://github.com/ZeaInc/zea-ux/commit/64e78cb3cf36cf1899584750d11b8c253ec3b2b4))
* UndoRedoManager.cancel now only cancels the active change. Previously it would preform an undo on any change in the stack. ([acc8e08](https://github.com/ZeaInc/zea-ux/commit/acc8e08c91294992449b18a13f283fad709b9f9b))
* when ParameterValueChange is suppressed, discard the change during update. ([1f38696](https://github.com/ZeaInc/zea-ux/commit/1f38696be231898de2eec5594c2342c3dc5294cf))

### [4.4.1](https://github.com/ZeaInc/zea-ux/compare/v4.4.0...v4.4.1) (2023-05-06)


### Bug Fixes

* AxialRotationHandle now correctly handles rotating objects ([#187](https://github.com/ZeaInc/zea-ux/issues/187)) ([f4c3b7b](https://github.com/ZeaInc/zea-ux/commit/f4c3b7bc0a210b0864e0834d421b8fe365c9c5f1))
* disable errors caused by TypeScript build. ([f636aef](https://github.com/ZeaInc/zea-ux/commit/f636aef159ac938616ca59d274a47ee472c57b02))
* disable errors caused by TypeScript build. ([bad45c7](https://github.com/ZeaInc/zea-ux/commit/bad45c7ae3e0c2ec184ec7148cfa7415e95365d4))
* Gizmo handles now respond correctly to touch intereactions ([e5a7b70](https://github.com/ZeaInc/zea-ux/commit/e5a7b7066d7caa4d064e8030933e40195465dae5))
* Selection rectangle on high-dpi screens ([#191](https://github.com/ZeaInc/zea-ux/issues/191)) ([962cb87](https://github.com/ZeaInc/zea-ux/commit/962cb871d551dcb7636b8bd541a1fe89c613079f))
* ViewCube is now the same size at all screen resolutions. ([1fdd552](https://github.com/ZeaInc/zea-ux/commit/1fdd5524bbda1b0017bbc8469cc1b5ac9533cc1f))
* ViewCube now scales based on devicePixelRatio ([133803e](https://github.com/ZeaInc/zea-ux/commit/133803ed6efdf2f180837cfb30ccb216c2c98447))

## [4.4.0](https://github.com/ZeaInc/zea-ux/compare/v4.3.0...v4.4.0) (2023-01-25)


### Features

* AxisTripod now supports arguments for each of the axis colors. ([d0b3ecf](https://github.com/ZeaInc/zea-ux/commit/d0b3ecff6ddf48aa596e1cc3edecda9579ea32bd))
* Viewcube has been overhauled for a cleaner design. ([6d486cb](https://github.com/ZeaInc/zea-ux/commit/6d486cbe81c19645ca3628e808ab471ba1e6688e))


### Bug Fixes

* AxialRotationHandle now correctly handles rotating objects ([#187](https://github.com/ZeaInc/zea-ux/issues/187)) ([a16509d](https://github.com/ZeaInc/zea-ux/commit/a16509d46f361e638ee3e26912716b1140c0fe9a))
* AxisTripod now maintains a fixed size in Orthographic viewports. ([24589b6](https://github.com/ZeaInc/zea-ux/commit/24589b6d6b1e967cb62ef6406a1df2c873a3caee))
* disable errors caused by TypeScript build. ([d099341](https://github.com/ZeaInc/zea-ux/commit/d0993413afe971c784a5130a52220a631bbe8371))
* Gizmo handles now respond correctly to touch intereactions ([aa1f08a](https://github.com/ZeaInc/zea-ux/commit/aa1f08a9565ba0c3d3ac68c031332c986b7c60ad))
* The ViewCube size would change based on the distance to the border. The labels on the cube were distorted. ([c28672e](https://github.com/ZeaInc/zea-ux/commit/c28672eaabd2f09714c9ffd1db0eb956e25ad566))

## [4.3.0](https://github.com/ZeaInc/zea-ux/compare/v4.2.1...v4.3.0) (2022-12-06)


### Features

* Updated AxisTripod ([1584daa](https://github.com/ZeaInc/zea-ux/commit/1584daa3faa86e11684130c0f1f336be16363f9f))
* Updated ViewCube ([15692bc](https://github.com/ZeaInc/zea-ux/commit/15692bca19368b4336b71b14a53c6c3361dc572f))

### [4.2.1](https://github.com/ZeaInc/zea-ux/compare/v4.2.0...v4.2.1) (2022-11-25)


### Bug Fixes

* Handles now maintain screen size in orthographic viewports. ([4e44551](https://github.com/ZeaInc/zea-ux/commit/4e44551a643e9d49dc7f1873c84f0dba8c575230))

## [4.2.0](https://github.com/ZeaInc/zea-ux/compare/v4.1.0...v4.2.0) (2022-06-11)


### Features

* fine tuned the XFoHandle to make it appear cleaner. ([0092cb0](https://github.com/ZeaInc/zea-ux/commit/0092cb02b0c247ab7461aab95f331118614f906e))
* implemented ViewCube and AxisTripod using 3d Geometry. ([580fe0f](https://github.com/ZeaInc/zea-ux/commit/580fe0f5dcb2ee911b83da4f7566e962a111bd9e))

## [4.1.0](https://github.com/ZeaInc/zea-ux/compare/v4.0.5...v4.1.0) (2022-04-26)


### Features

* Implemented a new 'view-cube' custom element to add to editors for easier camera configuration. ([b7a3a4a](https://github.com/ZeaInc/zea-ux/commit/b7a3a4a6b1c50940760f55c15ed4e55bb2846a24))


### Bug Fixes

* Axial rotation gizmo did not rotate correctly on its axis, when it was rotated on a different axis to the target parameter. ([10e24f3](https://github.com/ZeaInc/zea-ux/commit/10e24f3b31eedc9b0b01d0010e4f1bc3ce65b0bf))
* SelectionTool no longer filters its self based on the 'Alt' key. ([c6707b6](https://github.com/ZeaInc/zea-ux/commit/c6707b6b42a9bc96698dc4c575b083213ab0736f))
* The 'SubtreeHighlightColor' parameter was removed from the SelectionGroup so that TreeItems could control highlight propagation locally. ([f72957d](https://github.com/ZeaInc/zea-ux/commit/f72957dcd03f7db45f9582c9cd0059727de40d41))

### [4.0.5](https://github.com/ZeaInc/zea-ux/compare/v4.0.4...v4.0.5) (2022-02-18)


### Bug Fixes

* The XfoHandle now generates a SelectionXfoChange object that manages the xfo values for all selected items during manipulation ([c08ea5f](https://github.com/ZeaInc/zea-ux/commit/c08ea5f14f2087a87959db9ad9ce38a209e273eb))

### [4.0.4](https://github.com/ZeaInc/zea-ux/compare/v4.0.3...v4.0.4) (2022-02-07)


### Bug Fixes

* Moved engine to dev dependencies. This allows the ux library to be used with any version of the engine, including prereleases. ([9b669fe](https://github.com/ZeaInc/zea-ux/commit/9b669fe5b11f0d9a6df336fd5fef8db9394dec66))

## [4.0.3](https://github.com/ZeaInc/zea-ux/compare/v4.0.2...v4.0.3) (2022-01-21)


### Bug Fixes

* Clearing the selection should emit a `leadSelectionChanged` event. ([#154](https://github.com/ZeaInc/zea-ux/issues/154)) ([5da8edd](https://github.com/ZeaInc/zea-ux/commit/5da8edd0affe6a606a8ad42c472b6dedfb0c2002))
* TypeScript type definitions ([#148](https://github.com/ZeaInc/zea-ux/issues/148)) ([7253ad1](https://github.com/ZeaInc/zea-ux/commit/7253ad1dd4e296dc4579c5a247229632f17ea5bc)), closes [#147](https://github.com/ZeaInc/zea-ux/issues/147)

## [4.0.2](https://github.com/ZeaInc/zea-ux/compare/v4.0.0...v4.0.2) (2021-12-03)


### Bug Fixes

* TypeScript support.
* Cleaned up regression in the UndoRedoManager. An exception was thrown when a new Undo/Redo object was added to the stack. ([b320260](https://github.com/ZeaInc/zea-ux/commit/b320260528f93c2fa06534a9dcdb395e9af788da))
* Cleaned up regressions due to migration to engine 4.0.0 ([ad9fac8](https://github.com/ZeaInc/zea-ux/commit/ad9fac8a5722996fc64a56277496f95231feea03))
* HandleShader 'MaintainScreenSize' now eliminates scale from the modelMatrix in the shader. ([1084191](https://github.com/ZeaInc/zea-ux/commit/1084191a01587ef857854ccd8c63b04027735904))

## [4.0.0](https://github.com/ZeaInc/zea-ux/compare/v3.2.1...v4.0.0) (2021-11-12)


### ⚠ BREAKING CHANGES

* this version of UX requires

### Features

* Implemented a new HandleMaterial that has statically defined parameters. ([f991269](https://github.com/ZeaInc/zea-ux/commit/f991269f82f1f4dc89e94a326c42a42fe04ca8df))
* zea-ux is now upgraded to version 4.0.0 of the engine. ([f10126c](https://github.com/ZeaInc/zea-ux/commit/f10126c6bbbd16be28561b2ab2e44c655b228b7e))


### Bug Fixes

* Cleaned up regressions due to migration to engine 4.0.0 ([ad9fac8](https://github.com/ZeaInc/zea-ux/commit/ad9fac8a5722996fc64a56277496f95231feea03))
* HandleShader 'MaintainScreenSize' now eliminates scale from the modelMatrix in the shader. ([1084191](https://github.com/ZeaInc/zea-ux/commit/1084191a01587ef857854ccd8c63b04027735904))

## [3.2.0](https://github.com/ZeaInc/zea-ux/compare/v3.1.3-vr-tools.0...v3.2.0) (2021-10-10)


### Features

* added reset to 1:1 scale feat to the vr-ui ([8b634dd](https://github.com/ZeaInc/zea-ux/commit/8b634dd228d2dfeabfd1bd42028f8a2eb2f01c09))
* create geom tools all take colors now. ([0c82f1e](https://github.com/ZeaInc/zea-ux/commit/0c82f1e0c4bb0b219229228e472c71fcc9c32d83))
* In VR, the CreateLineTool line thickness is now adapted to the stage scale. ([bab217b](https://github.com/ZeaInc/zea-ux/commit/bab217ba87a0e63e7cd90d0caf8e1518b9284e53))
* VRHoldObjectsTool now highlights items we are about to pick up. ([ee4414c](https://github.com/ZeaInc/zea-ux/commit/ee4414cb21af24b7577903fd1b8a67d3e5f040c3))


### Bug Fixes

* CreateGeomTools now call 'preventDefault' to prevent actions like drag and drop from being triggered during creation interactions. ([f587034](https://github.com/ZeaInc/zea-ux/commit/f587034f67ce5958f330d018cbc49dbb7128c1ba))
* MeasureAngleTool correctly handles planar surfaces. ([f159440](https://github.com/ZeaInc/zea-ux/commit/f1594407c73a3973c4e710817bcb6f2ffb08ba59))
* MeasureCenterDistancesTool correctly handles Cones and Circles ([c3ca45c](https://github.com/ZeaInc/zea-ux/commit/c3ca45ceb7fa11f34c58f97bb470cb7f6c832507))
* Measurements now assume user units are in mm and scene units are in meters. ([244368c](https://github.com/ZeaInc/zea-ux/commit/244368cf6dd08142eebf87dc0c72caa194010491))
* on Safari without rendering to float textures, we now support up to 7 registered passes. ([1348fa4](https://github.com/ZeaInc/zea-ux/commit/1348fa4cc638c6e1a35394df82da8c1aa2ec6250))
* selection manager now correctly handles unhighlighting items on deselection ([#131](https://github.com/ZeaInc/zea-ux/issues/131)) ([40a2ef0](https://github.com/ZeaInc/zea-ux/commit/40a2ef0da83bd89244fdc92f4089f8cc2b17869d))
* When collaborating on line drawing, line thickness is now correctly synchronized. ([2f8ec8b](https://github.com/ZeaInc/zea-ux/commit/2f8ec8b2a8be5dd304449d8e2b4b4cb144d44fbf))

## [3.1.3](https://github.com/ZeaInc/zea-ux/compare/v3.1.2...v3.1.3) (2021-06-29)


### Bug Fixes

* Cleaned up incompatibility with zea-engine 3.10.3 ([ee011a3](https://github.com/ZeaInc/zea-ux/commit/ee011a3f77010e1d2195e7d89dfaf719285ce00a))

## [3.1.3](https://github.com/ZeaInc/zea-ux/compare/v3.1.2...v3.1.3) (2021-06-29)


### Bug Fixes

* Cleaned up incompatibility with zea-engine 3.10.3 ([ee011a3](https://github.com/ZeaInc/zea-ux/commit/ee011a3f77010e1d2195e7d89dfaf719285ce00a))

## [3.1.2](https://github.com/ZeaInc/zea-ux/compare/v3.1.1...v3.1.2) (2021-05-14)


### Bug Fixes

* SelectionManager now correctly sets the Selection state of its members. ([5e5bf9c](https://github.com/ZeaInc/zea-ux/commit/5e5bf9c202a403c4a979def18f8e388d98dde9fd))

## [3.1.1](https://github.com/ZeaInc/zea-ux/compare/v3.1.0...v3.1.1) (2021-05-10)


### Bug Fixes

* Handle picking became broken after the 3.7.0 engine release. Now the HandleShader is an ubershader that is also used in Picking. ([f2eae31](https://github.com/ZeaInc/zea-ux/commit/f2eae315ac3fed1c7c1125284fd6283c58549232))

## [3.1.0](https://github.com/ZeaInc/zea-ux/compare/v3.0.1...v3.1.0) (2021-02-10)


### Features

* Handles now emit 'highlight' and 'unhighlight' events so consumers can manage custom highlighting. ([17fd983](https://github.com/ZeaInc/zea-ux/commit/17fd9835c3ffee415a88022a241ddde86d342e81))
* SelectionGroup Xfo mode now defaults to 'average' but we no longer average the rotations as this was confusing. ([1ea7484](https://github.com/ZeaInc/zea-ux/commit/1ea748456aac5ddb2dfe86d32eb1bbd25fe40b69))


### Bug Fixes

* Interactions on the ScreenSpaceMovementHandle became inaccurate as it moved away from the origin. ([3d81a99](https://github.com/ZeaInc/zea-ux/commit/3d81a99138513641c2d022163b102e4211a6ba6a))
* SelectionManager now has a simpler method of showing the XfoHandles, now that the handles combine TR and ORI manipulation ([af7a52e](https://github.com/ZeaInc/zea-ux/commit/af7a52eb9c3c4731a0da9ad11b132627b9963bd3))
* The MeasurementTool was throwing an exception of the appData object did not contain the renderer. ([0398f64](https://github.com/ZeaInc/zea-ux/commit/0398f6492fde3bb606d1b1425d9e652513a5dbd7))

### [3.0.1](https://github.com/ZeaInc/zea-ux/compare/v3.0.0...v3.0.1) (2020-12-03)

## [3.0.0](https://github.com/ZeaInc/zea-ux/compare/v2.1.0...v3.0.0) (2020-12-03)


### ⚠ BREAKING CHANGES

* renamed 'changeFromJSON' to 'updateFromJSON' to be more consistent.

* refactor: no need to register tools with the UndoRedoManager.

* Rename change from json to update from json (#112) ([68fd934](https://github.com/ZeaInc/zea-ux/commit/68fd9349149b38a255af372f7e926b4655130c5d)), closes [#112](https://github.com/ZeaInc/zea-ux/issues/112)

### [3.0.1] (2020-12-04)

## [3.0.0] (2020-12-03)


### ⚠ BREAKING CHANGES

* renamed 'changeFromJSON' to 'updateFromJSON' to be more consistent.

* refactor: no need to register tools with the UndoRedoManager.

### Features

* Added Measurement tool to the library, it includes a measurement item, and operator and a handler ([a6ac0cd](https://github.com/ZeaInc/zea-ux/commit/a6ac0cd194a33f828456c3365ecb5d06f826feff))
* Added Measurement tool to the library, it includes a measurement item, and operator and a handler ([d910597](https://github.com/ZeaInc/zea-ux/commit/d910597957b43f7b1efb52f7833baa8e53df1596))
* Added ToolManager with e2e tests ([#110](https://github.com/ZeaInc/zea-ux/issues/110)) ([04b0b3d](https://github.com/ZeaInc/zea-ux/commit/04b0b3d622789db5f4216fc31c11570385385ec1))
* Added UndoRedo System to the Measurement tool ([3a1c045](https://github.com/ZeaInc/zea-ux/commit/3a1c04527834cb42d8e722fbce9af4b4f60d8f98))
* MeasurementTool can now generate measurements with a custom color. ([#102](https://github.com/ZeaInc/zea-ux/issues/102)) ([e7fc34c](https://github.com/ZeaInc/zea-ux/commit/e7fc34c06ad1fd0e1ed9cccfafaf9c8fa74da985))


### Bug Fixes

* Fixed overlay depth manipulation in the HandleShader. Resolves issues with excessive clipping on overlay geoms. ([#99](https://github.com/ZeaInc/zea-ux/issues/99)) ([29c36a1](https://github.com/ZeaInc/zea-ux/commit/29c36a14a403d545534ac6b2948c80072a6c616f))
* rotation handel now has a more intuitive rotation behavior. ([#103](https://github.com/ZeaInc/zea-ux/issues/103)) ([642eb1b](https://github.com/ZeaInc/zea-ux/commit/642eb1be9128d44a0adac68c275b73a284890dca))
* when drawing lines, the 'geomDataChanged event needed to be emitted with the correct json. ([#104](https://github.com/ZeaInc/zea-ux/issues/104)) ([1fb2f4b](https://github.com/ZeaInc/zea-ux/commit/1fb2f4b64feaa20f4e67d896a96b8ce6f6404184))


* Rename change from json to update from json (#112) ([68fd934](https://github.com/ZeaInc/zea-ux/commit/68fd9349149b38a255af372f7e926b4655130c5d)), closes [#112](https://github.com/ZeaInc/zea-ux/issues/112)

## [2.1.0](https://github.com/ZeaInc/zea-ux/compare/v2.0.1...v2.1.0) (2020-10-26)


### Features

* Added color and highlight color parameters to handles ([fd27b29](https://github.com/ZeaInc/zea-ux/commit/fd27b296907547aa32ace84f9aac41b1a41c26c3))
* Added highlight color and color parameters to handles ([98b3f19](https://github.com/ZeaInc/zea-ux/commit/98b3f19fa4f20a7c40eef5fa5e4beee0e65be952))
* Implemented Handle highlighting for Touch events. ([0312e70](https://github.com/ZeaInc/zea-ux/commit/0312e7079db7479216dd8b30a486267d9238a0bb))


### Bug Fixes

* Added checks for ray on mouse events ([af0e33e](https://github.com/ZeaInc/zea-ux/commit/af0e33e44b923200f5cd41dc71035cbe827936d3))
* cleaned up regression in Materials configuration. All handles are now rendered as overlay. ([144f4ae](https://github.com/ZeaInc/zea-ux/commit/144f4ae93f12283bdb6b6a840282205483645af3))
* Fixed issue with screen space movement handle, now it correctly moves in parallel to the camera ([1a95c8f](https://github.com/ZeaInc/zea-ux/commit/1a95c8f94a9d2e44b7133d95775b12057cf198a2))
* Fixed issue with version in the package.json ([bd67c37](https://github.com/ZeaInc/zea-ux/commit/bd67c376c94864d4c23fd913cd796992317ab4f0))
* Fixed SelectionTool events ([0c85050](https://github.com/ZeaInc/zea-ux/commit/0c85050624ebf9d9445c96eae90af46b06bd97a0))
* Fixed touch events for handle base classes ([debe73f](https://github.com/ZeaInc/zea-ux/commit/debe73f7374e83729d2513da42c9efc43edca396))
* Fixed touch events for Handles ([ab94aac](https://github.com/ZeaInc/zea-ux/commit/ab94aac32bac14f32cb642635091c0f48464a618))
* Fixed transformation of vertices to use lazy update of geometries ([efb7b97](https://github.com/ZeaInc/zea-ux/commit/efb7b9723720c38d15a8479d48c0c2d2e229237f))
* Xfo handles were displayed very big, so I reduced the size. I am not sure what caused the change in size. ([aafeddc](https://github.com/ZeaInc/zea-ux/commit/aafeddc6912589860dc209ac00837644f22df171))

## 2.0.0 (2020-09-14)


### ⚠ BREAKING CHANGES

* **npm:** Raw imports are no longer supported.


### Features

* ParameterValueChange now support nested changes. This makes it possible to append more changes to a simple value change command.


### Bug Fixes

* HandleShader


### build

* **npm:** Add UMD support


## 1.5.0 (2020-08-27)


### Features

* ParameterValueChange now supports nested changes.


### Bug Fixes

* Docs search now have their own namespace.
* Generated docs for tools.
* Generated docs, they were removed in a previous commit.


## 1.4.0 (2020-08-20)


### Features

* ArcSlider can now be connected to a NumberParameter.
* Formalized documentation for UX lib.


### Bug Fixes

* Addressed compatibility issue with zea-web-components that it is not constructing Change objects.
* ArcSlider's Radius param name.
* Docs for classes under UndoRedo module.
* Bug causing Handle geoms to be flipped in the view.
* Coverage file.
* Regression caused by clamp now is MathFunctions.
* Regression in display of arc geometry in the ArcSlider.
* Regressions due to new capitalization of parameter names.
* Tools dir name.
* UndoRedo dir name.
* UndoRedo import.
