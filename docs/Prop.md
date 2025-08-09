# Prop

This is a helper class for defining component properties.
It allows you to create typed properties in components.

```ts
import {Prop} from 'web-signature';
```

## new Prop()

`new Prop(type: TypesMap, required: boolean = true, validate?: (value) => boolean)`:

```ts
type TypesMap = "string" | "number" | "boolean" | "array" | "null";
```

- `type` - the property type, which can be one of the following: `string`, `number`, `boolean`, `array`, `null`.
- `required` - indicates whether the property is required. Defaults to `true`.
- `validate?` - function for additional validation of the property value.

## Example

```ts
import {Prop} from 'web-signature';

new Prop("string", true, (value) => value.length > 0);
```