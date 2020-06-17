exports.config = {
  tests: "./tests/**/*_test.js",
  output: "./output",
  helpers: {
    Puppeteer: {
      url: "http:/localhost:5000",
      show: true,
      windowSize: "1200x900",
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
