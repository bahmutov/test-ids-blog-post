/// <reference types="cypress" />

it('loads', () => {
  cy.visit('/')
  cy.get('.loaded')
})
