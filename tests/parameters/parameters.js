import { ParameterContainer, undoRedoManager } from '@Visualive/ux';

const parameterOwner = new Visualive.ParameterOwner();

parameterOwner.addParameter(new Visualive.StringParameter('Name', 'Foo'));
parameterOwner.addParameter(new Visualive.NumberParameter('Number', 5));
parameterOwner.addParameter(
  new Visualive.NumberParameter('Smooth', 10).setRange([0, 30])
);
parameterOwner.addParameter(
  new Visualive.NumberParameter('Stepped', 6).setRange([0, 30]).setStep(5)
);
parameterOwner.addParameter(
  new Visualive.Vec2Parameter('Vec2 Parameter', new Visualive.Vec2(1, 2))
);
parameterOwner.addParameter(
  new Visualive.Vec3Parameter('Vec3 Parameter', new Visualive.Vec3(3, 4, 5))
);
parameterOwner.addParameter(
  new Visualive.Vec4Parameter('Vec4 Parameter', new Visualive.Vec4(6, 7, 8, 9))
);
parameterOwner.addParameter(
  new Visualive.ColorParameter('Color', new Visualive.Color(1, 1, 0, 1))
);

// https://webdesign.tutsplus.com/tutorials/building-responsive-forms-with-flexbox--cms-26767
const parameterContainer = new ParameterContainer(
  document.getElementById('parameters'),
  parameterOwner
);

const geomItem = new Visualive.GeomItem();
const parameterContainer2 = new ParameterContainer(
  document.getElementById('geomitem-parameters'),
  geomItem
);

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
    undoRedoManager.undo();
  }
});
