describe('Поиск вакансии', () =>{
    beforeEach(() => {
        cy.loginAs('student');
    });
    it( 'Поиск вакансии успешный №1', () =>{
        cy.visit('/vacancies');
        cy.get('input[label-text="Поиск"]')
            .should('be.visible')
            .type('sdfsdfsf');
        cy.get('.search-input__button')
            .should('be.visible')
            .click();
        cy.wait(3000);
        cy.get('.vacancy-header__name').should('be.visible').and('not.be.empty')
        cy.contains('button', 'Подробнее')
            .eq(0)
            .should('be.visible')
            .click();
        cy.url().should('match', /\/vacancy\/\d+/)
        cy.log('Поиск без доп параметров успешен.')
        cy.wait(3000);
    });
    it( 'Поиск вакансии успешный №2', () =>{
        cy.visit('/vacancies');
        cy.get('input[label-text="Поиск"]')
            .should('be.visible')
            .type('Разнорабочий');
        cy.get('input[value="По диапазону"]')
            .should('be.visible')
            .check();
        cy.wait(2000)
        cy.get('input[placeholder="0"]')
            .should('be.visible')
            .type('15000')
        cy.get('input[placeholder="100000"]')
            .should('be.visible')
            .type('70000')
        cy.contains('.form-select__selected', 'Любой').click();
        cy.contains('.form-select__option', 'Не полная занятость').click();
        cy.contains('.form-select__selected', 'Любой').click();
        cy.contains('.form-select__option', 'Очный').click();

        cy.get('.search-input__button')
            .should('be.visible')
            .click();
        cy.wait(3000);
        cy.get('.vacancy-header__name').should('be.visible').and('not.be.empty')
        cy.contains('button', 'Подробнее')
            .eq(0)
            .should('be.visible')
            .click();
        cy.url().should('match', /\/vacancy\/\d+/)
        cy.log('Поиск c доп параметрами успешен.')
        cy.wait(3000);
    });
    it( 'Поиск вакансии провальный', () =>{
        cy.visit('/vacancies');
        cy.get('input[label-text="Поиск"]')
            .should('be.visible')
            .type('Разработчик');
        cy.get('input[value="По диапазону"]')
            .should('be.visible')
            .check();
        cy.wait(2000)
        cy.get('input[placeholder="0"]')
            .clear()
            .type('100')
            .trigger('input');
        cy.get('input[placeholder="100000"]')
            .clear()
            .type('200')
            .trigger('input');
        cy.contains('.form-select__selected', 'Любой').click();
        cy.contains('.form-select__option', 'Не полная занятость').click();
        cy.contains('.form-select__selected', 'Любой').click();
        cy.contains('.form-select__option', 'Очный').click();

        cy.get('.search-input__button')
            .should('be.visible')
            .click();
        cy.get('.vacancy-header__name').should('not.exist')
        cy.log('Поиск c доп параметрами провален.')
        cy.wait(3000);
    });
})