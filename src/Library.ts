import {ComponentConstructor} from "./Component.js";

export default class Library {
	public readonly name: string;
	public readonly version?: string;
	public readonly author?: string;

	private components: Record<string, ComponentConstructor> = {};

	/**
	 * @param {string} name The name of the library.
	 * @param {string} [author] Optional author of the library.
	 * @param {string} [version] Optional version of the library.
	 */
	constructor(name: string, author?: string, version?: string) {
		this.name = name;
		
		// optional properties
		this.author = author;
		this.version = version;
	}

	/**
	 * Registers a component in the library.
	 * @param {ComponentConstructor} component The component to register.
	 * @param {string} [name] Optional name for the component. If not provided, uses the component's name property.
	 */
	public add(component: ComponentConstructor, name?: string): void {
		const key = typeof name === "string" ? name : component.name;

		if (this.components[key]) {
			console.warn(new Error(`Component with name ${key} already exists.`));
		}

		this.components[key] = component;
	}

	/**
	 * Retrieves a component by its name.
	 * @param {string} name The name of the component to retrieve.
	 * @return {ComponentConstructor | undefined} The component associated with the name, or undefined if it does not exist.
	 */
	public get(name: string): ComponentConstructor | undefined {
		return this.components[name];
	}

	/**
	 * Lists all registered components in the library.
	 * @return {Array<{ component: ComponentConstructor, name: string }>} An array of objects containing component constructors and their names.
	 */
	public list(): Array<{ component: ComponentConstructor, name: string }> {
		return Object.entries(this.components).map(([name, component]) => ({
			component,
			name
		}));
	}
}