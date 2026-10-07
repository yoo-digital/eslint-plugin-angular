import type { Linter } from 'eslint';
import { preferBooleanAttributeShorthandRule, requireBooleanAttributeTransformRule } from './rules';

// Resolved at runtime from the package root (dist/../package.json), so the version is never out of sync.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { name, version } = require('../package.json') as { name: string; version: string };

/**
 * Namespace under which the rules are exposed by the bundled configs.
 * Register the plugin under the same key in your eslint.config so rule ids match:
 * `@yoo-digital/eslint-plugin-angular/<rule-name>`.
 */
export const PLUGIN_NAMESPACE = '@yoo-digital/eslint-plugin-angular';

export const meta = {
  name,
  version,
  namespace: PLUGIN_NAMESPACE,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rules: Record<string, any> = {
  'boolean-attribute-shorthand': preferBooleanAttributeShorthandRule,
  'boolean-input': requireBooleanAttributeTransformRule,
};

type Severity = Extract<Linter.RuleSeverity, 'warn' | 'error'>;

/**
 * Flat configs (ESLint >= 9). The legacy eslintrc format has been removed in ESLint 10.
 * - `boolean-input` runs on TypeScript files.
 * - `boolean-attribute-shorthand` runs on Angular HTML templates and requires
 *   `@angular-eslint/template-parser` to be configured as parser for those files
 *   (e.g. via `angular.configs.templateRecommended`).
 */
export const configs: Record<'default' | 'recommended', Linter.Config[]> = {
  default: [],
  recommended: [],
};

const plugin = {
  meta,
  rules,
  configs,
};

function createConfig(configName: string, severity: Severity): Linter.Config[] {
  return [
    {
      name: `${PLUGIN_NAMESPACE}/${configName}/ts`,
      files: ['**/*.ts'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins: { [PLUGIN_NAMESPACE]: plugin as any },
      rules: {
        [`${PLUGIN_NAMESPACE}/boolean-input`]: severity,
      },
    },
    {
      name: `${PLUGIN_NAMESPACE}/${configName}/html`,
      files: ['**/*.html'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins: { [PLUGIN_NAMESPACE]: plugin as any },
      rules: {
        [`${PLUGIN_NAMESPACE}/boolean-attribute-shorthand`]: severity,
      },
    },
  ];
}

configs.default.push(...createConfig('default', 'warn'));
configs.recommended.push(...createConfig('recommended', 'error'));

module.exports = plugin;
