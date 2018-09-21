import {
  ParameterContainer,
  SceneTreeView,
  undoRedoManager,
} from '@Visualive/ux';

const rootItem = new Visualive.TreeItem('Root');

const addRootToChild = i => {
  console.log(i);
  const childItem1 = rootItem.addChild(
    new Visualive.TreeItem(`Child Tree Item ${i}`)
  );

  window.setTimeout(() => {
    for (let ii = 0; ++ii <= 100; ) {
      childItem1.addChild(new Visualive.GeomItem(`Geom Item ${ii}`));
    }
  }, i * 1000);
};

for (let i = 0; ++i <= 4; ) {
  addRootToChild(i);
}

// https://webdesign.tutsplus.com/tutorials/building-responsive-forms-with-flexbox--cms-26767
const sceneTreeView = new SceneTreeView(
  document.getElementById('vlw-tree'),
  rootItem
);
