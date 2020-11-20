import { createTouchEvents } from './utils'

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

  it('Select single Geometry - Mouse', () => {
    cy.get('#selection-cbx').click()

    cy.get('canvas').click(400, 240).percySnapshot('SelectGeometryTranslateMouse')
  })

  it('Select Geometry - Translate Move - Mouse', () => {
    cy.get('#selection-cbx').click()

    cy.get('canvas')
      .click(400, 250)
      .trigger('mousedown', 350, 270)
      .trigger('mousemove', 200, 270)
      .trigger('mouseup', 200, 270)
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryTranslateMoveMouse')
  })

  it('Select Geometry - Rotate Move - Mouse', () => {
    cy.get('#selection-cbx').click()

    cy.get('canvas')
      .click(400, 250)
      .trigger('mousedown', 375, 235)
      .trigger('mousemove', 410, 235)
      .trigger('mouseup', 410, 235)
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryRotateMoveMouse')
  })

  it('Select Geometry - Planar Move - Mouse', () => {
    cy.get('#selection-cbx').click()

    cy.get('canvas')
      .click(400, 250)
      .trigger('mousedown', 400, 260)
      .trigger('mousemove', 380, 280)
      .trigger('mouseup', 380, 280)
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryPlanarMoveMouse')
  })
})
