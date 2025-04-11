describe("Login Flow", () => {
    it("navigates from splash and logs in", () => {
      cy.visit("/"); // Start from the splash page
  
      // Wait for the splash screen and click the login button
      cy.contains("Login").click();
  
      // Now we're on /login — wait for the form
      cy.get("form").should("exist");
  
      // Fill out login form
      cy.get('input[name="email"]').clear().type("test@example.com");
      cy.get('input[name="password"]').clear().type("password123");
      cy.contains("Login").click();
  
      // Optionally check if redirected to dashboard
      cy.url().should("include", "/dashboard");
    });
  });