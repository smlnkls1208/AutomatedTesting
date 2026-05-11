describe('Создание вакансии', () => {
    beforeEach(() => {
        cy.loginAs('employer');
    });

    it('Успешное создание вакансии', () => {
        cy.visit('/account/vacancies');

        cy.contains('Создать вакансию').click();
        cy.wait(2000);
        cy.get('.desktop-modal').should('be.visible')

        cy.get('.desktop-modal input[placeholder="Кладовщик"]')
            .should('be.visible')
            .type('Cypress Test Vacancy', { force: true });
        cy.get('.desktop-modal input[value="По договорённости"]')
            .should('be.visible')
            .check({ force: true });
        cy.get('.desktop-modal input[name="label-radio"][value="5/2"]')
            .should('be.visible')
            .check({ force: true });
        cy.get('.desktop-modal textarea[placeholder="Ваши требования"]')
            .should('be.visible')
            .type('Требуется тестировщик-автоматизатор', { force: true });
        cy.get('.desktop-modal textarea[placeholder="Обязанности сотрудника"]')
            .scrollIntoView()
            .should('be.visible')
            .type('Cypress, JS', { force: true })
        cy.wait(2000);

        cy.contains('Обновить вакансию').should('be.enabled').click();
        cy.get('.desktop-modal')
            .contains('button', 'Обновить вакансию')
            .scrollIntoView()
            .should('be.enabled')
            .click();

    });
    it('Провальное создание вакансии', () =>{
        cy.visit('/account/vacancies');
        cy.contains('Создать вакансию').click();
        cy.wait(2000);
        cy.get('.desktop-modal').should('be.visible')

        cy.get('.desktop-modal')
            .contains('button', 'Обновить вакансию')
            .scrollIntoView()
            .should('be.disabled')
        console.log("Кнопка не доступна для активации при не заполненных полях формы.");
    })
});