describe('Babies Page', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[name="email"]').clear().type("test@example.com");
      cy.get('input[name="password"]').clear().type("password123");
      cy.contains('Login').click();
      cy.url().should('include', '/dashboard');
      cy.visit('/babies');
    });
  
    it('should display the babies list', () => {
      cy.contains('Your Babies').should('exist');
    });
  
    it('should allow adding a baby', () => {
      cy.contains('Add Baby').click();
      cy.get('input[name=name]').type('Test Baby');
      cy.get('input[name=birthdate]').type('2023-04-01');
      cy.contains('Save').click();
      cy.contains('Test Baby').should('exist');
    });
  });