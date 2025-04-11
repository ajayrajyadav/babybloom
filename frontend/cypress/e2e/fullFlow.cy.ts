describe('Full E2E Flow', () => {
    before(() => {
      cy.signupAndLogin();
    });
  
    let babyId: string;
  
    it('adds a baby', () => {
      cy.visit('/babies');
      cy.get('input[name="name"]').type('Test Baby');
      cy.get('input[name="birthdate"]').type('2023-01-01');
      cy.get('button[type="submit"]').click();
  
      cy.contains('Test Baby').should('exist');
  
      cy.contains('Test Baby')
        .parent()
        .invoke('attr', 'data-id')
        .then((id) => {
            if (!id) throw new Error('Baby ID not found');
            babyId = id;
          });
    });
  
    it('adds activity', () => {
      cy.visit(`/add-activity?type=sleep&babyId=${babyId}`);
      cy.get('input[name="startTime"]').should('exist');
      cy.get('textarea[name="notes"]').type('Nap time');
      cy.contains('Log sleep').click();
    });
  });