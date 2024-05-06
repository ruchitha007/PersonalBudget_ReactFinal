/// <reference types="cypress" />
import 'cypress-eyes';

describe('authService', () => {
  // E2E: Test user signup
  it('should sign up a new user using authService.signup', () => {
    cy.intercept('POST', 'http://localhost:5000/api/auth/register').as('signupRequest');
    cy.window().then((win) => {
      return win.authService.signup('testUser', 'testPassword', 'Test User');
    });
    cy.wait('@signupRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it('should log in a user using authService.login', () => {
    cy.intercept('POST', 'http://localhost:5000/api/auth/login').as('loginRequest');

    cy.window().then((win) => {
      return win.authService.login('testUser', 'testPassword');
    });

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });


  
  // Visual Regression: Test for matching the authService snapshot
  it('should match the authService snapshot', () => {
   
    cy.eyesOpen({
      appName: 'finanaceapplication', 
      testName: 'authService Snapshot',
    });

    cy.window().then((win) => {
      return win.authService.login('testUser', 'testPassword');
    });

    cy.eyesCheckWindow('authService Snapshot');   
    cy.eyesClose();
  });
  it('should make an authenticated request using authService.makeAuthenticatedRequest', () => { 
    cy.intercept('GET', 'http://localhost:5000/api/testEndpoint').as('authenticatedRequest');
    cy.window().then((win) => {
      return win.authService.makeAuthenticatedRequest('http://localhost:5000/api/testEndpoint');
    });


    cy.wait('@authenticatedRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });
});
