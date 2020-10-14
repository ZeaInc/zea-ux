import { createTouchEvents, cyFocusCanvas } from './utils'

describe('Arc Slider', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/arc-slider.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Arc Highlights', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousemove', 700, 40).trigger('mousemove', 770, 330)
    canvas.percySnapshot('ArcSliderHighlights')
  })

  it('Arc Highlights Different Color', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousemove', 500, 40).trigger('mousemove', 500, 140)
    canvas.percySnapshot('ArcSliderHighlightsDifferentColor')
  })

  it('Arc Slider Moves - Mouse', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousedown', 500, 140).trigger('mousemove', 100, 140).trigger('mouseup', 100, 140)
    canvas.percySnapshot('ArcSliderMovesMouse')
  })

  it.only('Arc Slider Moves - Touch', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')

    const eTouchStart = createTouchEvents([500, 140])
    const eTouch = createTouchEvents([100, 140])

    cy.get('canvas').trigger('touchstart', eTouchStart).trigger('touchmove', eTouch).trigger('touchend', eTouch)

    canvas.percySnapshot(`ArcSliderMovesTouch`)
  })
})
