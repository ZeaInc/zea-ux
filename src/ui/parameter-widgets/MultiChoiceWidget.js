import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class MultiChoiceWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    super(parameter);

    const range = parameter.getRange();
    const choices = parameter.getChoices();
    const select = document.createElement('select');
    for (let i=0; i < choices.length; i++) {
      const choice = choices[i];
      const option = document.createElement('option');
      option.appendChild(document.createTextNode(choice));
      select.appendChild(option);
    }
    select.selectedIndex = parameter.getValue();

    parentDomElem.appendChild(select);

    /////////////////////////////
    // SceneWidget Changes.

    let changing = false;

    parameter.valueChanged.connect(() => {
      if (!changing){
        select.selectedIndex = parameter.getValue()
      } 
    });

    const valueChange = (event) => {
      changing = true;
      const change = new ParameterValueChange(parameter, select.selectedIndex);
      undoRedoManager.addChange(change);
      changing = false;
    };
    select.addEventListener('change', valueChange);

  }
}

visualiveUxFactory.registerWidget(
  MultiChoiceWidget,
  p => p instanceof Visualive.MultiChoiceParameter
);
