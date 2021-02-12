Feature("Login");

Before(({ I }) => {
  I.amOnPage("/");
});

Scenario("Login Page shown without authenticating", ({ I }) => {
  I.seeElement("#login-modal");
});

Scenario("User is able to enter username", ({ I }) => {
  I.click("#username-input");
  I.fillField("#username-input", "testuser");
  I.seeInField("#username-input", "testuser");
});

Scenario("No email throws error", ({ I }) => {
  I.click("#login-submit-btn");
  I.see(
    "Error auth/invalid-email, The email address is badly formatted.",
    "#login-error"
  );
});

Scenario("Invalid email throws error", ({ I }) => {
  I.click("#username-input");
  I.fillField("#username-input", "testuser");
  I.click("#login-submit-btn");
  I.see(
    "Error auth/invalid-email, The email address is badly formatted.",
    "#login-error"
  );
});

Scenario("No password throws error", ({ I }) => {
  I.click("#username-input");
  I.fillField("#username-input", "testuser@gmail.com");
  I.click("#login-submit-btn");
  I.see(
    "Error auth/wrong-password, The password is invalid or the user does not have a password.",
    "#login-error"
  );
});
