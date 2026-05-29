import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslint from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['app/**', 'dist/**', '**/dist/**', 'node_modules/**', '**/node_modules/**', 'public/**', '**/public/**', '.tmp-*/**'],
  },
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
];
