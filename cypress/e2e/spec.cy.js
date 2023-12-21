/// <reference types="cypress" />

Cypress.Commands.add('getByTestId', (id) => {
  const selector = `[data-testid="${id}"]`
  return cy.get(selector)
})

Cypress.Commands.add(
  'findByTestId',
  { prevSubject: 'element' },
  (subject, id) => {
    const selector = `[data-testid="${id}"]`
    return cy.wrap(subject, { log: false }).find(selector)
  },
)

it('adds 2 items', () => {
  // clear all todos before the test
  cy.request('POST', '/reset', { todos: [] })
  cy.visit('/')
  cy.get('.loaded')
  cy.getByTestId('TodoInput').type('Write code{enter}').type('Test it{enter}')
  cy.getByTestId('Todos').findByTestId('Todo').should('have.length', 2)
  cy.getByTestId('Footer')
    .findByTestId('TodosRemaining')
    .should('have.text', '2')
})

it('shows 2 items', () => {
  // clear all todos before the test
  cy.request('POST', '/reset', { todos: [] })
  cy.visit('/')
  cy.get('.loaded')
  cy.getByTestId('TodoInput').type('Write code{enter}').type('Test it{enter}')
  cy.get('.todoapp').findByTestId('Todo').should('have.length', 2)
})

it('has the correct item id', () => {
  // clear all todos before the test
  cy.request('POST', '/reset', { todos: [] })
  cy.visit('/')
  cy.get('.loaded')
  cy.intercept('POST', '/todos').as('newTodo')
  cy.getByTestId('TodoInput').type('Write code{enter}')
  cy.wait('@newTodo')
    .its('response.body.id')
    .should('be.a', 'string')
    .then((id) => {
      cy.getByTestId('Todos')
        .findByTestId('Todo')
        .should('have.attr', 'data-id', id)
    })
})

it('has a unique item id', () => {
  // clear all todos before the test
  cy.request('POST', '/reset', { todos: [] })
  cy.visit('/')
  cy.get('.loaded')
  cy.intercept('POST', '/todos').as('newTodo')
  cy.getByTestId('TodoInput')
    .type('Write code{enter}')
    .type('Test it{enter}')
    .type('Test it again{enter}')
  cy.getByTestId('Todo').should('have.length', 3)
  // the first item sent to the server
  cy.wait('@newTodo')
    .its('response.body.id')
    .should('be.a', 'string')
    .then((id) => {
      cy.getByTestId('Todo')
        .filter(`[data-id="${id}"]`)
        .should('have.length', 1)
      cy.getByTestId('Todo').first().should('have.attr', 'data-id', id)
    })
})

it('checks the data attributes object', () => {
  // clear all todos before the test
  cy.request('POST', '/reset', { todos: [] })
  cy.visit('/')
  cy.get('.loaded')
  cy.intercept('POST', '/todos').as('newTodo')
  cy.getByTestId('TodoInput')
    .type('Write code{enter}')
    .type('Test it{enter}')
    .type('Test it again{enter}')
  cy.getByTestId('Todo').should('have.length', 3)
  // the first item sent to the server
  cy.wait('@newTodo')
    .its('response.body.id')
    .should('be.a', 'string')
    .then((id) => {
      cy.getByTestId('Todo')
        .first()
        .invoke('data')
        .should('deep.equal', {
          testid: 'Todo',
          id: String(id),
        })
    })
})
