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
    'curly': 'off',
    'no-else-return': 'off',
    'no-unexpected-multiline': 'error',
    'nonblock-statement-body-position': 'off',
    'object-curly-newline': 'off',
    'semi': ['error', 'never', { beforeStatementContinuationChars: 'always' }],
    'wrap-iife': ['error', 'inside'],

    'react/destructuring-assignment': 'off',
    'react/no-multi-comp': 'off',
    'react/prop-types': 'off',

    'jsx-a11y/label-has-associated-control': ['error', { assert: 'both' } ],
    'jsx-a11y/label-has-for': 'off',
  }
};
