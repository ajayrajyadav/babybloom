describe('Dashboard', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[name="email"]').clear().type("test@example.com");
      cy.get('input[name="password"]').clear().type("password123");
      cy.contains('Login').click();
      cy.url().should('include', '/dashboard');
    });
  
    it('should display baby cards and stats', () => {
      cy.contains('Your Babies').should('exist');
      cy.get('[data-testid="baby-card"]').should('exist'); // update this selector if needed
    });
  });