# html()

This function creates a template object for rendering HTML
with separation of static structure and dynamic values.
Allows for safe HTML processing and avoidance of XSS.

```ts
import {html} from 'web-signature';
```

Usage in Component:

```ts
import {Component, html} from 'web-signature';

class MyComponent extends Component {
	name = 'MyComponent';

	render() {
		// Using html to create a template
		return html`<div>${this.text}</div>`;
	}
}
```

# unsafeHTML()

This function allows you to insert raw HTML into the template.
It should be used with caution, as it can lead to XSS vulnerabilities if the input is not properly sanitized.

```ts
import {unsafeHTML} from 'web-signature';
```

Usage in Component:

```ts
import {Component, html, unsafeHTML} from 'web-signature';

class MyComponent extends Component {
	name = 'MyComponent';

	render() {
		// Using unsafeHTML to insert raw HTML
		return html`<div>${unsafeHTML(this.content)}</div>`;
	}
}
```