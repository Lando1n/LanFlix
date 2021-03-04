// Setup the credentials
let testUsers = {
  default: {},
};

try {
  testUsers = require("./test_users.json");
} catch (e) {
  console.debug(e);
  console.warn("test_users.json does not exist or is improperly formatted");
}
// By default use env vars
testUsers.default.username =
  process.env.LANFLIX_USERNAME || testUsers.default.username;
testUsers.default.password =
  process.env.LANFLIX_PASSWORD || testUsers.default.password;

exports.config = {
  testUsers,
  tests: "./tests/**/*_test.js",
  output: "./output",
  helpers: {
    Playwright: {
      url: "http:/localhost:5000",
      show: !process.env.HEADLESS,
      browser: "chromium",
    },
  },
  include: {
    I: "./steps_file.js",
    loginPage: "./pages/loginPage.js",
    home: "./pages/homePage.js",
  },
  bootstrap: null,
  mocha: {},
  name: "browser-client",
  plugins: {
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
    autoLogin: {
      enabled: true,
      saveToFile: true,
      inject: "loginAs",
      users: {
        default: {
          login: (I) => {
            const { loginPage } = inject();
            I.amOnPage("/");
            I.fillField(loginPage.usernameField, testUsers.default.username);
            I.fillField(
              loginPage.passwordField,
              secret(testUsers.default.password)
            );
            I.click(loginPage.submitButton);
          },
          check: (I) => {
            const { home } = inject();
            I.seeElement(home.banner);
          },
          restore: () => {},
        },
      },
    },
  },
};
