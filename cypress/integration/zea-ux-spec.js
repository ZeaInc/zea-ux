describe.skip('Zea UX', () => {
  it('Renders an arch slider', () => {
    cy.visit('testing-e2e/arc-slider.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })

    cy.window().then((win) => {
      const variant = 'x-axis'
      win.postMessage(variant)
      cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-${variant}`)
      cy.get('canvas').percySnapshot(`Arch slider ${variant}`)
    })

    cy.window().then((win) => {
      const variant = 'y-axis'
      win.postMessage(variant)
      cy.get('@postMessage').its('lastCall.args.0').should('equal', `done-${variant}`)
      cy.get('canvas').percySnapshot(`Arch slider ${variant}`)
    })
  })
})
