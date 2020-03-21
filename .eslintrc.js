module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
  },
  "plugins": ["prettier"],
  'extends': [
    'plugin:prettier/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
    'test': true,
    'expect': true,
    'describe': true,
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    "prettier/prettier": "error",
    'new-cap': 'off',
    'require-jsdoc': 'off',
    'guard-for-in': 'off'
  },
};
