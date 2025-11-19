import { preferBooleanAttributeShorthandRule } from './rules';

export const rules: Record<string, any> = {
  'prefer-boolean-attribute-shorthand': preferBooleanAttributeShorthandRule,
};

export const configs = {
  default: {
    plugins: ['@yoo-digital/eslint-plugin-angular'],
    rules: {
      '@yoo-digital/angular/prefer-boolean-attribute-shorthand': 'warn',
    },
  },
  recommended: {
    plugins: ['@yoo-digital/eslint-plugin-angular'],
    rules: {
      '@yoo-digital/angular/prefer-boolean-attribute-shorthand': 'error',
    },
  },
};

module.exports = {
  rules,
  configs,
};
