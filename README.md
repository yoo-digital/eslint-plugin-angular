# YOO ESLint plugin Angular

## Custom lint purpose

Here should live all custom Angular lint rules that eslint does not already provide.

## Linting

Wrong code is yellow/red underlined in VScode, it can also be raised running : `npm run lint`, autofixing them with : `npm run lint:fix`

## 1️⃣ Boolean input conversion

This feature consists of **two complementary rules**:

1. **`boolean-attribute-ts`** - TypeScript rule that enforces `booleanAttribute` transform on boolean inputs
2. **`boolean-attribute-html`** - Template rule that enforces shorthand syntax for `[attr]="true"` bindings

### Setting 
```json
{
  "rules": {
    "@yoo-digital/eslint-plugin-angular/boolean-attribute-ts": "error",
    "@yoo-digital/eslint-plugin-angular/boolean-attribute-html": "error"
  }
}
```

### HTML 

#### True value 
```html
<mealComponent [isVegan]="true" />
<!-- Lint issue enforcing to be :  --> 
<mealComponent isVegan />
```

#### False value (bypassed)
```html
<mealComponent [isVegan]="false" />
<!-- No lint issue, to be able to address false value for a default true input -->
```

### Typescript

#### Imports
`booleanAttribute @angular/core`

`BooleanInput @angular/cdk/coercion`

#### Modern signal way
```typescript
isVegan = input<boolean>();
// Lint issue, must become : 
isVegan = input<boolean, BooleanInput>(true|false, { transform: booleanAttribute });
```

#### Old decorator way
```typescript
@Input() isVegan?: boolean;
// Lint issue, must become : 
@Input({ transform: booleanAttribute }) isVegan: boolean = true|false;
```

### Default value 
#### Default true 

If boolean input is by default **true**
```typescript
// Modern signal way : 
isVegan = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
// Old decorator way : 
@Input({ transform: booleanAttribute }) isVegan: boolean = true;
```

HTML set it true or false this way : 

```html
<!-- True value  -->
<mealComponent />
<!-- False value  -->
<mealComponent [isVegan]="false" />
```

#### Default false 

If boolean input is by default **false**
```typescript
// Modern signal way : 
isVegan = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
// Old decorator way : 
@Input({ transform: booleanAttribute }) isVegan: boolean = false;
```

HTML set it true or false this way : 

```html
<!-- True value  -->
<mealComponent isVegan />
<!-- False value  -->
<mealComponent />
```

## 2️⃣ ...