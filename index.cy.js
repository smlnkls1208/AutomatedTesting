describe('Тестирование модуля Вакансии на Profteam', () => {
    const baseUrl = 'https://dev.profteam.su';

    const employer = {
        login: 'testerEmployer',
        password: 'Password1',
        email: 'employer@example.com'
    };

    const student = {
        email: 'student@example.com',
        password: 'password123'
    };

    const vacancy = {
        title: 'Frontend Разработчик (Cypress Test)',
        description: 'Опыт работы с React и Cypress. Обязательное знание JS.',
        salary: '100000',
        category: 'Информационные технологии'
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    describe('Авторизация и безопасность', () => {
        it('Негативный тест: Ошибка авторизации с неверным паролем', () => {
            cy.visit(`${baseUrl}/login`, {failOnStatusCode: false });
            cy.get('input[name="login"]', { timeout: 15000 }).should('be.visible').type(employer.login);
            cy.get('input[name="password"]').type('WrongPassword123');
            cy.get('button[type="submit"]').click();
            cy.contains('Неверный логин или пароль', { timeout: 1000 }).should('be.visible');
        });

        it('Валидация пустых полей при входе', () => {
            cy.visit(`${baseUrl}/login`, { failOnStatusCode: false });
            cy.get('button[type="submit"]', { timeout: 1500 }).should('be.visible').click();
            cy.get('input[name="login"]:invalid').should('have.length', 1);
        });
    });

    describe('Создание вакансии работодателем', () => {
        beforeEach(() => {
            cy.visit(`${baseUrl}/login`, {  failOnStatusCode: false });
            cy.get('input[name="login"]', { timeout: 15000 }).should('be.visible').type(employer.login);
            cy.get('input[name="password"]').type(employer.password);
            cy.get('button[type="submit"]').click();
            cy.url().should('not.include', '/login');
        });

        it('Успешное создание вакансии со всеми полями', () => {
            cy.visit(`${baseUrl}/vacancies/create`);
            cy.get('input[name="title"]', { timeout: 1500 }).should('be.visible').type(vacancy.title);
            cy.get('textarea[name="description"]').type(vacancy.description);
            cy.get('input[name="salary"]').type(vacancy.salary);
            cy.get('select[name="category"]').select(vacancy.category);
            cy.get('button#save-vacancy').click();
            cy.url().should('include', '/vacancies');
            cy.contains('Вакансия успешно создана').should('be.visible');
        });

        it('Валидация: Создание вакансии с отрицательной зарплатой', () => {
            cy.visit(`${baseUrl}/vacancies/create`);
            cy.get('input[name="title"]', { timeout: 1500 }).should('be.visible').type('Тест Зарплаты');
            cy.get('input[name="salary"]').type('-500');
            cy.get('button#save-vacancy').click();
            cy.contains('Зарплата не может быть отрицательной').should('be.visible');
        });

        it('Валидация: Короткий заголовок вакансии', () => {
            cy.visit(`${baseUrl}/vacancies/create`);
            cy.get('input[name="title"]', { timeout: 1500 }).should('be.visible').type('IT');
            cy.get('button#save-vacancy').click();
            cy.contains('Заголовок должен содержать минимум 3 символа').should('be.visible');
        });
    });

    describe('Просмотр, поиск и фильтрация', () => {
        beforeEach(() => {
            cy.visit(`${baseUrl}/vacancies`, { timeout: 3000, failOnStatusCode: false });
        });

        it('Поиск вакансии по ключевому слову', () => {
            cy.get('input[placeholder*="Поиск"]', { timeout: 1500 }).should('be.visible').type('Frontend{enter}');
            cy.wait(1000);
            cy.get('.vacancy-card').each(($el) => {
                cy.wrap($el).should('contain.text', 'Frontend');
            });
        });

        it('Фильтрация по категории и типу занятости', () => {
            cy.get('#filter-category', { timeout: 15000 }).should('be.visible').select(vacancy.category);
            cy.get('#filter-employment-type').click();
            cy.get('label').contains('Полная занятость').click();
            cy.get('#apply-filters').click();
            cy.get('.vacancy-card').should('exist');
        });

        it('Отображение сообщения, если ничего не найдено', () => {
            cy.get('input[placeholder*="Поиск"]', { timeout: 1500 }).should('be.visible').type('НесуществующаяВакансия123{enter}');
            cy.contains('По вашему запросу ничего не найдено').should('be.visible');
        });
    });

    describe('Взаимодействие студента с вакансией', () => {
        beforeEach(() => {
            cy.visit(`${baseUrl}/login`, {failOnStatusCode: false });
            cy.get('input[name="email"]', { timeout: 1500 }).should('be.visible').type(student.email);
            cy.get('input[name="password"]').type(student.password);
            cy.get('button[type="submit"]').click();
        });

        it('Успешный отклик на вакансию', () => {
            cy.visit(`${baseUrl}/vacancies`);
            cy.contains(vacancy.title, { timeout: 1500 }).scrollIntoView().click();
            cy.get('button').contains('Откликнуться').should('be.enabled').click();
            cy.get('.notification-success', { timeout: 10000 }).should('be.visible');
            cy.contains('Вы успешно откликнулись').should('exist');
        });

        it('Повторный отклик на ту же вакансию (негативный)', () => {
            cy.visit(`${baseUrl}/vacancies`);
            cy.contains(vacancy.title, { timeout: 15000 }).click();
            cy.get('button').contains('Откликнуться').should('be.disabled');
        });
    });

    describe('Управление откликами и Рабочее пространство', () => {
        beforeEach(() => {
            cy.visit(`${baseUrl}/login`, { failOnStatusCode: false });
            cy.get('input[name="login"]', { timeout: 1500 }).should('be.visible').type(employer.login);
            cy.get('input[name="password"]').type(employer.password);
            cy.get('button[type="submit"]').click();
        });

        it('Подтверждение отклика студента', () => {
            cy.visit(`${baseUrl}/workspace/responses`);
            cy.contains(vacancy.title, { timeout: 1500 }).parents('.response-item').within(() => {
                cy.get('button').contains('Подтвердить').click();
            });
            cy.contains('Отклик подтвержден').should('be.visible');
        });

        it('Смена статуса в рабочем пространстве', () => {
            cy.visit(`${baseUrl}/workspace/active`);
            cy.contains(vacancy.title, { timeout: 1500 }).click();
            cy.get('#change-status-select').select('In Progress');
            cy.get('#save-status').click();
            cy.get('.status-badge').should('contain', 'В работе');
            cy.get('#change-status-select').select('Completed');
            cy.get('#save-status').click();
            cy.get('.status-badge').should('contain', 'Завершено');
        });

        it('Взаимодействие внутри рабочего пространства (чат/комментарии)', () => {
            cy.visit(`${baseUrl}/workspace/active`);
            cy.contains(vacancy.title, { timeout: 1500 }).click();
            const message = 'Привет! Давай обсудим детали задачи.';
            cy.get('textarea[name="comment"]').type(message);
            cy.get('#send-comment').click();
            cy.get('.comments-list').should('contain', message);
        });
    });
});