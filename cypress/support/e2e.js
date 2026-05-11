// Подключаем кастомные команды
import './commands';

// Игнорируем ошибки Vue
Cypress.on('uncaught:exception', () => false);