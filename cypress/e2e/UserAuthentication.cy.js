/// <reference types="cypress" />
import '@applitools/eyes-cypress/commands';

// Open Applitools session for visual testing
Cypress.eyesOpen('financeapplication', 'Login Tests');

describe('UserLogin', () => {
  beforeEach(() => {
    cy.visit('/login'); 
  });

  it('should UserLogin successfully (E2E)', () => {
    cy.get('.login-input').eq(0).type('your_username'); 
    cy.get('.login-input').eq(1).type('your_password'); 
    cy.get('.login-button').click();

    cy.url().should('include', '/userdashboard'); 

    // Capture visual checkpoint for successful login (Visual Regression)
    cy.eyesCheckWindow('Successful Login');
  });

  it('should display login failure message (E2E)', () => {
  
    cy.get('.login-input').eq(0).type('invalid_username'); 
    cy.get('.login-input').eq(1).type('invalid_password'); 
    cy.get('.login-button').click();

  
    cy.get('.login-modal').should('be.visible');
    cy.get('.login-modal h2').should('contain.text', 'Login failed');

  
    cy.eyesCheckWindow('Login Failure');
  });

  it('should look correct (Visual Regression)', () => {
  
    cy.eyesCheckWindow('Login Page');
  });
});

Cypress.eyesClose();
