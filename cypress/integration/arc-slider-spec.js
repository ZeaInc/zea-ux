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

    cy.get('canvas').trigger('mousemove', 700, 40).trigger('mousemove', 770, 330)
    cy.wait(100)
    cy.get('canvas').percySnapshot('ArcSliderHighlights')
  })

  it('Arc Highlights Different Color', () => {
    cyFocusCanvas()

    cy.get('canvas').trigger('mousemove', 500, 40).trigger('mousemove', 500, 140)
    cy.wait(100)
    cy.get('canvas').percySnapshot('ArcSliderHighlightsDifferentColor')
  })

  it('Arc Slider Moves - Mouse', () => {
    cyFocusCanvas()

    cy.get('canvas').trigger('mousedown', 500, 140).trigger('mousemove', 100, 140).trigger('mouseup', 100, 140)
    cy.wait(100)
    cy.get('canvas').percySnapshot('ArcSliderMovesMouse')
  })

  it('Arc Slider Moves - Touch', () => {
    cyFocusCanvas()

    const eTouchStart = createTouchEvents([500, 140])
    const eTouch = createTouchEvents([100, 140])

    cy.get('canvas').trigger('touchstart', eTouchStart).trigger('touchmove', eTouch).trigger('touchend', eTouch)

    cy.wait(100)
    cy.get('canvas').percySnapshot(`ArcSliderMovesTouch`)
  })
})
