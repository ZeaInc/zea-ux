/* eslint-disable no-unused-vars */
import { createTouchEvents, mouseEvent } from './utils'

describe('CreateTool', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/create-tool.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Line - Mouse And Touch', () => {
    cy.get('#line-cbx').click()

    cy.get('#renderer')
      .click()
      .wait(120)
      .trigger('mousedown', mouseEvent(500, 300))
      .trigger('mousemove', mouseEvent(590, 300))
      .trigger('mouseup', mouseEvent(590, 300))
    // Workaround to a known issue in the engine
    cy.get('#cameramanipulator-cbx').click()
    cy.get('#renderer')
      .wait(120)
      .trigger('mousedown', mouseEvent(200, 400))
      .trigger('mousemove', mouseEvent(201, 400))
      .trigger('mouseup', mouseEvent(201, 400))
      .percySnapshot('LineCreationMouse')

    // cy.get('#line-cbx').click()

    // const startTouch = createTouchEvents([400, 200])
    // const endTouch = { ...createTouchEvents([450, 350]), touches: [] }
    // cy.get('#renderer')
    //   .click()
    //   .wait(120)
    //   .trigger('touchstart', startTouch)
    //   .trigger('touchmove', endTouch)
    //   .trigger('touchend', endTouch)
    //   .percySnapshot('LineCreationTouch')
  })

  it('Circle - Mouse And Touch', () => {
    cy.get('#circle-cbx').click()

    cy.get('#renderer')
      .click()
      .wait(120)
      .trigger('mousedown', mouseEvent(500, 300))
      .trigger('mousemove', mouseEvent(550, 300))
      .trigger('mouseup', mouseEvent(550, 300))
      .percySnapshot('CircleCreationMouse')

    // const startTouch = createTouchEvents([400, 100])
    // const endTouch = { ...createTouchEvents([450, 100]), touches: [] }
    // cy.get('#renderer')
    //   .trigger('touchstart', startTouch)
    //   .trigger('touchmove', endTouch)
    //   .trigger('touchend', endTouch)
    //   .percySnapshot('CircleCreationTouch')
  })

  it('FreeHandLine - Mouse And Touch', () => {
    cy.get('#freehandline-cbx').click()

    cy.get('#renderer')
      .click()
      .wait(120)
      .trigger('mousedown', mouseEvent(200, 400))
      .trigger('mousemove', mouseEvent(350, 400))
      .trigger('mousemove', mouseEvent(460, 390))
      .trigger('mousemove', mouseEvent(570, 400))
      .trigger('mouseup', mouseEvent(590, 400))

    // Workaround to a known issue in the engine
    cy.get('#cameramanipulator-cbx').click()
    cy.get('#renderer')
      .wait(120)
      .trigger('mousedown', mouseEvent(200, 400))
      .trigger('mousemove', mouseEvent(201, 400))
      .trigger('mouseup', mouseEvent(201, 400))
      .percySnapshot('FreeHandLineCreationMouse')

    // cy.get('#freehandline-cbx').click()

    // const startTouch = createTouchEvents([200, 100])
    // const endTouch = { ...createTouchEvents([550, 200]), touches: [] }
    // cy.get('#renderer')
    //   .click()
    //   .wait(120)
    //   .trigger('touchstart', startTouch)
    //   .trigger('touchend', endTouch)
    //   .percySnapshot('FreeHandLineCreationTouch')
  })

  it('Cuboid - Mouse', () => {
    cy.get('#cuboid-cbx').click()

    cy.get('#renderer')
      .trigger('mousedown', mouseEvent(500, 300))
      .trigger('mousemove', mouseEvent(550, 300))
      .trigger('mousemove', mouseEvent(550, 270))
      .trigger('mouseup', mouseEvent(550, 250))
      .trigger('mousemove', mouseEvent(550, 170))
      .trigger('mouseup', mouseEvent(550, 170))
      .percySnapshot('CuboidCreationMouse')
  })

  it('Cone - Mouse', () => {
    cy.get('#cone-cbx').click()

    cy.get('#renderer')
      .trigger('mousedown', mouseEvent(500, 300))
      .trigger('mousemove', mouseEvent(550, 300))
      .trigger('mousemove', mouseEvent(550, 270))
      .trigger('mouseup', mouseEvent(550, 250))
      .trigger('mousemove', mouseEvent(550, 170))
      .trigger('mouseup', mouseEvent(550, 170))
      .percySnapshot('ConeCreationMouse')
  })

  it('Rect - Mouse', () => {
    cy.get('#rect-cbx').click()

    cy.get('#renderer')
      .trigger('mousedown', mouseEvent(500, 300))
      .trigger('mousemove', mouseEvent(550, 300))
      .trigger('mousemove', mouseEvent(550, 270))
      .trigger('mouseup', mouseEvent(550, 250))

    cy.get('#cameramanipulator-cbx').click()
    cy.get('#renderer')
      .wait(120)
      .trigger('mousedown', mouseEvent(200, 400))
      .trigger('mousemove', mouseEvent(201, 400))
      .trigger('mouseup', mouseEvent(201, 400))
      .percySnapshot('RectCreationMouse')
  })

  it('Sphere - Mouse', () => {
    cy.get('#sphere-cbx').click()

    cy.get('#renderer')
      .trigger('mousedown', mouseEvent(500, 300))
      .trigger('mousemove', mouseEvent(550, 300))
      .trigger('mousemove', mouseEvent(550, 270))
      .trigger('mouseup', mouseEvent(550, 250))
      .percySnapshot('CircleCreationMouse')
  })
})
