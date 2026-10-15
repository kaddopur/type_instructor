import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**', 'tests/fixtures/**'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    ...js.configs.recommended,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } }
    }
  },
  { files: ['src/**/*.{js,jsx}'], languageOptions: { globals: globals.browser } },
  { files: ['*.js', 'scripts/**/*.js', 'tests/**/*.{js,mjs}'], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['public/**/*.js'], languageOptions: { globals: globals.serviceworker } },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': hooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error'
    }
  }
];
