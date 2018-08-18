
class NumberWidget extends BaseWidget {
  constructor(parameter){
    super(parameter)

    const range = parameter.getRange();
    if(range) {
      const sliderInput = document.createElement('input');
      sliderInput.className = 'mdl-slider mdl-js-slider';
      sliderInput.setAttribute('id', parameter.getName() );
      sliderInput.setAttribute('type', 'range')
      sliderInput.setAttribute('min', range[0] )
      sliderInput.setAttribute('max', range[1] )
      sliderInput.setAttribute('value', parameter.getValue() )
      const step = parameter.getStep()
      if(step)
        sliderInput.setAttribute('step', step )
      sliderInput.setAttribute('tabindex', 0 )

      this.inputOwner = sliderInput;
      this.input = sliderInput;
    }
    else {

      const numberInput = document.createElement('input');
      numberInput.className = 'mdl-textfield__input'
      numberInput.setAttribute('id', parameter.getName() );
      numberInput.setAttribute('type', 'number')
      numberInput.setAttribute('pattern', '-?[0-9]*(\.[0-9]+)?')
      numberInput.setAttribute('value', parameter.getValue() )
      numberInput.setAttribute('tabindex', 0 )

      // const div = document.createElement('div')
      // div.className = 'quantity';
      // div.appendChild(numberInput);

      this.inputOwner = numberInput;
      this.input = numberInput;
    }

    let settingParameterValue = false;
    parameter.valueChanged.connect(()=>{
      if(!settingParameterValue)
        this.input.value = parameter.getValue();
    })
    this.input.addEventListener('input', ()=>{
      settingParameterValue = true;
      parameter.setValue(this.input.valueAsNumber)
      settingParameterValue = false;
    });
  }

  setParentDomElem(parentDomElem){
    super.setParentDomElem(parentDomElem)
    parentDomElem.appendChild(this.inputOwner);
    componentHandler.upgradeElement(this.input);
  }
}
