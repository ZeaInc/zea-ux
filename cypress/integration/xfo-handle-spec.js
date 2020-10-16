import { createTouchEvents, cyFocusCanvas } from './utils'

describe('Xfo Handle', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/xfo-handle.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Xfo Handle Highlights', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')

    canvas.trigger('mousemove', 450, 485).trigger('mousemove', 500, 485).percySnapshot('XfoHandleTranslateHighlights')

    cyFocusCanvas()
    canvas.trigger('mousemove', 300, 290).trigger('mousemove', 250, 290).percySnapshot('XfoHandleScaleHighlights')

    cyFocusCanvas()
    canvas.trigger('mousemove', 850, 290).trigger('mousemove', 815, 290).percySnapshot('XfoHandleRotateHighlights')
  })

  it('Xfo Handle Performs Actions - Mouse', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')

    canvas
      .trigger('mousedown', 500, 485)
      .trigger('mousemove', 500, 400)
      .trigger('mouseup', 500, 400)
      .percySnapshot('XfoHandleTranslateMovesMouse')

    cyFocusCanvas()
    canvas
      .trigger('mousedown', 250, 290)
      .trigger('mousemove', 250, 250)
      .trigger('mouseup', 250, 250)
      .percySnapshot('XfoHandleScaleScalesMouse')

    cyFocusCanvas()
    canvas
      .trigger('mousedown', 815, 290)
      .trigger('mousemove', 860, 290)
      .trigger('mouseup', 860, 290)
      .percySnapshot('XfoHandleRotateRotatesMouse')
  })
})
