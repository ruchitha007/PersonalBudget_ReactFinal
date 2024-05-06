// cypress/support/index.js
import '@applitools/eyes-cypress/commands';

const apiKey = 'DbmKGaG104ejWO8mNPLW6tqQzrQEKR3oHaIB33Wmnt6AY110'; // Replace with your Applitools API key
Cypress.eyesOpen = (appName, testName) => {
  cy.eyesOpen({
    appName,
    testName,
  });
};

Cypress.eyesClose = () => {
  cy.eyesClose();
};
