import { StructParameter } from '@zeainc/zea-engine'
import BaseWidget from './BaseWidget.js'
import uxFactory from '../UxFactory.js'

/**
 * Class for displaying a StructParameter in an inspector.
 * @extends BaseWidget
 */
export default class StructWidget extends BaseWidget {
  /**
   * Create an item set widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter)

    const memberWidgets = []
    const rebuild = () => {
      const names = parameter.getMemberNames()
      names.forEach((name, index) => {
        const item = parameter.getMember(name)
        const reg = uxFactory.findWidgetReg(item)
        if (!reg) {
          console.warn(`StructWidget Unable to display item '${item.getNam()}'`)
          return
        }

        const li = document.createElement('li')

        const labelElem = document.createElement('label')
        labelElem.setAttribute('for', name)
        labelElem.appendChild(document.createTextNode(name))
        li.appendChild(labelElem)

        const widget = new reg.widget(item, li, appData)
        memberWidgets[index] = widget

        ul_listitems.appendChild(li)
      })
    }
    parameter.valueChanged.connect(() => {
      while (ul_listitems.firstChild) {
        ul_listitems.removeChild(ul_listitems.firstChild)
      }
      rebuild()
    })

    const ul = document.createElement('ul')
    ul.style.width = '100%'
    ul.style['padding-inline-start'] = '0px'
    const li = document.createElement('li')
    li.style.display = 'block'
    ul.appendChild(li)

    const ul_listitems = document.createElement('ul')
    ul_listitems.style.display = 'block'
    ul.appendChild(ul_listitems)

    rebuild()

    parentDomElem.appendChild(ul)
  }
}

uxFactory.registerWidget(StructWidget, (p) => p instanceof StructParameter)
