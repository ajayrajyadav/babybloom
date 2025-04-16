describe("Sign Up Flow", () => {
    it("signs up a new user and lands on dashboard", () => {
      const email = `testuser+${Date.now()}@example.com`; // ✅ unique each run
      const password = "password123";
  
      cy.visit("/");
  
      cy.contains("Sign Up").click(); // ⬅️ adapt based on your splash page
      cy.url().should("include", "/signup");
  
      cy.get('input[type="email"]').clear().type(email);
      cy.get('input[type="password"]').clear().type(password);
      cy.get("button[type=submit]").click();
  
      cy.url({ timeout: 10000 }).should("include", "/dashboard");
      cy.contains("Welcome").should("exist"); // or any dashboard-specific check
    });
  });