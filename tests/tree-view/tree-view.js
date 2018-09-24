import {
  ParameterContainer,
  SceneTreeView,
  undoRedoManager,
} from '@Visualive/ux';

const rootItem = new Visualive.TreeItem('Root Tree Item');

const addChildrenToRoot = i => {
  const firstLevelChild = rootItem.addChild(
    new Visualive.TreeItem(`Child Tree Item ${i}`)
  );

  window.setTimeout(() => {
    for (let ii = 0; ++ii <= 5; ) {
      firstLevelChild.addChild(new Visualive.GeomItem(`Geom Item ${ii}`));
    }
  }, i * 1000);
};

for (let i = 0; ++i <= 4; ) {
  addChildrenToRoot(i);
}

// https://webdesign.tutsplus.com/tutorials/building-responsive-forms-with-flexbox--cms-26767
const sceneTreeView = new SceneTreeView(
  document.getElementById('vlw-tree'),
  rootItem
);
