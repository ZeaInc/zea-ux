import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class MultiChoiceWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    super(parameter);

    let value = parameter.getValue();
    const range = parameter.getRange();
    const choices = parameter.getChoices();
    let select = document.createElement('select');
    const options = [];
    const optionsMap = {};
    for (let i=0; i < choices.length; i++) {
      const choice = choices[i];
      let option = document.createElement('option');
      option.setAttribute('value', choice);
      if(value == i)
        option.setAttribute('selected', true);


      option.appendChild(document.createTextNode(choice));
      select.appendChild(option);
      options.push(option)
      optionsMap[choice] = i;
    }

    parentDomElem.appendChild(select);

    /////////////////////////////
    // SceneWidget Changes.

    let changing = false;

    parameter.valueChanged.connect(() => {
      if (!changing){
        options[value].removeAttribute('selected');
        value = parameter.getValue(); 
        options[value].setAttribute('selected', true);
      } 
    });

    const valueChange = (event) => {
      console.log(event.target.value, value)
      options[value].removeAttribute('selected');
      value = optionsMap[event.target.value]
      options[value].setAttribute('selected', true);

      changing = true;
      const change = new ParameterValueChange(parameter, value);
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
