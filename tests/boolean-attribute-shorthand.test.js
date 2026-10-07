const assert = require('node:assert');
const { describe, it, test } = require('node:test');
const { RuleTester, Linter } = require('eslint');

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
const templateParser = require('@angular-eslint/template-parser');
const plugin = require('../dist');

const rule = plugin.rules['boolean-attribute-shorthand'];

const ruleTester = new RuleTester({
  languageOptions: { parser: templateParser },
});

ruleTester.run('boolean-attribute-shorthand', rule, {
  valid: [
    '<comp disabled />',
    '<comp [disabled]="false" />',
    '<comp [disabled]="isDisabled" />',
    '<comp [disabled]="2 + 2 === 4" />',
    `<comp [disabled]="'true'" />`,
    '<comp disabled="true" />',
    '<comp (click)="toggle(true)" />',
    '@if (true) { <comp /> }',
  ],
  invalid: [
    {
      code: '<comp [disabled]="true" />',
      output: '<comp disabled />',
      errors: [{ messageId: 'preferTrue', data: { attr: 'disabled' }, line: 1, column: 7, endLine: 1, endColumn: 24 }],
    },
    {
      code: '<comp [disabled]="true" [readonly]="true"></comp>',
      output: '<comp disabled readonly></comp>',
      errors: [{ messageId: 'preferTrue', data: { attr: 'disabled' } }, { messageId: 'preferTrue', data: { attr: 'readonly' } }],
    },
    {
      code: '<div>\n  <comp\n    [isVegan]="true"\n  />\n</div>',
      output: '<div>\n  <comp\n    isVegan\n  />\n</div>',
      errors: [{ messageId: 'preferTrue', line: 3, column: 5, endLine: 3, endColumn: 21 }],
    },
    {
      code: '@if (cond) { <comp [disabled]="true" /> }',
      output: '@if (cond) { <comp disabled /> }',
      errors: [{ messageId: 'preferTrue' }],
    },
  ],
});

test('boolean-attribute-shorthand throws a clear error without the template parser', () => {
  const linter = new Linter();
  assert.throws(
    () =>
      linter.verify('const a = 1;', {
        plugins: { yoo: plugin },
        rules: { 'yoo/boolean-attribute-shorthand': 'error' },
      }),
    /@angular-eslint\/template-parser/,
  );
});
