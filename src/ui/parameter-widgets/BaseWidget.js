
class BaseWidget {
  constructor(parameter){
    this.labelElem = document.createElement('label');
    this.labelElem.setAttribute('for', parameter.getName() );
    this.labelElem.appendChild(document.createTextNode(parameter.getName()));
  }

  setParentDomElem(parentDomElem){
    this.parentDomElem = parentDomElem;
    parentDomElem.appendChild(this.labelElem);
  }
}
