/* eslint-disable no-unused-vars */
import { createTouchEvents, cyFocusCanvas } from './utils'

describe('ToolManager', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/tool-manager.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Defaults on Camera manipulator - Mouse - Left Btn', () => {
    cy.get('#renderer')
      .trigger('mousedown', 400, 100)
      .trigger('mousemove', 450, 200)
      .trigger('mouseup', 450, 200)
      .percySnapshot('DefaultCamManMouseLeftBtn')
  })

  it('Defaults on Camera manipulator - Mouse - Right Btn', () => {
    cy.get('#renderer')
      .trigger('mousedown', { button: 2, x: 400, y: 100 })
      .trigger('mousemove', 500, 100)
      .trigger('mouseup', 500, 100)
      .percySnapshot('DefaultCamManMouseRightBtn')
  })

  it('Defaults on Camera manipulator - Touch', () => {
    const initTouch = createTouchEvents([400, 100])
    const finalTouch = createTouchEvents([450, 200])

    cy.get('#renderer')
      .trigger('touchstart', initTouch)
      .trigger('touchmove', finalTouch)
      .trigger('touchend', { ...finalTouch, touch: {} })
      .percySnapshot('DefaultCamManTouch')
  })

  it('Selects block and uses Camera Manipulator', () => {
    cy.get('#selection').click()
    cy.get('#renderer').click()
    cy.get('#renderer')
      .trigger('mousedown', 400, 300)
      .trigger('mousemove', 500, 400)
      .trigger('mouseup', 500, 400)
      .percySnapshot('SelectionToolSelectsBlock')

    cy.get('#renderer')
      .trigger('mousedown', { button: 2, x: 400, y: 100 })
      .trigger('mousemove', 500, 100)
      .trigger('mouseup', 500, 100)
      .percySnapshot('SelectionToolPanning')

    cy.get('#renderer').trigger('wheel', {
      deltaX: -0,
      deltaY: -200,
      deltaZ: 0,
    })

    cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-moving-camera`)
    cy.get('#renderer').percySnapshot(`SelectionToolWheelZoomIn`)
  })

  it('Measures and uses Camera Manipulator', () => {
    cy.get('#selection').click()
    cy.get('#measurement').click()
    cy.get('#renderer').click()
    cy.get('#renderer')
      .trigger('mousedown', 450, 400)
      .trigger('mousemove', 550, 400)
      .trigger('mouseup', 550, 400)
      .percySnapshot('MeasurementToolMouse')

    cy.get('#renderer')
      .trigger('mousedown', { button: 2, x: 400, y: 100 })
      .trigger('mousemove', 500, 100)
      .trigger('mouseup', 500, 100)
      .percySnapshot('MeasurementToolPanning')

    cy.get('#renderer').trigger('wheel', {
      deltaX: -0,
      deltaY: -200,
      deltaZ: 0,
    })

    cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-moving-camera`)
    cy.get('#renderer').percySnapshot(`MeasurementToolWheelZoomIn`)
  })

  it('FreeHandLine and uses Camera Manipulator', () => {
    cy.get('#selection').click()
    cy.get('#measurement').click()
    cy.get('#free-hand-line').click()
    cy.get('#renderer').click()
    cy.get('#renderer').trigger('mousedown', 350, 100).trigger('mousemove', 450, 200).trigger('mouseup', 450, 200)
    cy.get('#renderer').trigger('mousedown', 250, 200).trigger('mousemove', 350, 300).trigger('mouseup', 350, 300)
    cy.get('#renderer').percySnapshot('FreeHandLineToolMouse')

    cy.get('#renderer')
      .trigger('mousedown', { button: 2, x: 400, y: 100 })
      .trigger('mousemove', 500, 100)
      .trigger('mouseup', 500, 100)
      .percySnapshot('FreeHandLineToolPanning')

    cy.get('#renderer').trigger('wheel', {
      deltaX: -0,
      deltaY: -200,
      deltaZ: 0,
    })

    cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-moving-camera`)
    cy.get('#renderer').percySnapshot(`FreeHandLineToolWheelZoomIn`)
  })
})
