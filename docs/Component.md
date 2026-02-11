# Component

This is an abstract class from which all components inherit.
This class provides basic functionality for creating components.
It provides an abstract shell for creating UI interfaces using an OOP approach.
It is not intended to be used directly as a stand-alone instance. **Do not instantiate `Component`
directly.**

```ts
import {Component} from 'web-signature';
```

* [Component](#component)
	* [Creating a component](#creating-a-component)
	* Main fields and methods
	* [Component.name](#componentname)
	* [Component.render()](#componentrender)
	* [Component.content?](#componentcontent)
	* [Component.ref?](#componentref)
	* Working with attributes
		* [Component.props](#componentprops)
		* [Component.data](#componentdata)
	* [Plugins](#component-plugins)
	* [Component.options](#componentoptions)
		* [Component.options.generateRefIfNotSpecified](#componentoptionsgeneraterefifnotspecified)
	* Lifecycle hooks
		* [Component.onInit?()](#componentoninit)
		* [Component.onRender?()](#componentonrender)
		* [Component.onMount?()](#componentonmount)
		* [Component.onContact?()](#componentoncontact)
		* [Component.onPropsParsed?()](#componentonpropsparsed)
		* [Component.onPropParsed?()](#componentonpropparsed)

## Creating a component

To create a component, you need to inherit the `Component` class and implement the `render` method and the `name` field.
The `Component` class constructor **does not need to be overridden** because it has no parameters
and does not perform any actions, and **adding them will result in an error.**

```ts
import {html, Component} from 'web-signature';

class MyComponent extends Component {
	name = 'MyComponent';

	render() {
		return html`<div>Hello, World!</div>`;
	}
}
```

## Component.name

The `name` field is required and is used to identify the component.
It must be unique for each component. If two components
have the same name, this will cause an error when registering the component.

```ts
class MyComponent extends Component {
	name = 'MyComponent'; // Unique component name
}
```

## Component.render()

This method is mandatory to implement in every component.
It is responsible for rendering the component's HTML code.
The `render` method should return a string containing HTML processed by function [html()](./html.md) code with only one
root element.

```ts
import {html, Component} from 'web-signature';

class MyComponent extends Component {
	/* ... */

	render() {
		return html`<div>Hello, World!</div>`;
	}
}
```

## Component.content?

The `content` field is determined when the component is rendered.
This field contains the HTML code that will be inserted into the body of the component.
`content` must be processed by the [unsafeHTML()](./html.md#unsafehtml) function.

```ts
import {html, unsafeHTML, Component} from 'web-signature';

class MyComponent extends Component {
	name = 'MyComponent';

	render() {
		return html`<div>${unsafeHTML(this.content)}</div>`;
	}
}
```

HTML:

```html

<MyComponent>Hello, World!</MyComponent>
```

`MyComponent.content` will contain the text `Hello, World!`.

## Component.ref?

This field contains a wrapper (`Ref`) for working with the `ref` of the component.
It allows you to contact a component via its `ref` if it has been specified in the HTML.

```ts 
type Ref = {
	/**
	 * Unique identifier for the component.
	 */
	id: string;

	/**
	 * Function to contact the component with props.
	 * @param {...any[]} props - The properties to send to the component.
	 * @returns {any}
	 */
	contact: (...props: any[]) => any;

	/**
	 * Function to update the component.
	 */
	update: () => void;
}
```

Usage:

```ts
import {html, Component} from 'web-signature';

class MyComponent extends Component {
	name = 'MyComponent';

	ref?: Ref;

	text: string = 'Hello, World!';

	render() {
		return html`<div>${this.text}</div>`;
	}

	onMount(el: HTMLElement) {
		// If the component has a ref, we can use it to update the component
		if (this.ref) {
			el.addEventListener('click', () => {
				this.text = 'Clicked!';

				// Update the component using the ref
				this.ref.update();
			});
		}
	}
}
```

## Component.props

This field contains typed attributes of the component. **It does not contain attribute values, only their types.**
This is an object that contains instances of the [`Prop`](./Prop.md) class, `Component.props: Record<string, Prop>`.

```ts
import {Component, Prop} from 'web-signature';

class MyComponent extends Component {
	name = 'MyComponent';

	props = {
		// The `text` attribute is required and has type `string`
		text: new Prop("string", true, (val) => val.lenght > 0)
	}

	/* ... */
}
```

HTML:

```html

<MyComponent text="Hello, World!"></MyComponent>
```

## Component.data

This field contains the values of the component attributes,
which were passed after parsing [`Component.props`](./Prop.md) during rendering.
That is, if `Component.props.text = new Prop("string")`, then `Component.data` will have a `text` field, which will
contain the value of the `text` attribute from HTML.

```ts
import {Component, Prop, html} from 'web-signature';

class MyComponent extends Component {
	name = 'MyComponent';

	props = {
		text: new Prop("string", true, (val) => val.lenght > 0)
	}

	render() {
		// We use the value of the `text` attribute from `Component.data`
		return html`<div>${this.data?.text}</div>`;
	}
}
```

## Component Plugins

The `Component.$` field contains the installed [plugins](./Plugin.md) that can be used in the component.
You can refer to the plugin by the name you specified when installing it, for example `this.$.myPlugin`.

## Component.options

The `options` field contains the component's settings.

```ts
class MyComponent extends Component {
	/* ... */

	options = {
		generateRefIfNotSpecified: false
	}

	/* ... */
}
```

### Component.options.generateRefIfNotSpecified

This field determines whether a `ref` should be automatically generated for the component if none is specified.
If this field is set to `true`, then `ref` will be automatically created when the component is rendered if it is not
specified.
This can be useful if you want a component to always have a `ref`, even if it is not specified in the HTML.
By default, this field is set to `false`, meaning `ref` will not be created automatically.

```ts
class MyComponent extends Component {
	/* ... */

	options = {
		generateRefIfNotSpecified: true
	};

	/* ... */
}
```

## Component.onInit?()

Lifecycle hook that is called when the component is initialized.

```ts
class MyComponent extends Component {
	/* ... */

	onInit() {
	}
}
```

## Component.onRender?()

Lifecycle hook that is called when the component is rendered.

```ts
class MyComponent extends Component {
	onRender() {
	}
}
```

## Component.onMount?()

Lifecycle hook that is called when the component is mounted to the DOM.

`Component.onMount(el: HTMLElement)`:

- `el` - The root element of the component in the DOM.

```ts
class MyComponent extends Component {
	/* ... */

	onMount(el: HTMLElement) {
	}
}
```

## Component.onContact?()

Lifecycle hook called via Signature.contactWith.

`Component.onContact(...props: any[]): any`:

- `...props` - The properties sent to the component via [`Signature.contactWith`](./Signature.md#signaturecontactwith).

```ts
class MyComponent extends Component {
	/* ... */

	onContact(...props: any[]): any {
	}
}
```

## Component.onPropsParsed?()

Lifecycle hook that is called when the component's [props](./Prop.md) are parsed.

```ts
class MyComponent extends Component {
	/* ... */

	onPropsParsed() {
	}
}
```

## Component.onPropParsed?()

Lifecycle hook that is called when a [prop](./Prop.md) is parsed.

`Component.onPropParsed(prop: Prop, value: any): any`:

- `prop` - The prop that was parsed.
- `value` - The value of the [prop](./Prop.md).