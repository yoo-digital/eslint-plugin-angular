import { preferBooleanAttributeShorthandRule } from './rules';

// Cast to avoid exposing internal option types externally (simplifies consumer typing)
// NOTE: For a scoped plugin named @yoo-digital/eslint-plugin-angular, the rule prefix becomes @yoo-digital/angular
// so consumers will reference: "@yoo-digital/angular/prefer-boolean-attribute-shorthand".
export const rules: Record<string, any> = {
  'prefer-boolean-attribute-shorthand': preferBooleanAttributeShorthandRule,
};

// Using untyped object to avoid strict plugin typing complexity; ESLint will consume via CJS export.
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
