# Signature

![](./Signature.svg)

[![GitHub package.json version](https://img.shields.io/github/package-json/v/Pinbib/Signature?style=plastic&logo=github)](https://github.com/Pinbib/Signature)[![NPM Version](https://img.shields.io/npm/v/web-signature?style=plastic&logo=npm)](https://www.npmjs.com/package/web-signature)

This is a primitive and simple component-based declarative rendering framework.

# Features

- Simplicity and primitiveness
- Declarative rendering
- Flexibility, and Object-Oriented Architecture

# Quick Start

To get started with Signature, simply run this command:

```bash
npm create signature@latest
```

You will be offered several project templates (almost all templates use Vite). After creating the project, follow the
instructions to install dependencies and run:

```bash
cd <your-project-name>
npm install
npm run dev
```

* [Signature](#signature)
* [Quick Start](#quick-start)
* [Introduction](#introduction)
	* [Briefly about Signature](#briefly-about-signature)
	* [About Component](#about-component)
	* [Quick about the Library](#quick-about-the-library)
	* [See more here](#see-more-here)

# Introduction

Signature uses four classes as its basis:

- [Signature](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md) - which processes the entire page and
  components.
- [Component](https://github.com/Pinbib/Signature/blob/main/docs/Component.md) - which defines a standard structure for
  any
  element.
- [Prop](https://github.com/Pinbib/Signature/blob/main/docs/Prop.md) - which defines properties for components.
- [Library](https://github.com/Pinbib/Signature/blob/main/docs/Library.md) - which defines a set of components.

In short, Signature allows you to create a website using simple and straightforward components that are easy to
customize and extend.

## Briefly about [Signature](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md)

The [signature](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md) is the main class that is responsible
for
processing the entire page. It is used to
add [components](https://github.com/Pinbib/Signature/blob/main/docs/Component.md),
register [libraries](https://github.com/Pinbib/Signature/blob/main/docs/Library.md), and essentially render the page.

```ts 
// Creating a Signature instance

import {Signature} from 'web-signature';

const si = new Signature();
```

To add a component, use the
[
`Signature.add(component: ComponentConstructor, name?: string)`](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md#signatureadd)
method, which takes
the
[component](https://github.com/Pinbib/Signature/blob/main/docs/Component.md) class and its name. For example:

```ts
import {Signature, Component} from 'web-signature';

class MyComponent extends Component {
	/* ... */
}

const si = new Signature();

si.add(MyComponent, 'my-component');
// The <my-component> tag will be processed by this class.
```

**Although the [component](https://github.com/Pinbib/Signature/blob/main/docs/Component.md) name is not required,
it is recommended to specify it to avoid problems when building the project.**

To register a [library](https://github.com/Pinbib/Signature/blob/main/docs/Library.md), the [
`Signature.register(library: Library)`](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md#signatureregister)
method is used, which takes an
instance of the [Library](https://github.com/Pinbib/Signature/blob/main/docs/Library.md).
For example:

```ts
import {Signature} from 'web-signature';
import {MyLibrary} from './my-library';

const si = new Signature();
si.register(new MyLibrary());
```

For rendering the page there is a [
`Signature.contact(selector: string, callback?)`](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md#signaturecontact)
method. For example:

```ts
import {Signature} from 'web-signature';

const si = new Signature();

si.contact('#app', () => {
	console.log('Page rendered successfully!');
});
```

## About [Component](https://github.com/Pinbib/Signature/blob/main/docs/Component.md)

This is an abstract class from which all components inherit. It defines a standard structure for any element.
It has a main method [
`Component.render()`](https://github.com/Pinbib/Signature/blob/main/docs/Component.md#componentrender), and
component lifecycle hooks such
as [
`Component.onMount()`](https://github.com/Pinbib/Signature/blob/main/docs/Component.md#componentonmount).

To create a component, you need to inherit the [
`Component`](https://github.com/Pinbib/Signature/blob/main/docs/Component.md)
class and implement the
[`Component.render(): string`](https://github.com/Pinbib/Signature/blob/main/docs/Component.md#componentrender) method
and the
`name` field.
Let's create a simple component that simply displays text:

```ts
import {Component, html} from 'web-signature';

class MyComponent extends Component {
	name = 'my-component';

	render(): string {
		return html`<div>Hello, World!</div>`;
	}
}
```

```html

<div id="app">
    <my-component></my-component>
</div>
```

Now let's make a counter component that will increment the value when clicked. To do this,
we will need to update it somehow and track events.
For a component to be able to update, it must have its own ref. Ref - allows you to associate a
component instance with
its DOM
element, if the ref is not specified, the [Signature](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md)
will not
remember the component instance.
And to track events, we will use the [
`Component.onMount(el: Element)`](https://github.com/Pinbib/Signature/blob/main/docs/Component.md#componentonmount)
hook,
which is
called after the component has been
added to
the page.

```ts
import {Signature, Component, html} from 'web-signature';

export class Counter extends Component {
	name = "counter";

	count = 0;

	render(): string {
		// Rendering the component as a button with the current count
		return html`<button type="button">Count is ${this.count}</button>`;
	}

	onMount(el: Element): void {
		el.addEventListener('click', () => {
			// Since a ref is required to update a component, we check if it is defined.
			if (this.ref === undefined) {
				throw Error();
			}

			this.count++;

			// Update the component
			this.ref.update();
		});
	}
}

const si = new Signature();
si.add(Counter, "Counter");
si.contact("#app");
```

The HTML should look like this:

```html

<div id="app">
    <counter ref></counter>
</div>
```

It is not necessary to specify a specific ref, the signature will generate it itself,
but if you want the ref to have a
specific name, you can specify it in the attribute. You can also set the component options to auto-generate
the ref if it was not specified.

```ts
// ...
class Counter extends Component {
	options = {
		generateRefIfNotSpecified: true
	}
	// ...
}

// ...
```

Let's make it possible to set the number of steps to increment the counter,
using [Props](https://github.com/Pinbib/Signature/blob/main/docs/Prop.md). We need to create
a [Prop](https://github.com/Pinbib/Signature/blob/main/docs/Prop.md) `step` with type `number`.

```ts
import {Signature, Component, Prop, html} from 'web-signature';

export class StepCounter extends Component {
	name = "step-counter";

	count = 0;

	// In this field, we create a Prop step with type number
	props = {
		// We have specified that this Prop is required and must be a number greater than or equal to 1.
		step: new Prop("number", true, (val) => Number(val) >= 1)
	}

	render(): string {
		// Rendering the component as a button with the current count
		return html`<button type="button">Count is ${this.count}</button>`;
	}

	onMount(el: Element): void {
		el.addEventListener('click', () => {
			// Since a ref is required to update a component, we check if it is defined.
			if (this.ref === undefined) {
				throw Error();
			}

			//After processing Props, the specified values are written to this.data
			this.count += this.data.step as number;

			// Update the component
			this.ref.update();
		});
	}
}

const si = new Signature();
si.add(StepCounter, "Step-counter");
si.contact("#app");
```

The HTML should look like this:

```html

<div id="app">
    <Step-counter ref step="2"></Step-counter>
</div>

```

Now, when you click the button, the counter will increase by the specified number of steps (in our case, it is 2 steps).

## Quick about the Library

The [Library](https://github.com/Pinbib/Signature/blob/main/docs/Library.md) class allows you to create a set
of [components](https://github.com/Pinbib/Signature/blob/main/docs/Component.md) that can be used
in a
project.
It has no other purpose than to facilitate the registration
of [components](https://github.com/Pinbib/Signature/blob/main/docs/Component.md)
in [Signature](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md),
and avoiding [component](https://github.com/Pinbib/Signature/blob/main/docs/Component.md) name collisions by grouping
them.

Let's create a [library](https://github.com/Pinbib/Signature/blob/main/docs/Library.md) that will contain our `Counter`
and
`StepCounter` components:

```ts
import {Library} from 'web-signature';

// Importing the components
import {Counter} from './Counter';
import {StepCounter} from './StepCounter';

// Creating a library instance
const myLibrary = new Library('ML');

// Adding components to the library
myLibrary.add(Counter, "Counter");
myLibrary.add(StepCounter, "Step-counter");

export default myLibrary;
```

To register the library
in [Signature](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md#signatureregister),
use the
[
`Signature.register(library: Library)`](https://github.com/Pinbib/Signature/blob/main/docs/Signature.md#signatureregister)
method:

```ts
import {Signature} from 'web-signature';

// Importing the library
import myLibrary from './myLibrary';

const si = new Signature();

// Registering the library
si.register(myLibrary);

si.contact('#app');
```

Now you can use the components from the [library](https://github.com/Pinbib/Signature/blob/main/docs/Library.md) in your
HTML, but
all components will be available
with
the prefix
`ML-`, i.e. `ML-counter` and `ML-step-counter`, the pattern is the library name
is used as a prefix for the [component](https://github.com/Pinbib/Signature/blob/main/docs/Component.md) name
`[libName]-[componentName]`.

```html

<div id="app">
    <ML-counter ref></ML-counter>
    <ML-step-counter ref step="2"></ML-step-counter>
</div>
```

## [See more here](https://github.com/Pinbib/Signature/tree/main/docs)