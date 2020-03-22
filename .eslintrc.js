module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
  },
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
    'new-cap': 'off',
    'require-jsdoc': 'off',
    'guard-for-in': 'off'
  },
};
