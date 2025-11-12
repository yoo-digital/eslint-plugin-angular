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

Enforces using boolean attribute shorthand when the value is explicitly `true`.

Incorrect:

```html
<button disabled="true">Click</button>
<input [required]="true" />
```

Correct:

```html
<button disabled>Click</button>
<input required />
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