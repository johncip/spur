module.exports = {
  extends: 'airbnb',
  settings: {
    'import/resolver': 'webpack'
  },
  parser: 'babel-eslint',
  env: {
    browser: true,
    jquery: true,
    webextensions: true
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'curly': 'off',
    'no-else-return': 'off',
    'no-unexpected-multiline': 'error',
    'no-underscore-dangle': 'off',
    'nonblock-statement-body-position': 'off',
    'prefer-template': 'off',
    'object-curly-newline': 'off',
    'semi': ['error', 'never', { beforeStatementContinuationChars: 'always' }],
    'wrap-iife': ['error', 'inside'],

    'react/destructuring-assignment': 'off',
    'react/no-multi-comp': 'off',
    'react/no-render-return-value': 'off',
    'react/no-unused-state': 'off',
    'react/prop-types': 'off',

    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'jsx-a11y/label-has-for': 'off'
  }
}
