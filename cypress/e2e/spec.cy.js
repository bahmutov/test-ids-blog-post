/// <reference types="cypress" />

it('adds 2 items', () => {
  // clear all todos before the test
  cy.request('POST', '/reset', { todos: [] })
  cy.visit('/')
  cy.get('.loaded')
  cy.get('[data-testid="TodoInput"]')
    .type('Write code{enter}')
    .type('Test it{enter}')
  cy.get('[data-testid="Todos"]')
    .find('[data-testid^=Todo-]')
    .should('have.length', 2)
})
