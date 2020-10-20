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

    cy.get('canvas')
      .trigger('mousemove', 450, 485)
      .trigger('mousemove', 500, 485)
      .percySnapshot('XfoHandleTranslateHighlights')

    cy.wait(100)
    cy.get('canvas')
      .trigger('mousemove', 300, 290)
      .trigger('mousemove', 250, 290)
      .percySnapshot('XfoHandleScaleHighlights')

    cy.wait(100)
    cy.get('canvas')
      .trigger('mousemove', 850, 290)
      .trigger('mousemove', 815, 290)
      .percySnapshot('XfoHandleRotateHighlights')
  })

  it('Xfo Handle Performs Actions - Mouse', () => {
    cyFocusCanvas()

    cy.get('canvas')
      .trigger('mousedown', 500, 485)
      .trigger('mousemove', 500, 400)
      .trigger('mouseup', 500, 400)
      .percySnapshot('XfoHandleTranslateMovesMouse')

    cy.wait(100)
    cy.get('canvas')
      .trigger('mousedown', 250, 290)
      .trigger('mousemove', 250, 250)
      .trigger('mouseup', 250, 250)
      .percySnapshot('XfoHandleScaleScalesMouse')

    cy.wait(100)
    cy.get('canvas')
      .trigger('mousedown', 815, 290)
      .trigger('mousemove', 860, 290)
      .trigger('mouseup', 860, 290)
      .percySnapshot('XfoHandleRotateRotatesMouse')
  })

  it('Xfo Handle Performs Actions - Touch', () => {
    cyFocusCanvas()

    const trTouchStart = createTouchEvents([500, 485])
    const trTouchEnd = createTouchEvents([500, 400])

    cy.get('canvas')
      .trigger('touchstart', trTouchStart)
      .trigger('touchmove', trTouchEnd)
      .trigger('touchend', trTouchEnd)
      .percySnapshot('XfoHandleTranslateMovesTouch')

    cy.wait(100)

    const scTouchStart = createTouchEvents([250, 290])
    const scTouchEnd = createTouchEvents([250, 250])

    cy.get('canvas')
      .trigger('touchstart', scTouchStart)
      .trigger('touchmove', scTouchEnd)
      .trigger('touchend', scTouchEnd)
      .percySnapshot('XfoHandleScaleScalesTouch')
    cy.wait(100)

    const rtTouchStart = createTouchEvents([815, 290])
    const rtTouchEnd = createTouchEvents([860, 250])

    cy.get('canvas')
      .trigger('touchstart', rtTouchStart)
      .trigger('touchmove', rtTouchEnd)
      .trigger('touchend', rtTouchEnd)
      .percySnapshot('XfoHandleRotateRotatesTouch')
  })
})
