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

    cy.get('canvas').trigger('mousemove', 450, 485).trigger('mousemove', 500, 420)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandleTranslateHighlights')

    cy.wait(100)
    cy.get('canvas').trigger('mousemove', 300, 290).trigger('mousemove', 480, 500)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandlePlanarHighlights')

    cy.wait(100)
    cy.get('canvas').trigger('mousemove', 850, 290).trigger('mousemove', 535, 480)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandleRotateHighlights')
  })

  it('Xfo Handle Performs Actions - Mouse', () => {
    cy.get('canvas').trigger('mousedown', 500, 420).trigger('mousemove', 500, 400).trigger('mouseup', 500, 400)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandleTranslateMovesMouse')

    cy.wait(100)
    cy.get('canvas').trigger('mousedown', 480, 480).trigger('mousemove', 500, 480).trigger('mouseup', 500, 480)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandlePlanarMovesMouse')

    cy.wait(100)
    cy.get('canvas').trigger('mousedown', 555, 460).trigger('mousemove', 555, 440).trigger('mouseup', 555, 440)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandleRotateRotatesMouse')
  })

  it('Xfo Handle Performs Actions - Touch', () => {
    const trTouchStart = createTouchEvents([500, 420])
    const trTouchEnd = createTouchEvents([500, 400])

    cy.get('canvas')
      .trigger('touchstart', trTouchStart)
      .trigger('touchmove', trTouchEnd)
      .trigger('touchend', trTouchEnd)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandleTranslateMovesTouch')

    cy.wait(100)

    const scTouchStart = createTouchEvents([480, 480])
    const scTouchEnd = createTouchEvents([500, 480])

    cy.get('canvas')
      .trigger('touchstart', scTouchStart)
      .trigger('touchmove', scTouchEnd)
      .trigger('touchend', scTouchEnd)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandlePlanarMovesTouch')
    cy.wait(100)

    const rtTouchStart = createTouchEvents([555, 460])
    const rtTouchEnd = createTouchEvents([555, 440])

    cy.get('canvas')
      .trigger('touchstart', rtTouchStart)
      .trigger('touchmove', rtTouchEnd)
      .trigger('touchend', rtTouchEnd)
    cy.wait(100)
    cy.get('canvas').percySnapshot('XfoHandleRotateRotatesTouch')
  })
})
