# Plugin

This is a class that is used to extend the functionality of other plugins that inherit from it.

A plugin is divided into two stages:

1) modules - these are micro plugins that allow you to store the plugin's functionality in a safe place from users,
   they are processed before the plugin is installed.
2) plugin definition - during this stage, the plugin accesses the modules, and then installs itself after processing.

```ts
import {Plugin} from 'web-signature';
```

## Creating a plugin

To create a plugin, you need to create a class that inherits from `Plugin` and implement the `modules` field and
`define` method.

```ts
import {Plugin} from 'web-signature';

class MyPlugin extends Plugin {
	// This is the modules of the plugin
	modules = {
		// Module name
		logModule: {
			say() {
				return console.log;
			}
		}
	};

	// This is the plugin definition
	define(modules) {
		return {
			hi: (name) => {
				modules.say('Hello, ' + name);
			}
		};
	}
}
```

Installing the plugin.
Please note that when installing a plugin, we create a new instance of the plugin class.
Modules are also stored, but only the plugin itself and the signature have access to them.

```ts
import {Signature} from 'web-signature';
import MyPlugin from './my-plugin';

const si = new Signature();

// Installing a plugin
si.use('MyPlugin', new MyPlugin());
```

## Plugin.modules

```ts
export default abstract class Plugin {
	readonly abstract modules: Record<string, () => Record<string, unknown>>;
}
```

## Plugin.define

```ts
export default abstract class Plugin {
	public abstract define(modules: Record<string, Record<string, unknown>>): Record<string, unknown>;
}
```