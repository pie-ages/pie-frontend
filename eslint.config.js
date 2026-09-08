// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Imports não utilizados viram erro e são corrigidos automaticamente com --fix
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Boas práticas gerais
      eqeqeq: ['warn', 'smart'],
      curly: ['warn', 'multi-line'],
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-duplicate-imports': 'error',
      'object-shorthand': 'warn',

      // Ordena os imports de forma consistente
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Hooks do React
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Precisa ser o último item: desliga regras de estilo do ESLint que conflitam com o Prettier
  prettierConfig,
  {
    ignores: ['dist/*'],
  },
]);
