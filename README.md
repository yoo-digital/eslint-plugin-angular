# eslint-plugin-angular

## Custom lint purpose

Here should live all custom Angular lint rules that eslint does not already provide.

## Linting

Wrong code is yellow underlined in VScode, it can also be raises running : `npm run lint`

## Rule 1 : boolean input conversion

`booleanAttribute @angular/core`

`BooleanInput @angular/cdk/coercion`

### Examples

`<myComp [myBoolInput]="true" ` must be `<myComp myBoolInput`

`<myComp [myBoolInput]="false"` must be `<myComp `

`<myComp [myBoolInput]="2+2===4"` is accepted

### Decorator

`@Input({ transform: booleanAttribute }) myInput: boolean = true;`

### Signal

`myInput = input<boolean, BooleanInput>(true, {transform: booleanAttribute,});`

### Exception

If a **required** boolean input needs to be false, no choice, `[myRequiredInput]="false"` must be written. Therefore boolean input should never be required.