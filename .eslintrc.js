module.exports = {
  extends: 'airbnb',
  settings: {
    'import/resolver': 'webpack',
  },
  parser: 'babel-eslint',
  env: {
    browser: true,
    jquery: true,
    webextensions: true,
  },
  rules: {
    'semi': ['error', 'never', { beforeStatementContinuationChars: 'always' }],
    'no-unexpected-multiline': 'error',
    'wrap-iife': ['error', 'inside'],
    'nonblock-statement-body-position': 'off',
    'no-else-return': 'off',
    'curly': 'off',
    'react/prop-types': 'off',
    'react/no-multi-comp': 'off',
    'react/destructuring-assignment': 'off',
  }
};
