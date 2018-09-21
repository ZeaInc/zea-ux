import {
  ParameterContainer,
  SceneTreeView,
  undoRedoManager,
} from '@Visualive/ux';

const rootItem = new Visualive.TreeItem('Root');
const childItem1 = rootItem.addChild(
  new Visualive.TreeItem('Child Tree Item 1')
);
for (let i = 0; ++i <= 1000; ) {
  childItem1.addChild(new Visualive.GeomItem(`Geom Item ${i}`));
}
const childItem2 = rootItem.addChild(
  new Visualive.TreeItem('Child Tree Item 2')
);
for (let i = 0; ++i <= 1000; ) {
  childItem2.addChild(new Visualive.GeomItem(`Geom Item ${i}`));
}

// https://webdesign.tutsplus.com/tutorials/building-responsive-forms-with-flexbox--cms-26767
const sceneTreeView = new SceneTreeView(
  document.getElementById('vlw-tree'),
  rootItem
);
