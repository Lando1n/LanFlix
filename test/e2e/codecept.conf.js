exports.config = {
  tests: "./tests/**/*_test.js",
  output: "./output",
  helpers: {
    Playwright: {
      url: "http:/localhost:5000",
      show: false,
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
