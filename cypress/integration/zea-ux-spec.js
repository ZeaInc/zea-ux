describe('Zea Engine', () => {
  it('Renders an arch slider', () => {
    cy.visit('ArcSlider.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })

    cy.window().then((win) => {
      const variant = 'front'
      win.postMessage(variant)
      cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-${variant}`)
      cy.get('canvas').percySnapshot(`Arch slider ${variant}`)
    })

    cy.window().then((win) => {
      const variant = 'back'
      win.postMessage(variant)
      cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-${variant}`)
      cy.get('canvas').percySnapshot(`Arch slider ${variant}`)
    })
  })
})
