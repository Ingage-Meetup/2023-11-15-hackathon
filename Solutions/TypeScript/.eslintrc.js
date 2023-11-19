module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'
    ],
  overrides: [],
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2020,
    },
  rules: {
    'prettier/prettier': 'error',
    },
  plugins: ['@typescript-eslint', 'prettier'
    ],
  root: true,
}
