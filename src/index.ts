import { preferBooleanAttributeShorthandRule, requireBooleanAttributeTransformRule } from './rules';

export const rules: Record<string, any> = {
  'boolean-attribute-shorthand': preferBooleanAttributeShorthandRule,
  'boolean-input': requireBooleanAttributeTransformRule,
};

export const configs = {
  default: {
    plugins: ['@yoo-digital/eslint-plugin-angular'],
    rules: {
      '@yoo-digital/angular/boolean-attribute-shorthand': 'warn',
      '@yoo-digital/angular/boolean-input': 'warn',
    },
  },
  recommended: {
    plugins: ['@yoo-digital/eslint-plugin-angular'],
    rules: {
      '@yoo-digital/angular/boolean-attribute-shorthand': 'error',
      '@yoo-digital/angular/boolean-input': 'error',
    },
  },
};

module.exports = {
  rules,
  configs,
};
