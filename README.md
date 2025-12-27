# YOO ESLint plugin Angular

## Aim

Here should live all ***custom Angular lint rules*** that eslint does not already provide.

## Use

Wrong code is yellow/red underlined in VScode, it can also be raised running : `npm run lint`
Autofixing lint issues with : `npm run lint:fix`

## 1️⃣ boolean-input

TypeScript rule that enforces `booleanAttribute` transform on boolean inputs

### Setting 
```json
{
  "files": ["**/*.ts"],
  "rules": {
    "@yoo-digital/eslint-plugin-angular/boolean-input": "error"
  }
}
```

#### Import
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

### Required boolean input

Should be avoided as it might be in conflict with `boolean-attribute-shorthand` 
```typescript
isVegan = input.required<boolean, BooleanInput>({
  transform: booleanAttribute,
});
```

```html
<!-- This will not work : -->
<!-- True value  -->
<mealComponent isVegan />
<!-- False value  -->
<mealComponent />

<!-- Values must be set, which does not respect boolean-attribute-shorthand : -->
<!-- True value  -->
<mealComponent [isVegan]="true" />
<!-- False value  -->
<mealComponent [isVegan]="false" />
```


## 2️⃣ boolean-attribute-shorthand

HTML rule that enforces shorthand syntax for `[attr]="true"` bindings

### Setting 
```json
{
  "files": ["**/*.html"],
  "rules": {
    "@yoo-digital/eslint-plugin-angular/boolean-attribute-shorthand": "error"
  }
}
```

#### True value 
```html
<mealComponent [isVegan]="true" />
<!-- Lint issue, must become :  --> 
<mealComponent isVegan />
```

#### False value (bypassed)
```html
<mealComponent [isVegan]="false" />
<!-- No lint issue, to be able to address false value for a default true input -->
```

### Right usage 
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

#### Computed

Those will raise no lint issues : 

```html
<mealComponent [isVegan]="myProperty" />
<mealComponent [isVegan]="2+2===4" />

```
