import {
  getRequest,
  getCurrentUser,
  getProjectData,
  getProjectResourcesRecursive,
  getParameterFromUrl
} from './src/PlatformAPI.js';

import UndoRedoManager from './src/undoredo/UndoRedoManager.js';
import ActionRegistry from './src/ActionRegistry.js';
import SelectionManager from './src/SelectionManager.js';
import LoaderRegistry from './src/LoaderRegistry.js';


import TopMenuBar from './src/ui/TopMenuBar.js';
import setupPanels from './src/ui/side-panels.js'
import SceneTreeView from './src/ui/scene-tree-view.js';
import TreeItemInspector from './src/ui/TreeItemInspector.js';
import ParameterContainer from './src/ui/ParameterContainer.js';
import InspectorContainer from './src/ui/InspectorContainer.js';

import {
  UserChip,
  CurrentUserChip
} from './src/ui/UserChip.js';


import BooleanWidget from './src/ui/parameter-widgets/BooleanWidget.js';
import ColorWidget from './src/ui/parameter-widgets/ColorWidget.js';
import NumberWidget from './src/ui/parameter-widgets/NumberWidget.js';
import StringWidget from './src/ui/parameter-widgets/StringWidget.js';
import Vec2Widget from './src/ui/parameter-widgets/Vec2Widget.js';
import Vec3Widget from './src/ui/parameter-widgets/Vec3Widget.js';
import Vec4Widget from './src/ui/parameter-widgets/Vec4Widget.js';

export {
  getRequest,
  getCurrentUser,
  getProjectData,
  getProjectResourcesRecursive,
  getParameterFromUrl,

  UndoRedoManager,
  ActionRegistry,
  SelectionManager,
  LoaderRegistry,

  TopMenuBar,
  setupPanels,
  SceneTreeView,
  TreeItemInspector,
  ParameterContainer,
  InspectorContainer,

  UserChip,
  CurrentUserChip,

  BooleanWidget,
  ColorWidget,
  NumberWidget,
  StringWidget,
  Vec2Widget,
  Vec3Widget,
  Vec4Widget
};