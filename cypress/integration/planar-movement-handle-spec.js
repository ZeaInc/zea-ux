import { createTouchEvents, cyFocusCanvas } from './utils'

describe('Planar Movement Handle', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/planar-movement-handle.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Planar Movement Handle Moves - Mouse', () => {
    cy.get('canvas').trigger('mousedown', 500, 300).trigger('mousemove', 500, 350).trigger('mouseup', 500, 350)
    cy.wait(100)
    cy.get('canvas').percySnapshot('PlanarMovementHandleMovesMouse')
  })

  it('Planar Movement Handle Moves - Touch', () => {
    const eTouchStart = createTouchEvents([500, 300])
    const eTouch = createTouchEvents([600, 300])

    cy.get('canvas').trigger('touchstart', eTouchStart).trigger('touchmove', eTouch).trigger('touchend', eTouch)
    cy.wait(100)
    cy.get('canvas').percySnapshot(`PlanarMovementHandleMovesTouch`)
  })
})
