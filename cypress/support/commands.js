// В файле cypress/support/commands.js

Cypress.Commands.add('login', (username, password) => {
    cy.visit('https://dev.profteam.su/login');
    cy.get('input[placeholder="Латинские символы"]')
        .clear()
        .type(username);
    cy.get('input[type="password"]')
        .clear()
        .type(password);
    cy.get('button').contains('Войти').click();
    cy.wait(3000);
    cy.url().should('include', '/account/main');
});

Cypress.Commands.add('loginAs', (role) => {
    const credentials = role === 'student' 
        ? { username: 'testerStudent', password: 'Password1' }
        : { username: 'testerEmployer', password: 'Password1' };
    cy.login(credentials.username, credentials.password);
});