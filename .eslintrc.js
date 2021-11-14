module.exports = {
  extends: ["plugin:prettier/recommended"],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  plugins: ["prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    test: true,
    expect: true,
    describe: true,
    process: true,
    Swal: true,
    $: true,
    firebase: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "prettier/prettier": "error",
    "new-cap": "off",
    "require-jsdoc": "off",
    "guard-for-in": "off",
  },
  overrides: [
    {
      files: ["packages/**/*.js"],
    },
  ],
};
