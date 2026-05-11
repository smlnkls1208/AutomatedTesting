describe('Тестирование работы рабочих пространств в системе', () => {

    it('Тестирование рабочего пространства со стороны студента', () => {
        cy.loginAs('student');
        cy.visit('/account/responses');

        cy.url().should('include', '/account/responses');

        cy.get(':nth-child(3) > .navigation-item__title').click();
        cy.wait(2000);
        // Открываем рабочие пространство
            cy.get('.infinite-loader > :nth-child(1) > .button').click();
            cy.wait(2000);

            cy.get('.form-area').should('exist');
            cy.get('.form-area').should('be.disabled');
            cy.log('Поле комментария disabled - комментирование недоступно');


        cy.get('body').then($body => {
            const hasResponses = $body.find('.responses-list-item').length > 0;

            if (!hasResponses) {
                cy.log('У студента нет откликов - тест завершается');
                cy.log(' Ожидаемое поведение при отсутствии откликов');
                return;
            }

            cy.get(':nth-child(1) > .responses-list-item__content-company > .button').click();
            cy.wait(2000);

            cy.get('.form-area').should('exist');
            cy.get('.form-area').should('be.disabled');
            cy.log('Поле комментария disabled - комментирование недоступно');
            cy.contains('.detailed-workspace-activity-comments__action', 'Ответить')
                .should('be.visible')
                .click();
            cy.log('Нажата кнопка Ответить');

            // Нажимаем кнопку "Копировать"
            cy.contains('.detailed-workspace-activity-comments__action', 'Копировать')
                .should('be.visible')
                .click();
            cy.log('Нажата кнопка Копировать');
            cy.get('.form-area').should('have.attr', 'placeholder', 'Напишите комментарий...');

            // Проверяем, что кнопка отправки тоже disabled или отсутствует
            cy.get('.comment-textarea__buttons .icon-button').eq(1).should('be.disabled');

            cy.log('Тест пройден: комментарии заблокированы для студента');
        });
    });

    it('Тестирование рабочего пространства со стороны работодателя', () => {
        cy.loginAs('employer');
        cy.visit('/account/responses');

        // Проверяем, что загрузилась страница
        cy.url().should('include', '/account/responses');

        // Кликаем на "Отклики"
        cy.get(':nth-child(3) > .navigation-item__title').click();
        cy.wait(2000);

        // Проверяем наличие откликов
        cy.get('body').then($body => {
            const hasResponses = $body.find('.responses-list-item').length > 0;

            if (!hasResponses) {
                cy.log('У работодателя нет откликов - тест завершается');
                cy.log('Ожидаемое поведение при отсутствии откликов');
                return;
            }

            // Открываем рабочие пространство
            cy.get('.infinite-loader > :nth-child(1) > .button').click();
            cy.wait(2000);

            cy.get('.form-area').should('exist');
            cy.get('.form-area').should('be.disabled');
            cy.log('Поле комментария disabled - комментирование недоступно');

            // Проверяем атрибут disabled
            cy.get('.form-area').should('have.attr', 'disabled');

            // Проверяем, что нельзя ввести текст
            cy.get('.form-area').then($textarea => {
                expect($textarea.is(':disabled')).to.be.true;
                cy.log('Поле действительно заблокировано');
            });

            cy.log('Тест пройден: комментарии заблокированы для работодателя');
        });
    });
});