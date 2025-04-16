describe('Add Activity', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[name="email"]').clear().type("test@example.com");
      cy.get('input[name="password"]').clear().type("password123");
      cy.contains('Login').click();
      cy.visit('/add-activity?type=diaper&babyId=someBabyId'); // Replace with real babyId
    });
  
    it('logs a diaper activity', () => {
      cy.get('input[name=time]').type('2025-04-08T10:00');
      cy.get('input[name=contents]').type('wet');
      cy.get('input[name=color]').type('clear');
      cy.contains('Log diaper').click();
    });
  });