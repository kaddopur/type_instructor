import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**', 'tests/e2e/fixtures/**'] },
  {
    files: ['**/*.{js,jsx,mjs,ts,tsx}'],
    ...js.configs.recommended,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } }
    }
  },
  ...tseslint.configs.recommended.map(config => ({ ...config, files: ['**/*.{ts,tsx}'] })),
  { files: ['src/**/*.{js,jsx,ts,tsx}'], languageOptions: { globals: globals.browser } },
  { files: ['*.js', 'scripts/**/*.{js,mjs}', 'tests/**/*.{js,mjs}'], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['public/**/*.js'], languageOptions: { globals: globals.serviceworker } },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: { 'react-hooks': hooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error'
    }
  }
];
