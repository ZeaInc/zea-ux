
class StringWidget extends BaseWidget {
  constructor(parameter){
    super(parameter)

    const textInput = document.createElement('input');
    textInput.className = 'mdl-textfield__input'
    textInput.setAttribute('id', parameter.getName() );
    textInput.setAttribute('type', 'text')
    textInput.setAttribute('value', parameter.getValue() )
    textInput.setAttribute('tabindex', 0 )

    // const div = document.createElement('div')
    // div.className = 'quantity';
    // div.appendChild(textInput);

    this.inputOwner = textInput;
    this.input = textInput;
  
    let settingParameterValue = false;
    parameter.valueChanged.connect(()=>{
      if(!settingParameterValue)
        this.input.value = parameter.getValue();
    })
    this.input.addEventListener('input', ()=>{
      settingParameterValue = true;
      parameter.setValue(this.input.value)
      settingParameterValue = false;
    });
  }

  setParentDomElem(parentDomElem){
    this.parentDomElem = parentDomElem;
    parentDomElem.appendChild(this.labelElem);
    parentDomElem.appendChild(this.inputOwner);
    componentHandler.upgradeElement(this.input);
  }
}
