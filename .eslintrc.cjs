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
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: false }],
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
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['react', 'react-dom'],
            message: 'React imports not allowed in core/** - use plain objects',
            paths: ['src/core/**'],
          },
        ],
      },
    ],
  },
};

