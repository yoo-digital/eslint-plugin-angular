## @yoo-digital/eslint-plugin-angular

Custom ESLint plugin for Angular projects providing the `prefer-boolean-attribute-shorthand` rule.

> NOTE: Rule logic is a placeholder. Bring over the working code from `ng-custom-lint-v2` into `src/rules/prefer-boolean-attribute-shorthand.ts`.

### Installation

```bash
npm install --save-dev @yoo-digital/eslint-plugin-angular
```

Peer dependencies (ensure aligned with your Angular project):

```bash
npm install --save-dev eslint @angular-eslint/eslint-plugin @angular-eslint/template-parser typescript
```

### Usage in `.eslintrc.json`

```jsonc
{
  "root": true,
  "ignorePatterns": ["node_modules/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "@yoo-digital/eslint-config-base",
        "@yoo-digital/eslint-config-angular",
        "@yoo-digital/eslint-plugin-angular"
      ]
    }
  ]
}
```

Recommended config alternative:

```jsonc
{
  "extends": ["plugin:@yoo-digital/eslint-plugin-angular/recommended"]
}
```

Manual enabling:

```jsonc
{
  "plugins": ["@yoo-digital/eslint-plugin-angular"],
  "rules": {
    "@yoo-digital/eslint-plugin-angular/prefer-boolean-attribute-shorthand": "error"
  }
}
```

### Rule: prefer-boolean-attribute-shorthand

Enforces using boolean attribute shorthand (`attr` instead of `[attr]="true"`) for cleaner template syntax.

⚠️ **Important**: This rule **cannot** automatically verify whether inputs have `booleanAttribute` transform or check default values. This is a technical limitation - template ESLint rules cannot access component TypeScript code.

**Use this rule only if**:
- All boolean inputs in your codebase use `booleanAttribute` transform
- Most inputs have `default = false` or no default
- You want to enforce consistent template style

#### Basic Example

```html
<!-- ❌ Avoid -->
<button [disabled]="true">Click</button>

<!-- ✅ Prefer -->
<button disabled>Click</button>
```

#### Configuration

Default (safe - only flags true bindings):
```jsonc
{
  "rules": {
    "@yoo-digital/eslint-plugin-angular/prefer-boolean-attribute-shorthand": "error"
  }
}
```

Strict mode (also enforces false binding removal):
```jsonc
{
  "rules": {
    "@yoo-digital/eslint-plugin-angular/prefer-boolean-attribute-shorthand": [
      "error",
      { "allowFalseLiteral": false }
    ]
  }
}
```

#### When to disable

Disable for specific lines when input has `default = true`:

```html
<!-- eslint-disable-next-line @yoo-digital/eslint-plugin-angular/prefer-boolean-attribute-shorthand -->
<button [enabled]="false">Override default true</button>
```

### Development

Build:

```bash
npm run build
```

Publish:

```bash
npm publish --access public
```

### TODO

- Copy actual rule logic from `ng-custom-lint-v2`.
- Add tests.

### License

MIT