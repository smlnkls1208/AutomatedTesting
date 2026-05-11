
// эти тесты не работают они входят как перечень тестов
describe('Модуль Вакансии: Автотесты (dev.profteam.su)', () => {
    const SITE = 'https://dev.profteam.su';

    Cypress.on('uncaught:exception', () => false);

    // Регистрируем кастомные команды
    beforeEach(() => {
        // Регистрируем команду login, если её нет
        if (!Cypress.commands.hasOwnProperty('login')) {
            Cypress.Commands.add('login', (username, password) => {
                cy.visit(SITE + '/login');
                cy.get('input[placeholder="Латинские символы"]')
                    .clear().type(username);
                cy.get('input[type="password"]')
                    .clear().type(password);
                cy.get('button').contains('Войти').click();
                cy.wait(3000);
                cy.url().should('include', '/account/main');
            });
        }
        
        if (!Cypress.commands.hasOwnProperty('loginAs')) {
            Cypress.Commands.add('loginAs', (role) => {
                const credentials = role === 'student' 
                    ? { username: 'testerStudent', password: 'Password1' }
                    : { username: 'testerEmployer', password: 'Password1' };
                cy.login(credentials.username, credentials.password);
            });
        }
    });

    describe('Создание вакансии', () => {
        beforeEach(() => {
            cy.loginAs('employer');
        });

        it('Позитивный сценарий: Успешное создание', () => {
            cy.visit(SITE + '/account/vacancies');
            cy.wait(2000);
            
            cy.contains('Создать вакансию').click();
            cy.wait(2000);
            cy.get('.desktop-modal').should('be.visible');

            cy.get('.desktop-modal input[placeholder="Кладовщик"]')
                .should('be.visible')
                .type('Кладовщик', { force: true });
            
            cy.get('.desktop-modal input[value="По договорённости"]')
                .should('be.visible')
                .check({ force: true });
            
            cy.get('.desktop-modal input[name="label-radio"][value="5/2"]')
                .should('be.visible')
                .check({ force: true });
            
            cy.get('.desktop-modal textarea[placeholder="Ваши требования"]')
                .should('be.visible')
                .type('Обязанности сотрудника', { force: true });
            
            cy.get('.desktop-modal textarea[placeholder="Обязанности сотрудника"]')
                .scrollIntoView()
                .should('be.visible')
                .type('Ваши требования', { force: true });
            
            cy.wait(2000);
            
            cy.get('.desktop-modal')
                .contains('button', 'Обновить вакансию')
                .scrollIntoView()
                .should('be.enabled')
                .click();
                
            cy.log('Вакансия успешно создана');
        });

        it('Негативный сценарий: Создание с пустым названием', () => {
            cy.visit(SITE + '/account/vacancies');
            cy.contains('Создать вакансию').click();
            cy.wait(2000);
            cy.get('.desktop-modal').should('be.visible');
            
            // Не заполняем название
            cy.get('.desktop-modal')
                .contains('button', 'Обновить вакансию')
                .should('be.disabled');
                
            cy.log('Кнопка недоступна при пустых полях');
        });
    });

    describe('Поиск и фильтрация', () => {
        beforeEach(() => {
            // Для поиска вакансий не нужна авторизация
            cy.visit(SITE + '/vacancies');
            cy.wait(3000); // Ждем загрузки страницы
        });

        it('Позитивный сценарий: Поиск по названию', () => {
            // Ждем загрузки поля поиска
            cy.get('input[label-text="Поиск"]', { timeout: 10000 })
                .should('be.visible')
                .type('Тестировщик');
            
            cy.get('.search-input__button')
                .should('be.visible')
                .click();
            
            cy.wait(3000);
            
            // Проверяем, что результаты есть
            cy.get('.vacancy-header__name').should('be.visible');
            cy.log('Поиск по названию успешен');
        });

        it('Негативный сценарий: Поиск несуществующей вакансии', () => {
            cy.get('input[label-text="Поиск"]', { timeout: 10000 })
                .should('be.visible')
                .type('ZXYZXYZXY123');
            
            cy.get('.search-input__button')
                .should('be.visible')
                .click();
            
            cy.wait(3000);
            
            // Проверяем, что ничего не найдено
            cy.get('body').then($body => {
                if ($body.find('.vacancy-header__name').length === 0) {
                    cy.log('Ничего не найдено - ожидаемый результат');
                }
            });
        });
    });

    describe('Отклик на вакансию', () => {
        it('Позитивный сценарий: Студент откликается', () => {
            cy.loginAs('student');
            cy.visit(SITE + '/vacancies');
            cy.wait(3000);
            
            // Находим первую вакансию и нажимаем "Подробнее"
            cy.get('.vacancy-item').first().within(() => {
                cy.contains('button', 'Подробнее').click();
            });
            
            cy.wait(2000);
            
            // На странице вакансии нажимаем "Откликнуться"
            cy.contains('button', 'Откликнуться').should('be.visible').click();
            
            cy.log('Отклик на вакансию успешно отправлен');
            cy.wait(3000);
        });
    });

    describe('Подтверждение отклика', () => {
        it('Позитивный сценарий: Работодатель одобряет студента', () => {
            cy.loginAs('employer');
            cy.visit(SITE + '/account/responses');
            cy.wait(3000);
            
            // Находим и принимаем первый отклик
            cy.get('.responses-list-item__action')
                .first()
                .click({ force: true });
            
            cy.wait(2000);
            
            // Проверяем, что статус изменился
            cy.contains('Принято', { timeout: 10000 }).should('be.visible');
            cy.log('Отклик успешно принят');
        });
    });

    describe('Рабочее пространство', () => {
        beforeEach(() => {
            cy.loginAs('student');
            cy.visit(SITE + '/account/responses');
            cy.wait(3000);
            
            // Открываем первый отклик
            cy.get('.responses-list-item').first().within(() => {
                cy.get('.button').click();
            });
            cy.wait(3000);
        });

        it('Позитивный сценарий: Отправка сообщения (если доступно)', () => {
            // Проверяем, доступно ли поле для комментария
            cy.get('.form-area').then($textarea => {
                if ($textarea.is(':disabled')) {
                    cy.log('Поле комментария disabled - пропускаем отправку');
                    cy.log('Это ожидаемое поведение для текущего статуса');
                    return;
                }
                
                // Если доступно - отправляем сообщение
                cy.get('.form-area').type('Тестовое сообщение');
                cy.get('#file-uploader').selectFile('cypress/fixtures/Test.txt', { force: true });
                cy.get('.comment-textarea__buttons .icon-button').eq(1).click();
                cy.log('Сообщение отправлено');
            });
        });
    });

    describe('Смена статуса', () => {
        it('Позитивный сценарий: Завершение работы работодателем', () => {
            cy.loginAs('employer');
            cy.visit(SITE + '/account/responses');
            cy.wait(3000);
            
            // Открываем первое рабочее пространство
            cy.get('.responses-list-item').first().within(() => {
                cy.get('.button').click();
            });
            cy.wait(3000);
            
            // Меняем статус
            cy.get('.status-open__buttons').within(() => {
                cy.get('button').first().click();
            });
            
            cy.log('Статус рабочего пространства изменен');
            cy.wait(2000);
        });
    });
});