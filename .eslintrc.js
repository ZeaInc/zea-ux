module.exports = {
  extends: 'airbnb',
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': [
      'error',
      {
        arrays: 'ignore',
        functions: 'never',
        imports: 'ignore',
        objects: 'ignore',
      },
    ],
    'function-paren-newline': ['error', 'consistent'],
    'object-curly-newline': ['error', { consistent: true }],
  },
};
