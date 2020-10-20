import { createTouchEvents, cyFocusCanvas } from './utils'

describe('Slider Handle', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/slider-handle.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Slider Handle Highlights', () => {
    cyFocusCanvas()

    cy.get('canvas').trigger('mousemove', 500, 325).trigger('mousemove', 595, 325).percySnapshot('ArcSliderHighlights')
  })

  it('Slider Handle Highlights Different Color', () => {
    cyFocusCanvas()

    cy.get('canvas')
      .trigger('mousemove', 500, 325)
      .trigger('mousemove', 400, 325)
      .percySnapshot('ArcSliderHighlightsDifferentColor')
  })

  it('Slider Handle Moves - Mouse', () => {
    cyFocusCanvas()

    cy.get('canvas')
      .trigger('mousedown', 595, 325)
      .trigger('mousemove', 595, 225)
      .trigger('mouseup', 595, 225)
      .percySnapshot('ArcSliderMovesMouse')
  })

  it('Slider Handle Moves - Touch', () => {
    cyFocusCanvas()

    const eTouchStart = createTouchEvents([400, 325])
    const eTouch = createTouchEvents([400, 125])

    cy.get('canvas')
      .trigger('touchstart', eTouchStart)
      .trigger('touchmove', eTouch)
      .trigger('touchend', eTouch)
      .percySnapshot(`ArcSliderMovesTouch`)
  })
})
