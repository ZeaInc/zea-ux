
class BooleanWidget extends BaseWidget {
  constructor(parameter, parentDomElem){
    super(parameter)

    const input = document.createElement('input');
    input.className = 'mdl-switch__input'
    input.setAttribute('id', parameter.getName() );
    input.setAttribute('type', 'checkbox')
    input.setAttribute('checked', parameter.getValue())
    input.setAttribute('tabindex', 0 )

    parentDomElem.appendChild(inputOwner);
    componentHandler.upgradeElement(input);

    /////////////////////////////
    // Handle Changes.

    let settingParameterValue = false;
    parameter.valueChanged.connect(()=>{
      if(!settingParameterValue)
        input.setAttribute('checked', parameter.getValue())
    })
    this.input.addEventListener('input', ()=>{
      settingParameterValue = true;
      parameter.setValue(this.input.checked)
      settingParameterValue = false;
    });
  }
}

parameterWidgetFactory.registerWidget(BooleanWidget, (p) => p.constructor.name == 'BooleanParameter')