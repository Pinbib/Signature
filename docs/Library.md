# Library

This class allows you to group and distribute [components](./Component.md)
that share common logic or functionality.
That is, allows you to organize components into named libraries and link to other libraries.

```ts
import {Library} from 'web-signature';
```

`new Library(name: string, author?: string, version?: string)`:

- `name` - the name of the library that will be used to register [components](./Component.md)
- `author?` - library author (optional)
- `version?` - library version (optional)

All [components](./Component.md) in the library will be available for use in HTML as `<LibraryName-componentName>`,
where `LibraryName` is the name of the library and `componentName` is the name of the component.

* [Library](#library)
	* Working with [Components](./Component.md)
		* [Library.add()](#libraryadd)
		* [Library.get()](#libraryget)
		* [Library.list()](#librarylist)
	* Working with Libraries
		* [Library.register()](#libraryregister)
		* [Library.lib()](#librarylib)

## Library.add()

Adds a [component](./Component.md) to the library.

`Library.add(component: ComponentConstructor, name?: string)`:

- `component` - [component](./Component.md) class to be added to the library
- `name?` - component name, if not specified [`Component.name`](./Component.md) will be used

```ts
import {Library} from 'web-signature';
import {MyComponent} from './MyComponent';

// Creating a new library
const myLibrary = new Library('MyLibrary');

// Adding a component to the library
myLibrary.add(MyComponent, 'MyComponent');
```

## Library.get()

Returns a [component](./Component.md) by its name.

`Library.get(name: string): ComponentConstructor | undefined`:

- `name` - name of the [component](./Component.md) to be retrieved

```ts
import {Library} from 'web-signature';
import {MyComponent} from './MyComponent';

const myLibrary = new Library('MyLibrary');

myLibrary.add(MyComponent, 'MyComponent');

// Get the component by its name
const component = myLibrary.get('MyComponent');
```

## Library.list()

Returns a list of all [components](./Component.md) in the library.

`Library.list(): string[]`:

```ts
import {Library} from 'web-signature';
import {MyComponent} from './MyComponent';

const myLibrary = new Library('MyLibrary');

myLibrary.add(MyComponent, 'MyComponent');

// Get a list of all components in the library
const components = myLibrary.list();
```

## Library.register()

Registers a library to a library. That is, registers a library's dependency on another library.
[Components](./Component.md) from this library will be available for use in HTML as
`<LibraryName-DepLib-componentName>`,
where `LibraryName` is the name of the library, `DepLib` is the name of the registered library,
and `componentName` is the name of the [component](./Component.md) from the registered library.

```text
NewLibrary
 └── MyLibrary (registered)
      └── MyComponent
```

`Library.register(library: Library, ...exclude: string[])`:

- `library` - library to be registered
- `...exclude` - list of components to be excluded from registration (optional)

```ts
import {Library} from 'web-signature';
import {myLibrary} from './MyLibrary';

const newLibrary = new Library('NewLibrary');

// Register myLibrary in newLibrary
// Components from myLibrary will be available as <NewLibrary-myLibrary-componentName>
newLibrary.register(myLibrary);
```

HTML:

```html

<NewLibrary-MyLibrary-MyComponent></NewLibrary-MyLibrary-MyComponent>
```

## Library.lib()

Returns information about the registered library.

`Library.lib(name: string): LibMeta | undefined`:

- `name` - name of the library you want to get information about.

```ts
type LibMeta = {
	name: string,
	version?: string,
	author?: string,
	components: string[],
	dependencies: Record<string, LibMeta>
};
```

```ts
import {Library} from 'web-signature';
import {myLibrary} from './MyLibrary';

const newLibrary = new Library('NewLibrary');

newLibrary.register(myLibrary);

// Get information about the registered library
const libInfo = newLibrary.lib('MyLibrary');
```