describe('Undo Redo Manager', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/undo-redo-manager.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Adds Colors', () => {
    const randomColorBtn = cy.get('#random-color')
    randomColorBtn.click()
    randomColorBtn.click()
    randomColorBtn.click()
    randomColorBtn.click()

    cy.get('#color-list').find('li').should('have.length', 4)
  })

  it('Undo and Redo', () => {
    const randomColorBtn = cy.get('#random-color')
    randomColorBtn.click()
    randomColorBtn.click()
    randomColorBtn.click()
    randomColorBtn.click()
    randomColorBtn.click()

    const undoBtn = cy.get('#undo')
    undoBtn.click()
    undoBtn.click()

    cy.get('#color-list').find('li').should('have.length', 3)

    const redoBtn = cy.get('#redo')
    redoBtn.click()
    redoBtn.click()

    cy.get('#color-list').find('li').should('have.length', 5)
  })
})
