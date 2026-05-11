describe('Утверждение студента на вакансию', ()=>{
   beforeEach(() => {
       cy.loginAs('employer');
   })
    it('Подтверждение вакансии отклика студента.', ()=>{
        cy.visit('/account/responses');
        cy.get(':nth-child(1) > ' +
            '.responses-list-item__actions > ' +
            ':nth-child(1) > .base-icon > svg')
            .should('be.visible').click();
        cy.wait(2000);
    })
    it('Отказ в подтверждении отклика студента.', () =>{
        cy.visit('/account/responses');
        cy.get(':nth-child(2) > ' +
            '.responses-list-item__actions > ' +
            ':nth-child(2) > .base-icon > svg')
            .should('be.visible').click();
        cy.wait(2000);
    })
});