/// <reference types="cypress" />
import '@applitools/eyes-cypress/commands';

// Open Applitools session for visual testing
Cypress.eyesOpen('personalbudget', 'Signup Tests');

describe('UserRegistration', () => {
  beforeEach(() => {
    cy.visit('/signup'); 
  });

  it('should successfully sign up a user (E2E)', () => {
    cy.get('.signup-input[name="fullName"]').type('John Doe');
    cy.get('.signup-input[name="username"]').type('john.doe');
    cy.get('.signup-input[name="password"]').type('securePassword');

    cy.get('.signup-button').click();

    cy.get('.dialog.success').should('be.visible');
  });

  it('should handle UserRegistration failure (E2E)', () => {

    cy.get('.signup-input[name="fullName"]').type('Invalid User');
    cy.get('.signup-input[name="username"]').type('invalid.user');
    cy.get('.signup-input[name="password"]').type('weakPassword');


    cy.get('.signup-button').click();

    cy.get('.dialog.error').should('be.visible');
  });

  it('should match the signup page snapshot (Visual Regression)', () => {
    
    cy.eyesOpen({
      appName: 'financeapplication', 
      testName: 'UserRegistration Page Snapshot',
    });

    cy.eyesCheckWindow('UserRegistration Page');

    cy.eyesClose();
  });
});

Cypress.eyesClose();
