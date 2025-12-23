# eslint-plugin-angular

## Custom lint purpose

Here should live all custom Angular lint rules that eslint does not already provide.

## Linting

Wrong code is yellow/red underlined in VScode, it can also be raises running : `npm run lint`

---

## Rule 1 : boolean input conversion

`booleanAttribute @angular/core`

`BooleanInput @angular/cdk/coercion`

The rule only flags components inputs `[isVegan]="true"` bindings and ignores `[isVegan]="false"` bindings:

```json
{
  "rules": {
    "@yoo-digital/eslint-plugin-angular/prefer-boolean-attribute-shorthand": "error"
  }
}
```

### Examples

```html
<!-- this will raise lint issue -->
<myMealComponent [isVegan]="true" />
<!-- false value raises no lint issue (ignored) -->
<myMealComponent [isVegan]="false" />
```

Lint enforces use of boolean attribute : 

```typescript
// Modern signal way
isVegan = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
// Old decorator way
@Input({ transform: booleanAttribute }) isVegan: boolean = false;
```

---

## Rule 2 : ...