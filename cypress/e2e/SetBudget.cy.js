/// <reference types="cypress" />

describe('CreateBudget', () => {
  // E2E: Test adding a budget
  it('should add a budget successfully and display a success notification', () => {
    cy.visit('/dashboard'); 
    cy.intercept('POST', `${Cypress.env('apiUrl')}/api/budgets`, {
      statusCode: 200,
      body: { message: 'Budget added successfully' },
    }).as('CreateBudget');

    cy.get('.add-budget-form input[type="text"]').type('Groceries');
    cy.get('.add-budget-form input[type="number"]').type('100');
    cy.clock(new Date(2023, 0, 15).getTime());
    cy.get('.add-budget-form button.add-button').click();

    cy.wait('@CreateBudget');

    cy.get('.NotificationManager-success').should('be.visible');
  });




  // Visual Regression: Test for matching the CreateBudget component snapshot
  it('should match the CreateBudget component snapshot', () => {
  
    cy.visit('/userdashboard'); 

    cy.eyesOpen({
      appName: 'finanaceapplication', 
      testName: 'CreateBudget Component Snapshot',
    });

    cy.eyesCheckWindow('CreateBudget Component');
    cy.eyesClose();
  });
});
