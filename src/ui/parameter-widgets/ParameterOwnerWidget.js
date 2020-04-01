import { BaseItem, ParameterOwner } from '@zeainc/zea-engine'
import BaseWidget from './BaseWidget.js'
import NameWidget from './NameWidget.js'
import uxFactory from '../UxFactory.js'
import ParameterContainer from '../parameter-container.js'

/**
 * Class representing a parameter owner widget.
 * @extends BaseWidget
 */
export default class ParameterOwnerWidget extends BaseWidget {
  /**
   * Create a parameter owner widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter)

    const ul = document.createElement('ul')
    ul.className = 'list pa0'
    const linameWidget = document.createElement('li')
    const liparameterContainer = document.createElement('li')
    parentDomElem.appendChild(ul)
    ul.appendChild(linameWidget)
    ul.appendChild(liparameterContainer)

    const displayParameterOwner = (parameterOwner) => {
      if (parameterOwner instanceof BaseItem)
        this.nameWidget = new NameWidget(parameterOwner, linameWidget, appData)
      this.parameterContainer = new ParameterContainer(
        parameterOwner,
        liparameterContainer,
        appData
      )
    }
    const parameterOwner = parameter.getValue()
    if (parameterOwner) {
      displayParameterOwner(parameterOwner)
    }

    parameter.valueChanged.connect(() => {
      while (linameWidget.firstChild)
        linameWidget.removeChild(linameWidget.firstChild)
      while (liparameterContainer.firstChild)
        liparameterContainer.removeChild(liparameterContainer.firstChild)
      displayParameterOwner(parameter.getValue())
    })
  }
}

uxFactory.registerWidget(
  ParameterOwnerWidget,
  (p) => p.getValue() instanceof ParameterOwner
)
