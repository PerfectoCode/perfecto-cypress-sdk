describe('My First Test', () => {
  it('Test passing env variables with CYPRESS_ prefix', () => {
    expect(Cypress.config().pageLoadTimeout)
      .to.equal(10000000, 'Expect Cypress.config().pageLoadTimeout to get value from env var CYPRESS_PAGE_LOAD_TIMEOUT')


    expect(Cypress.env('ENV_NIC_NAME'))
      .to.equal('Cool env', 'Expect Cypress.env(\'ENV_NIC_NAME\') to get value from env var ENV_NIC_NAME')
  })

  it('clicking "type" shows the right headings', () => {

    cy.visit('https://example.cypress.io')

    cy.contains('type').click()


    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
