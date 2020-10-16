import { createTouchEvents, cyFocusCanvas } from './utils'

describe('Planar Movement Handle', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/screen-space-movement-handle.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Screen Space Movement Handle Moves - Mouse', () => {
    cyFocusCanvas()

    cy.window().then((win) => {
      const variant = 'x-axis'
      win.postMessage(variant)
      cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-${variant}`)

      cy.get('canvas')
        .trigger('mousedown', 500, 330)
        .trigger('mousemove', 600, 150)
        .trigger('mouseup', 600, 150)
        .percySnapshot(`ScreenSpaceMovementHandleMouse${variant}`)
    })

    cy.window().then((win) => {
      const variant = 'y-axis'
      win.postMessage(variant)
      cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-${variant}`)
      cy.get('canvas').percySnapshot(`ScreenSpaceMovementHandleMouse${variant}`)
    })
  })

  it('Screen Space Movement Handle Moves - Touch', () => {
    cyFocusCanvas()

    cy.window().then((win) => {
      const variant = 'x-axis'
      win.postMessage(variant)
      cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-${variant}`)

      const eTouchStart = createTouchEvents([500, 330])
      const eTouch = createTouchEvents([600, 450])

      cy.get('canvas')
        .trigger('touchstart', eTouchStart)
        .trigger('touchmove', eTouch)
        .trigger('touchend', eTouch)
        .percySnapshot(`ScreenSpaceMovementHandleTouch${variant}`)
    })

    cy.window().then((win) => {
      const variant = 'y-axis'
      win.postMessage(variant)
      cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-${variant}`)

      cy.get('canvas').percySnapshot(`ScreenSpaceMovementHandleTouch${variant}`)
    })
  })
})
