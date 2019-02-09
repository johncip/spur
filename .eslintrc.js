module.exports = {
  extends: 'airbnb',
  settings: {
    'import/resolver': 'webpack',
  },
  env: {
    browser: true,
    jquery: true,
    webextensions: true,
  },
  parser: 'babel-eslint',
};
