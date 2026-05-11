describe('Управление откликами', () => {
    const SITE = 'https://dev.profteam.su';

    Cypress.on('uncaught:exception', () => false);

    function loginEmployer() {
        cy.visit(SITE + '/login');
        cy.get('input[placeholder="Латинские символы"]', { timeout: 10000 })
            .clear().type('testerEmployer');
        cy.get('input[type="password"]').clear().type('Password1');
        cy.get('button').contains('Войти').click();
        cy.wait(3000);
    }

    it('Принять отклик', () => {
        loginEmployer();
        cy.visit(SITE + '/account/main');
        cy.wait(2000);
        cy.contains('Отклики').click();
        cy.wait(3000);

        cy.get('.responses-list-item__action')
            .first()
            .click({ force: true });
        cy.wait(2000);

        // Проверяем что статус изменился
        cy.contains('Принято', { timeout: 10000 }).should('be.visible');
    });

    it('Отклонить отклик', () => {
        loginEmployer();
        cy.visit(SITE + '/account/main');
        cy.wait(2000);
        cy.contains('Отклики').click();
        cy.wait(3000);

        cy.get('.responses-list-item__action')
            .eq(1)
            .click({ force: true });
        cy.wait(2000);

        // Проверяем что статус изменился
        cy.contains('Отклонено', { timeout: 10000 }).should('be.visible');
    });
});