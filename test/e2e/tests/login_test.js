Feature("Login");

Before(({ I }) => {
  I.amOnPage("/");
});

Scenario("Login Page shown without authenticating", ({ I, loginPage }) => {
  I.seeElement(loginPage.rootSelector);
});

Scenario("User is able to enter username", ({ I, loginPage }) => {
  I.click(loginPage.usernameField);
  I.fillField(loginPage.usernameField, "testuser");
  I.seeInField(loginPage.usernameField, "testuser");
});

Scenario("No email throws error", ({ I, loginPage }) => {
  I.click(loginPage.submitButton);
  I.see(
    "Error auth/invalid-email, The email address is badly formatted.",
    loginPage.error
  );
});

Scenario("Invalid email throws error", ({ I, loginPage }) => {
  I.click(loginPage.usernameField);
  I.fillField(loginPage.usernameField, "testuser");
  I.click(loginPage.submitButton);
  I.see(
    "Error auth/invalid-email, The email address is badly formatted.",
    loginPage.error
  );
});

Scenario("No password throws error", ({ I, loginPage }) => {
  I.click(loginPage.usernameField);
  I.fillField(loginPage.usernameField, "testuser@gmail.com");
  I.click(loginPage.submitButton);
  I.see(
    "Error auth/wrong-password, The password is invalid or the user does not have a password.",
    loginPage.error
  );
});
