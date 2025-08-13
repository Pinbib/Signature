# html()

This function creates a template object for rendering HTML
with separation of static structure and dynamic values.
Allows for safe HTML processing and avoidance of XSS.

```ts
import {html} from 'web-signature';
```

# Usage in Component

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