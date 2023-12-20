const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'only-warn'],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-trailing-spaces': ['error'],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      },
    ],
    'no-multi-spaces': ['error'],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: false,
      },
    ],
    'no-var': ['error'],
    'prefer-const': ['error'],
    'space-before-blocks': ['error'],
    'no-mixed-spaces-and-tabs': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'dot-location': ['error', 'property'],
    'arrow-body-style': ['error', 'as-needed'],
    'comma-style': ['error', 'last'],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': [
      'error',
      {
        int32Hint: false,
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.jts',
    'node_modules/',
    'dist/',
  ],
};
