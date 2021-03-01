exports.config = {
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
    showsPage: "./pages/showsPage.js",
    moviesPage: "./pages/moviesPage.js",
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
      inject: 'loginAs',
      users: {
        default: {
          login: (I) => {
            const { loginPage }= inject();
            I.amOnPage("/");
            I.fillField(loginPage.usernameField, process.env.LANFLIX_USERNAME);
            I.fillField(loginPage.passwordField, secret(process.env.LANFLIX_PASSWORD));
            I.click(loginPage.submitButton);
          }, 
          check: (I) => {
            const { showsPage }= inject();
            I.seeElement(showsPage.banner);
          },
        },
      },
    }
  },
};
