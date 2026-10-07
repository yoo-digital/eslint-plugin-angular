const { describe, it } = require('node:test');
const { RuleTester } = require('eslint');

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
const tsParser = require('@typescript-eslint/parser');
const { rules } = require('../dist');

const ruleTester = new RuleTester({
  languageOptions: { parser: tsParser },
});

ruleTester.run('boolean-input', rules['boolean-input'], {
  valid: [
    // @Input() decorator already using booleanAttribute
    'class A { @Input({ transform: booleanAttribute }) foo: boolean = false; }',
    'class A { @Input({ alias: "bar", transform: booleanAttribute }) foo: boolean = true; }',
    // Non boolean @Input()
    'class A { @Input() foo: string = ""; }',
    'class A { @Input() foo?: number; }',
    // @Input() without type annotation is ignored
    'class A { @Input() foo = false; }',
    // input() signal already configured
    'class A { foo = input<boolean, BooleanInput>(false, { transform: booleanAttribute }); }',
    'class A { foo = input<boolean, BooleanInput>(true, { alias: "bar", transform: booleanAttribute }); }',
    // Non boolean input() signal
    'class A { foo = input<string>(""); }',
    // input() without type argument is ignored
    'class A { foo = input(false); }',
    // Other call expressions are ignored
    'class A { foo = signal<boolean>(false); }',
    // Standalone variable declarator already configured
    'const foo = input<boolean, BooleanInput>(false, { transform: booleanAttribute });',
    'const foo = input<string>("");',
  ],
  invalid: [
    {
      code: 'class A { @Input() foo: boolean = false; }',
      output: 'class A { @Input({ transform: booleanAttribute }) foo: boolean = false; }',
      errors: [{ messageId: 'requireTransformDecorator', data: { name: 'foo' } }],
    },
    {
      code: 'class A { @Input() foo?: boolean; }',
      output: 'class A { @Input({ transform: booleanAttribute }) foo?: boolean; }',
      errors: [{ messageId: 'requireTransformDecorator' }],
    },
    {
      code: "class A { @Input({ alias: 'bar' }) foo: boolean = true; }",
      output: "class A { @Input({ alias: 'bar', transform: booleanAttribute }) foo: boolean = true; }",
      errors: [{ messageId: 'requireTransformDecorator' }],
    },
    {
      code: 'class A { @Input({}) foo: boolean = true; }',
      output: 'class A { @Input({ transform: booleanAttribute }) foo: boolean = true; }',
      errors: [{ messageId: 'requireTransformDecorator' }],
    },
    {
      code: "class A { @Input('bar') foo: boolean = true; }",
      output: "class A { @Input({ alias: 'bar', transform: booleanAttribute }) foo: boolean = true; }",
      errors: [{ messageId: 'requireTransformDecorator' }],
    },
    {
      // transform present but not booleanAttribute
      code: 'class A { @Input({ transform: other }) foo: boolean = true; }',
      output: 'class A { @Input({ transform: other, transform: booleanAttribute }) foo: boolean = true; }',
      errors: [{ messageId: 'requireTransformDecorator' }],
    },
    {
      code: 'class A { foo = input<boolean>(true); }',
      output: 'class A { foo = input<boolean, BooleanInput>(true, { transform: booleanAttribute }); }',
      errors: [{ messageId: 'requireTransformSignal', data: { name: 'foo' } }],
    },
    {
      code: 'class A { foo = input<boolean>(); }',
      output: 'class A { foo = input<boolean, BooleanInput>(false, { transform: booleanAttribute }); }',
      errors: [{ messageId: 'requireTransformSignal' }],
    },
    {
      // BooleanInput present but transform missing
      code: 'class A { foo = input<boolean, BooleanInput>(true); }',
      output: 'class A { foo = input<boolean, BooleanInput>(true, { transform: booleanAttribute }); }',
      errors: [{ messageId: 'requireTransformSignal' }],
    },
    {
      // transform present but BooleanInput missing
      code: 'class A { foo = input<boolean>(false, { transform: booleanAttribute }); }',
      output: 'class A { foo = input<boolean, BooleanInput>(false, { transform: booleanAttribute }); }',
      errors: [{ messageId: 'requireTransformSignal' }],
    },
    {
      // Standalone variable declarator: reported, no autofix
      code: 'const foo = input<boolean>(true);',
      output: null,
      errors: [{ messageId: 'requireTransformSignal', data: { name: 'foo' } }],
    },
    {
      // Multiple issues in one class
      code: 'class A { @Input() a: boolean = false; b = input<boolean>(true); }',
      output: 'class A { @Input({ transform: booleanAttribute }) a: boolean = false; b = input<boolean, BooleanInput>(true, { transform: booleanAttribute }); }',
      errors: [{ messageId: 'requireTransformDecorator' }, { messageId: 'requireTransformSignal' }],
    },
  ],
});
