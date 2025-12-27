import { preferBooleanAttributeShorthandRule, requireBooleanAttributeTransformRule } from './rules';

export const rules: Record<string, any> = {
  'boolean-attribute-html': preferBooleanAttributeShorthandRule,
  'boolean-attribute-ts': requireBooleanAttributeTransformRule,
};

export const configs = {
  default: {
    plugins: ['@yoo-digital/eslint-plugin-angular'],
    rules: {
      '@yoo-digital/angular/boolean-attribute-html': 'warn',
      '@yoo-digital/angular/boolean-attribute-ts': 'warn',
    },
  },
  recommended: {
    plugins: ['@yoo-digital/eslint-plugin-angular'],
    rules: {
      '@yoo-digital/angular/boolean-attribute-html': 'error',
      '@yoo-digital/angular/boolean-attribute-ts': 'error',
    },
  },
};

module.exports = {
  rules,
  configs,
};
