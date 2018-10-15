import { setupCollab } from '@visualive/ux';


import { UndoRedoManager, ParameterContainer, SessionSync } from '../index.js';

const undoRedoManager = new UndoRedoManager();

const appData = {
  undoRedoManager
}

const baseItem = new Visualive.BaseItem();

baseItem.addParameter(new Visualive.StringParameter('Name', 'Foo'));
baseItem.addParameter(new Visualive.NumberParameter('Number', 5));
baseItem.addParameter(
  new Visualive.NumberParameter('Smooth', 10).setRange([0, 30])
);
baseItem.addParameter(
  new Visualive.NumberParameter('Stepped', 6).setRange([0, 30]).setStep(5)
);
baseItem.addParameter(
  new Visualive.Vec2Parameter('Vec2 Parameter', new Visualive.Vec2(1, 2))
);
baseItem.addParameter(
  new Visualive.Vec3Parameter('Vec3 Parameter', new Visualive.Vec3(3, 4, 5))
);
baseItem.addParameter(
  new Visualive.Vec4Parameter('Vec4 Parameter', new Visualive.Vec4(6, 7, 8, 9))
);
baseItem.addParameter(
  new Visualive.ColorParameter('Color', new Visualive.Color(1, 1, 0, 1))
);

const parameterContainer = new ParameterContainer(
  baseItem,
  document.getElementById('parameters'),
  undoRedoManager
);

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
    undoRedoManager.undo();
  }
});


const $collabWrapper = document.getElementById('collabWrapper');
setupCollab($collabWrapper);
