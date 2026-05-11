describe('Выбор статуса в рабочем пространстве', () => {

    beforeEach(() => {
        cy.loginAs('employer');
    });

    describe('Работа с откликами', () => {
        beforeEach(() => {
            cy.visit('/account/responses');
            // Ждем появления хотя бы одного элемента навигации
            cy.get('.navigation-item', {timeout: 10000}).should('be.visible');
        });

        it('Переход на вкладку "На рассмотрении"', () => {
            // Кликаем прямо по тексту, игнорируя возможные невидимые слои сверху
            cy.contains('.navigation-item', 'На рассмотрении').click({force: true});


        });
        it('Смена статуса отклика на "Одобрено"', () => {
            //класс button__background-color-green
            cy.contains('.navigation-item', 'Одобрены').click({force: true});

        });
    });

    describe('Управление вакансиями', () => {
        beforeEach(() => {
            cy.visit('/account/vacancies');
            cy.wait(2000);
        });

        it('Установка фильтра на "Черновик"', () => {
            cy.contains('.form-select__label:visible', 'Статус')
                .closest('.form-select')
                .within(() => {
                    // 2. Кликаем по полю.
                    cy.get('.form-select__selected')
                        .click({force: true})
                        .should('have.class', 'form-select__selected--open');

                    // Внутри .within() ищем именно видимый блок со списком
                    cy.get('.form-select__items:visible')
                        .should('be.visible')
                        .contains('.form-select__option', /Черновик/i) // Используем регулярку для надежности
                        .click({force: true});
                });


            // Проверяем, что теперь в выбранном значении текст "Черновик"
            cy.contains('.form-select__label:visible', 'Статус')
                .closest('.form-select')
                .find('.form-select__selected')
                .should('contain', 'Черновик')
                .and('not.have.class', 'form-select__selected--open');
        });
        it('Публикация вакансии из статуса "Черновик"', () => {
            // Сначала ПРИНУДИТЕЛЬНО ставим фильтр, чтобы черновики точно появились в DOM
            cy.contains('.form-select__label:visible', 'Статус')
                .closest('.form-select') // Поднимаемся к общему контейнеру селекта
                .within(() => {
                    // Cypress будет ждать появления этого класса до 4 секунд (по умолчанию)
                    cy.get('.form-select__selected')
                        .click({force: true})
                        .should('have.class', 'form-select__selected--open');

                    // Внутри .within() ищем именно видимый блок со списком
                    cy.get('.form-select__items:visible')
                        .should('be.visible')
                        .contains('.form-select__option', /Черновик/i)
                        .click({force: true});
                });
            // Теперь, когда в списке ТОЛЬКО черновики, кликаем по первому
            cy.get('.vacancy-item')
                .first()
                .within(() => {
                    cy.contains('button', 'Опубликовать').click({force: true});
                });

            // Ждем, пока статус сменится на "Активна"
            cy.contains('Активна', {timeout: 10000}).should('be.visible');
        });
    });
});