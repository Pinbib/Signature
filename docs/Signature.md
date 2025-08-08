# Signature

This is the main class for rendering the page.

```ts
import {Signature} from 'web-signature';
```

Creating a Signature instance:

```ts
import {Signature} from 'web-signature';

const si = new Signature();
```

// list

## Signature.contact()

Renders the page.

`Signature.contact(selector: string, callback?: ()=>void)`:

- `selector` - this is the css selector of the element in which the rendering will take place.
- `callback` - a callback that is called after rendering is complete.

```ts
import {Signature} from 'web-signature';

const si = new Signature();
si.contact('#app', () => {
	console.log('The page has been successfully rendered!');
});
```

HTML:

```html

<div id="app">
    <My-component></My-component>
</div>
```

## Signature.add()

Adds [component](./Component.md) to Signature.

`Signature.add(component: ComponentConstructor, name?: string)`:

- `component` - this is the constructor of the [component](./Component.md) class .
- `name?` - [component](./Component.md) name (optional parameter, but recommended to avoid problems when building the
  project).

```ts
import {Signature} from 'web-signature';
import {MyComponent} from './my-component';

const si = new Signature();

// Adding a component
si.add(MyComponent, 'My-component');
// The <My-component> tag will be processed by this class.
```

## Signature.contactWith()

Contacts (triggers the call of the [Component.onContact](./Component.md) hook) with the component by its ref and returns
the result of the call if any.

`Signature.contactWith(name: string, ...props: any[]): any`:

- `name` - This is the ref under which the component to which the call will be made is stored.
- `...props` - additional parameters that will be passed to the [component's onContact](./Component.md) method.

```ts
import {Signature} from 'web-signature';
import {MyComponent} from './my-component';

const si = new Signature();

si.add(MyComponent, 'My-component');

si.contact('#app', () => {
	// Contacting the component under ref 'mc'
	si.contactWith('mc', 'Hello, World!');
});
```

HTML:

```html

<div id="app">
    <My-component ref="mc"></My-component>
</div>
```

## Signature.updateRef()

Updates [component](./Component.md) by its ref.

`Signature.updateRef(name: string): void`:

- `name` - This is the ref under which the component that needs to be updated is stored.

```ts
import {Signature} from 'web-signature';
import {MyComponent} from './my-component';

const si = new Signature();

si.add(MyComponent, 'My-component');

si.contact('#app', () => {
	// Updating the component under ref 'mc'
	si.updateRef('mc');
});
```

HTML:

```html

<div id="app">
    <My-component ref="mc"></My-component>
</div>
```

## Signature.register()

Registers the library.

`Signature.register(library: Library, ...exclude: string[]): void`:

- `library` - this is an instance of the [Library](./Library.md) class that needs to be registered.
- `...exclude` - a list of components to exclude from registration (optional parameter).

```ts
import {Signature} from 'web-signature';
import MyLib from './my-lib';

const si = new Signature();

// Registering the library
si.register(MyLib);
```

## Signature.lib()

Returns information about the registered [library](./Library.md).

`Signature.lib(name: string): LibMeta | undefined`:

```ts 
type LibMeta = {
	name: string,
	version?: string,
	author?: string,
	components: string[],
	dependencies: Record<string, LibMeta>
};
```

- `name` - this is the name of the library to be retrieved.

```ts
import {Signature} from 'web-signature';
import MyLib from './my-lib';

const si = new Signature();

si.register(MyLib);

// We get information about the library
si.lib('MyLib');
```

## Signature.libraries()

Returns a list of registered libraries and their dependencies.

`Signature.libraries(): Record<string, ResolvedLib>`:

`ResolvedLib`:

```ts
type ResolvedLib = {
	components: string[],
	dependencies: Record<string, ResolvedLib>
};
```

## Атрибут ref

The `ref` attribute allows you to store a reference to a component so that you can later access it from Signature.

```html

<My-component ref="mc"></My-component>
```

Specifying a specific ref is not required unless you need to access the component externally, in which case you can
leave the ref empty:

```html

<My-component ref>
    <!-- ref will be automatically generated -->
</My-component>
```