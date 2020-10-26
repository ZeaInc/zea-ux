# Changelog

## [2.1.0](https://github.com/ZeaInc/zea-ux/compare/v2.0.1...v2.1.0) (2020-10-26)


### Features

* Added color and highlight color parameters to handles ([fd27b29](https://github.com/ZeaInc/zea-ux/commit/fd27b296907547aa32ace84f9aac41b1a41c26c3))
* Added highlight color and color parameters to handles ([98b3f19](https://github.com/ZeaInc/zea-ux/commit/98b3f19fa4f20a7c40eef5fa5e4beee0e65be952))
* Implemented Handle highlighting for Touch events. ([0312e70](https://github.com/ZeaInc/zea-ux/commit/0312e7079db7479216dd8b30a486267d9238a0bb))


### Bug Fixes

* Added checks for ray on mouse events ([af0e33e](https://github.com/ZeaInc/zea-ux/commit/af0e33e44b923200f5cd41dc71035cbe827936d3))
* cleaned up regression in Materials configutation. All handles are now rendered as overlay. ([144f4ae](https://github.com/ZeaInc/zea-ux/commit/144f4ae93f12283bdb6b6a840282205483645af3))
* Fixed issue with screen space movement handle, now it correctly moves in pararell to the camera ([1a95c8f](https://github.com/ZeaInc/zea-ux/commit/1a95c8f94a9d2e44b7133d95775b12057cf198a2))
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
* Regressions due to new captialization of parameter names.
* Tools dir name.
* UndoRedo dir name.
* UndoRedo import.
