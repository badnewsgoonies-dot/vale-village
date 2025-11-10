const path = require('node:path');

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, 'tsconfig.json'),
        alwaysTryTypes: true,
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: false }],
    'import/no-unresolved': 'error',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/core',
            from: './src/ui',
            message: 'UI cannot import core directly - use services or hooks',
          },
          {
            target: './src/core',
            from: './src/state',
            except: ['./src/core/services'],
            message: 'State can only import services, not algorithms or models directly',
          },
          {
            target: './src/core/algorithms',
            from: './src/core/services',
            message: 'Services can use algorithms, but algorithms cannot import services',
          },
        ],
      },
    ],
    // React restriction in core/** is enforced via code review and manual checks
    // The import/no-restricted-paths rule above handles path-based restrictions
  },
};

