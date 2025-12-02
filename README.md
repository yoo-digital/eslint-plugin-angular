# eslint-plugin-angular

## Custom lint purpose

Here should live all custom Angular lint rules that eslint does not already provide.

## Linting

Wrong code is yellow underlined in VScode, it can also be raises running : `npm run lint`

## Rule 1 : boolean input conversion (prefer-boolean-attribute-shorthand)

`booleanAttribute @angular/core`

`BooleanInput @angular/cdk/coercion`

### ⚠️ Important Limitations

**Current Implementation:** This rule enforces shorthand syntax (`<x a />` instead of `<x [a]="true" />`) but **cannot automatically verify**:
- Whether an input has `transform: booleanAttribute` 
- What the default value of an input is

This is a technical limitation of Angular ESLint - template rules cannot access the component's TypeScript code.

### Recommended Usage

This rule works best when:
1. **All boolean inputs** in your project use `booleanAttribute` transform
2. **Most boolean inputs** have `default = false` or no default
3. You treat this as a **style guide enforcer** rather than a safety checker

### Configuration

By default, the rule only flags `[attr]="true"` bindings (safe default):

```json
{
  "rules": {
    "@yoo-digital/eslint-plugin-angular/prefer-boolean-attribute-shorthand": "error"
  }
}
```

To also enforce removal of `[attr]="false"` bindings:

```json
{
  "rules": {
    "@yoo-digital/eslint-plugin-angular/prefer-boolean-attribute-shorthand": [
      "error",
      { "allowFalseLiteral": false }
    ]
  }
}
```

### Examples

#### ✅ Recommended Pattern (Default false or no default)

```typescript
// Component
@Input({ transform: booleanAttribute }) disabled: boolean = false;
// OR
disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
```

**Template:**
- ❌ `<button [disabled]="true">` → Should be `<button disabled>`
- ✅ `<button disabled>` (shorthand for true)
- ✅ `<button>` (omit for false)
- ✅ `<button [disabled]="isLoading">` (expressions are allowed)

#### ⚠️ Special Case: Default true (Disable rule if needed)

```typescript
// Component
@Input({ transform: booleanAttribute }) enabled: boolean = true;
```

**Template:**
```html
<!-- eslint-disable-next-line @yoo-digital/eslint-plugin-angular/prefer-boolean-attribute-shorthand -->
<button [enabled]="false">Explicitly disabled</button>
```

When default is `true`, you may need explicit `[attr]="true"` or `[attr]="false"` bindings.

#### ❌ Without booleanAttribute (Won't work!)

```typescript
// Component - Missing transform!
@Input() checked: boolean = false;
```

**Template:**
- ❌ `<input checked>` → Will pass `""` (empty string), NOT boolean!
- ✅ `<input [checked]="true">` (must use property binding)

### Decorator Syntax

`@Input({ transform: booleanAttribute }) myInput: boolean = false;`

### Signal Input Syntax

`myInput = input<boolean, BooleanInput>(false, { transform: booleanAttribute });`

### Summary

- **Rule enforces**: `[attr]="true"` → `attr` shorthand
- **Rule assumes**: Inputs have `booleanAttribute` and `default ≠ true`
- **Manual override**: Use eslint-disable comments for special cases
- **Best practice**: Ensure all boolean inputs use `booleanAttribute`