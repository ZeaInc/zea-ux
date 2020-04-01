import { ImageParameter } from '@zeainc/zea-engine'
import ParameterOwnerWidget from './ParameterOwnerWidget.js'
import uxFactory from '../UxFactory.js'
import ParameterValueChange from '../../undoredo/ParameterValueChange.js'

/**
 * Class representing a image widget.
 * @extends BaseWidget
 */
export default class ImageWidget extends ParameterOwnerWidget {
  /**
   * Create a material color widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    let image = parameter.getValue()
    let dropDiv
    {
      const ul = document.createElement('ul')
      ul.style.width = '100%'
      ul.style['padding-inline-start'] = '0px'

      {
        const input = document.createElement('input')
        input.className = 'mdl-textfield__input'
        input.setAttribute('id', parameter.getName())
        input.setAttribute('type', 'text')
        input.setAttribute('value', image ? image.getPath() : '<NONE>')
        input.setAttribute('tabindex', 0)

        const li = document.createElement('li')
        li.style.display = 'block'
        li.appendChild(input)
        ul.appendChild(li)
      }

      parentDomElem.appendChild(ul)
    }
    super(parameter, parentDomElem, appData)

    parameter.valueChanged.connect(() => {
      if (!image) {
        parentDomElem.removeChild(dropDiv)
      }
    })
  }

  /**
   * The setParentDomElem method.
   * @param {any} parentDomElem - The parentDomElem param.
   */
  setParentDomElem(parentDomElem) {}
}

uxFactory.registerWidget(ImageWidget, (p) => p instanceof ImageParameter)
