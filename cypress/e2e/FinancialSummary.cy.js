 <reference types="cypress" />

describe('BudgetOverview', () => {
  // E2E: Test loading budgets for a specific month
  it('should load budgets for a specific month', () => {
   
    cy.visit('/userdashboard'); 
    cy.intercept('GET', 'http://localhost:5000/api/budgets/getAllBudgets/2', { fixture: 'budgets.json' }).as('getAllBudgets');

    cy.get('.select-dropdown').select('2');

    cy.wait('@getAllBudgets');
    cy.get('.budget-table').should('be.visible');
  });


  
  // Visual Regression: Test for matching the BudgetList component snapshot
  it('should match the BudgetOverview component snapshot', () => {
    cy.visit('/userdashboard');

    cy.intercept('GET', 'http://localhost:5000/api/budgets/getAllBudgets', { fixture: 'budgets.json' }).as('getAllBudgets');

    cy.eyesOpen({
      appName: 'financeapplication',
      testName: 'BudgetOverview Component Snapshot',
    });

    cy.eyesCheckWindow('BudgetOverview Component');

    cy.eyesClose();
  });
});
