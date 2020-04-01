import { ValueSetMode, NumberParameter } from '@zeainc/zea-engine'
import BaseWidget from './BaseWidget.js'
import uxFactory from '../UxFactory.js'
import ParameterValueChange from '../../undoredo/ParameterValueChange.js'

/**
 * Class representing a number widget.
 * @extends BaseWidget
 */
export default class NumberWidget extends BaseWidget {
  /**
   * Create a number widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter)

    const range = parameter.getRange()
    const input = document.createElement('input')
    const classes = []
    if (range) {
      classes.push('mdl-slider')
      classes.push('mdl-js-slider')
      input.className = classes.join(' ')
      input.setAttribute('id', parameter.getName())
      input.setAttribute('type', 'range')
      input.setAttribute('min', 0)
      input.setAttribute('max', 200)
      // Note: range sliders only work with integer numbers
      // so convert our value to an integer between 0 .. 200
      const value =
        ((parameter.getValue() - range[0]) / (range[1] - range[0])) * 200
      input.setAttribute('value', value)
      const step = parameter.getStep()
      if (step) input.setAttribute('step', step)
      else {
        input.setAttribute('step', 1)
      }
      input.setAttribute('tabindex', 0)
    } else {
      input.className = classes.join(' ')
      input.setAttribute('id', parameter.getName())
      input.setAttribute('type', 'number')
      input.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?')
      input.setAttribute('value', parameter.getValue())
      input.setAttribute('tabindex', 0)
    }
    parentDomElem.appendChild(input)

    // ///////////////////////////
    // Handle Changes.

    let change = undefined
    let remoteUserEditedHighlightId
    parameter.valueChanged.connect((mode) => {
      if (!change) {
        if (range)
          input.value =
            ((parameter.getValue() - range[0]) / (range[1] - range[0])) * 200
        else input.value = parameter.getValue()
        if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
          input.classList.add('user-edited')
          if (remoteUserEditedHighlightId)
            clearTimeout(remoteUserEditedHighlightId)
          remoteUserEditedHighlightId = setTimeout(() => {
            input.classList.remove('user-edited')
            remoteUserEditedHighlightId = null
          }, 1500)
        }
      }
    })

    function round(value, decimals = 6) {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
    }
    const valueChange = () => {
      let value = round(input.valueAsNumber)
      if (range) {
        // Renmap from the 0..200 integer to the floating point
        // range specified in the parameter.
        value = range[0] + (value / 200) * (range[1] - range[0])
        value = Math.clamp(value, range[0], range[1])
      }
      if (!change) {
        change = new ParameterValueChange(parameter, value)
        appData.undoRedoManager.addChange(change)
      } else {
        change.update({ value })
      }
    }

    const valueChangeEnd = () => {
      if (change) {
        // The parmaeter  will emit this special signal to indicate
        // and interaction has finished.
        parameter.setValueDone()
        change = undefined
      }
    }

    input.addEventListener('input', () => {
      valueChange()
    })
    input.addEventListener('change', valueChangeEnd)
    input.addEventListener('keydown', function (e) {
      if (e.which === 38 || e.which === 40) {
        if (e.which === 38)
          input.valueAsNumber = round(input.valueAsNumber + 0.1)
        if (e.which === 40)
          input.valueAsNumber = round(input.valueAsNumber - 0.1)
        valueChange()
        e.preventDefault()
      }
    })
    input.addEventListener('focusout', valueChangeEnd)
  }
}

uxFactory.registerWidget(NumberWidget, (p) => p instanceof NumberParameter)
