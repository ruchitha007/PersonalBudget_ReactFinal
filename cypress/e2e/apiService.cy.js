/// <reference types="cypress" />
import 'cypress-eyes';

describe('apiService', () => {
  // E2E: Test fetching data from the API
  it('should fetch data from the API using apiService.get', () => {
    cy.intercept('GET', 'http://localhost:5000/api/**').as('apiRequest');
    cy.window().then((win) => {
      const token = 'your-test-token'; 
      return win.apiService.get('/testEndpoint', token);
    });


    cy.wait('@apiRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  // Visual Regression: Test for matching the apiService snapshot
  it('should match the apiService snapshot', () => {
   
    cy.eyesOpen({
      appName: 'financeapplication', 
      testName: 'apiService Snapshot',
    });

    cy.window().then((win) => {
      const token = 'your-test-token'; 
      return win.apiService.get('/testEndpoint', token);
    });
    cy.eyesCheckWindow('apiService Snapshot');

    
    cy.eyesClose();
  });
});
