import { createTouchEvents, cyFocusCanvas } from './utils'

describe('Axial Rotation Handle', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/axial-rotation-handle.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Axial Rotation Handle Highlights', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousemove', 400, 40).trigger('mousemove', 475, 330)
    canvas.percySnapshot('AxialRotationHandleHighlights')
  })

  it('Axial Rotation Handle Highlights Different Color', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousemove', 700, 40).trigger('mousemove', 700, 240)
    canvas.percySnapshot('AxialRotationHandleHighlightsDifferentColor')
  })

  it('Axial Rotation Handle Moves - Mouse', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')
    canvas.trigger('mousedown', 475, 330).trigger('mousemove', 475, 530).trigger('mouseup', 475, 530)
    canvas.percySnapshot('AxialRotationHandleMovesMouse')
  })

  it('Axial Rotation Handle Moves - Touch', () => {
    cyFocusCanvas()
    const canvas = cy.get('canvas')

    const eTouchStart = createTouchEvents([700, 240])
    const eTouch = createTouchEvents([700, 40])

    cy.get('canvas').trigger('touchstart', eTouchStart).trigger('touchmove', eTouch).trigger('touchend', eTouch)

    canvas.percySnapshot(`AxialRotationHandleMovesTouch`)
  })
})
