import visualiveUxFactory from '../VisualiveUxFactory';
import BaseWidget from './BaseWidget';

class BooleanWidget extends BaseWidget {
  constructor(parameter, parentDomElem) {
    super(parameter);

    const input = document.createElement('input');
    input.className = 'mdl-switch__input';
    input.setAttribute('id', parameter.getName());
    input.setAttribute('type', 'checkbox');
    input.setAttribute('checked', parameter.getValue());
    input.setAttribute('tabindex', 0);

    parentDomElem.appendChild(input);
    componentHandler.upgradeElement(input);

    /////////////////////////////
    // Handle Changes.

    let settingParameterValue = false;
    parameter.valueChanged.connect(() => {
      if (!settingParameterValue)
        input.setAttribute('checked', parameter.getValue());
    });
    input.addEventListener('input', () => {
      settingParameterValue = true;
      parameter.setValue(input.checked);
      settingParameterValue = false;
    });
  }
}

visualiveUxFactory.registerWidget(
  BooleanWidget,
  p => p.constructor.name == 'BooleanParameter'
);
