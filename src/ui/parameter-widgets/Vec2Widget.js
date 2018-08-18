
class Vec2Widget {
  constructor(parameter){

    this.labelElem = document.createElement('label');
    this.labelElem.setAttribute('for', parameter.getName() );
    this.labelElem.appendChild(document.createTextNode(parameter.getName()));


    this.container = document.createElement('div');
    this.container.className = 'container';

    this.ul = document.createElement('ul');
    this.ul.className = 'flex-editvalues';
    this.container.appendChild(this.ul);


    const xField = document.createElement('input');
    // xField.className = 'mdl-textfield__input'
    xField.setAttribute('id', parameter.getName() );
    xField.setAttribute('type', 'number')
    xField.setAttribute('pattern', '-?[0-9]*(\.[0-9]+)?')
    xField.setAttribute('value', parameter.getValue().x )
    xField.setAttribute('tabindex', 0 )
    xField.style.width = '50%'

    const xli = document.createElement("li");
    xli.appendChild(xField);
    this.ul.appendChild(xli);

    const yField = document.createElement('input');
    // yField.className = 'mdl-textfield__input'
    yField.setAttribute('id', parameter.getName() );
    yField.setAttribute('type', 'number')
    yField.setAttribute('pattern', '-?[0-9]*(\.[0-9]+)?')
    yField.setAttribute('value', parameter.getValue().y )
    yField.setAttribute('tabindex', 0 )
    yField.style.width = '50%'

    const yli = document.createElement("li");
    yli.appendChild(yField);
    this.ul.appendChild(yli);

    let settingParameterValue = false;
    parameter.valueChanged.connect(()=>{
      if(!settingParameterValue){
        const vec2 = parameter.getValue();
        xField.value = vec2.x
        yField.value = vec2.y
      }
    })
    const updateParam = ()=>{
      settingParameterValue = true;
      parameter.setValue(new Visualive.Vec2(xField.valueAsNumber, yField.valueAsNumber))
      settingParameterValue = false;
    }
    xField.addEventListener('input', updateParam);
    yField.addEventListener('input', updateParam);
  }

  setParentDomElem(parentDomElem){
    this.parentDomElem = parentDomElem;
    parentDomElem.appendChild(this.labelElem);
    parentDomElem.appendChild(this.container);
  }
}
