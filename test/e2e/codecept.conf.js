exports.config = {
  users: {
    default: {
      username: process.env.LANFLIX_USERNAME,
      password: process.env.LANFLIX_PASSWORD,
    },
  },
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
  },
};
