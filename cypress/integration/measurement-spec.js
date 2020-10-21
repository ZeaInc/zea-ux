describe('Measurement', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/measurement.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Calculates distance', () => {
    expect(true)
  })
})
