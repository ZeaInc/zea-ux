# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
