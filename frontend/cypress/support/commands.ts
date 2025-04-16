Cypress.Commands.add('signupAndLogin', () => {
    const email = `testuser+${Date.now()}@example.com`;
    const password = 'password123';
  
    cy.session([email, password], () => {
      cy.visit('/signup');
      cy.get('input[placeholder="Email"]').clear().type(email);
      cy.get('input[placeholder="Password"]').clear().type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });
  });