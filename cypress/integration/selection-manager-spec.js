import { createTouchEvents, cyFocusCanvas } from './utils'

describe('Selection Manager', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/selection-manager.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Multi Select Geometry - Mouse', () => {
    cy.get('#selection-cbx').click()

    cy.get('canvas').click(400, 250)
    cy.wait(150)
    cy.get('canvas').click(630, 250, { ctrlKey: true })
    cy.get('canvas').percySnapshot('MultiSelectGeometryMouseSelect')
    cy.wait(150)
    cy.get('canvas').click(400, 250)
    cy.get('canvas').percySnapshot('MultiSelectGeometryMouseUnSelect')
  })

  it('Select Geometry - Translate - Mouse', () => {
    cy.get('#selection-cbx').click()

    const canvas = cy.get('canvas')
    canvas.click(400, 240)
    canvas.percySnapshot('SelectGeometryTranslateMouse')
  })

  it('Select Geometry - Translate Move - Mouse', () => {
    cy.get('#selection-cbx').click()

    const canvas = cy.get('canvas')
    canvas.click(400, 250)

    canvas.trigger('mousedown', 300, 270).trigger('mousemove', 200, 270).trigger('mouseup', 200, 270)
    canvas.percySnapshot('SelectGeometryTranslateMoveMouse')
  })

  it('Select Geometry - Rotate - Mouse', () => {
    cy.get('#selection-cbx').click()
    const canvas = cy.get('canvas')
    canvas.click(400, 250)
    cy.get('#rotate').click()
    canvas.percySnapshot('SelectGeometryRotateMouse')
  })

  it('Select Geometry - Rotate Move - Mouse', () => {
    cy.get('#selection-cbx').click()
    cy.get('#rotate').click()

    const canvas = cy.get('canvas')
    canvas.click(400, 250)
    canvas.trigger('mousedown', 400, 130).trigger('mousemove', 300, 130).trigger('mouseup', 300, 130)
    canvas.percySnapshot('SelectGeometryRotateMoveMouse')
  })

  it('Select Geometry - Scale - Mouse', () => {
    cy.get('#selection-cbx').click()
    cy.get('canvas').click(400, 250)
    cy.get('#scale').click()
    cy.get('canvas').percySnapshot('SelectGeometryScaleMouse')
  })

  it('Select Geometry - Scale Move - Mouse', () => {
    cy.get('#selection-cbx').click()
    cy.get('#scale').click()

    const canvas = cy.get('canvas')
    canvas.click(400, 250)
    canvas.trigger('mousedown', 320, 270).trigger('mousemove', 280, 270).trigger('mouseup', 280, 270)
    canvas.percySnapshot('SelectGeometryRotateMoveMouse')
  })

  // Tap is not working here, triggers double click
  it('Select Geometry - Tap', () => {
    cy.get('#selection-cbx').click()
    cyFocusCanvas()

    const eTouch = createTouchEvents([400, 250])
    cy.get('canvas').trigger('touchstart', eTouch).trigger('touchend', eTouch)
  })
})
