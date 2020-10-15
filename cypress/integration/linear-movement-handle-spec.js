import { createTouchEvents, cyFocusCanvas } from './utils'

describe('Linear Movement Handle', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/linear-movement-handle.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Linear Movement Handle Highlights', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousemove', 700, 250).trigger('mousemove', 525, 250)
    canvas.percySnapshot('LinearMovementHandleHighlights')
  })

  it('Linear Movement Handle Highlights Different Color', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousemove', 500, 40).trigger('mousemove', 400, 250)
    canvas.percySnapshot('LinearMovementHandleHighlightsDifferentColor')
  })

  it('Linear Movement Handle Moves - Mouse', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousedown', 400, 250).trigger('mousemove', 500, 150).trigger('mouseup', 500, 150)
    canvas.percySnapshot('LinearMovementHandleMovesMouse')
  })

  it('Linear Movement Handle Moves - Touch', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')

    const eTouchStart = createTouchEvents([525, 250])
    const eTouch = createTouchEvents([400, 340])

    cy.get('canvas').trigger('touchstart', eTouchStart).trigger('touchmove', eTouch).trigger('touchend', eTouch)

    canvas.percySnapshot(`LinearMovementHandleMovesTouch`)
  })
})
