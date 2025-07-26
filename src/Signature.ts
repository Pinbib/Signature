import Component, {ComponentConstructor} from "./Component.js";
import Ref from "./Ref.js";
import ErrorUnion from "./types/Errors.js";
import Errors from "./Errors.js";
import Library, {LibMeta} from "./Library.js";

let _counter = 0;

type ResolvedLib = {
	components: string[],
	dependencies: Record<string, ResolvedLib>
};

export default class Signature {
	private components: Record<string, ComponentConstructor> = {};
	private refs: Record<string, Ref> = {};
	private libs: Record<string, LibMeta> = {};

	constructor() {
	}

	/**
	 * Adds a component to the signature.
	 * @param {ComponentConstructor} component The component to add.
	 * @param {string} name Optional name for the component. If not provided, uses the component's name property.
	 */
	public add(component: ComponentConstructor, name?: string): void {
		const key = typeof name === "string" ? name : component.name;

		if (this.components[key]) {
			console.warn(new Error(`Component with name ${key} already exists.`));
		}

		this.components[key] = component;
	}

	/**
	 * Registers a library in the signature.
	 * @import {Library} from "./Library.js";
	 * @param {Library} library The library to register.
	 * @param {string[]} exclude Optional array of component names to exclude from the library registration.
	 */
	public register(library: Library, ...exclude: string[]): void {
		if (this.libs[library.name]) {
			console.warn(new Error(`Library with name ${library.name} already exists.`));
		}

		const components: Array<{
			component: ComponentConstructor,
			name: string
		}> = library.list().filter(com => !(com.name in exclude));

		this.libs[library.name] = {
			name: library.name,
			version: library.version,
			author: library.author,
			components: components.map(com => com.name),
			dependencies: library.libs
		};

		for (const com of components) {
			this.add(com.component, `${library.name}-${com.name}`);
		}
	}

	/**
	 * Returns a library.
	 * @param {string} name The name of the library.
	 * @return {LibMeta}
	 */
	public lib(name: string): LibMeta | undefined {
		return this.libs[name];
	}

	/**
	 * Returns a formatted object of all libraries in the signature.
	 * @return {Record<string, ResolvedLib>} A object of formatted libraries with their components and dependencies.
	 */
	public libraries(): Record<string, ResolvedLib> {
		const formatKey = (lib: LibMeta): string => {
			let key = lib.name;

			if (lib.version) key += `@${lib.version}`;
			if (lib.author) key += `#${lib.author}`;

			return key;
		};

		const resolve = (libs: Record<string, LibMeta>, visited = new Set<string>()): Record<string, ResolvedLib> => {
			const result: Record<string, ResolvedLib> = {};

			for (const [_, lib] of Object.entries(libs)) {
				const key = formatKey(lib);

				if (visited.has(key)) continue;
				visited.add(key);

				result[key] = {
					components: lib.components,
					dependencies: resolve(lib.dependencies, visited)
				};
			}

			return result;
		};

		return resolve(this.libs);
	}

	// /**
	//  * Returns a reference.
	//  * @param {string} name The name of the reference.
	//  * @return {Element | undefined} The element associated with the reference, or undefined if it does not exist.
	//  */
	// public ref(name: string): Element | undefined {
	// 	return this.refs[name]?.element;
	// }

	// /**
	//  * Works with the reference.
	//  */
	// TODO: do a Worker

	/**
	 * Contacts the Component.onContact method through its reference.
	 * @param {string} name The name of the reference.
	 * @param {...any[]} props The properties to pass to the component's onContact method.
	 */
	public contactWith(name: string, ...props: any[]): any {
		const ref = this.refs[name];

		if (!ref) {
			throw new Error(`Ref with name ${name} does not exist.`);
		}

		const instance = ref.instance;

		return instance.onContact?.(...props); // lifecycle hook
	}

	/**
	 * Updates the reference.
	 * @param {string} name The name of the reference to update.
	 */
	public updateRef(name: string): void {
		const ref = this.refs[name];
		if (!ref) {
			throw new Error(`Ref with name ${name} does not exist.`);
		}

		const component = ref.instance;

		let fragment: string | Promise<string> = "";

		try {
			fragment = component.render();
		} catch (err) {
			if (err instanceof Error) {
				throw {id: "unknown-from", from: component.name, err: err} as ErrorUnion;
			}
		}

		const template = document.createElement("template");

		((next: () => void) => {
			if (typeof fragment === "string") {
				template.innerHTML = fragment.trim();
				next();
			} else if (fragment instanceof Promise) {
				fragment.then((html: string) => {
					template.innerHTML = html.trim();
					next();
				}).catch((err: Error) => {
					throw {id: "unknown-from", from: component.name, err: err} as ErrorUnion;
				});
			}
		})(() => {
			if (template.content.children.length !== 1) {
				throw new Error(`Component '${component.name}' must render a single root element.`);
			}

			const newElement = template.content.firstElementChild as Element;

			this.render(template);

			component.onRender?.(); // lifecycle hook

			ref.element.replaceWith(newElement);
			ref.element = newElement;

			component.onMount?.(newElement); // lifecycle hook
		})
	}

	/**
	 * Starts rendering in the specified area.
	 * @param {string} selector The selector of the element where the signature should be rendered.
	 */
	public contact(selector: string): void {
		const hunter: Promise<void> = new Promise((_r, reject: (reason?: ErrorUnion) => void) => {
			try {
				const mainFrame = document.querySelector(selector);

				if (!mainFrame) {
					reject({id: "element-not-found", selector: selector} as ErrorUnion);
					return;
				}

				const secondaryFrame = document.createElement("div");
				secondaryFrame.innerHTML = mainFrame.innerHTML;

				this.render(secondaryFrame);

				mainFrame.replaceChildren(...Array.from(secondaryFrame.childNodes));
			} catch (err) {
				if (err instanceof Error) {
					if (err instanceof RangeError && err.message.includes("stack")) {
						reject({id: "stack-overflow", err: err} as ErrorUnion);
					} else
						reject({id: "unknown", err: err} as ErrorUnion);
				} else reject(err as ErrorUnion);
			}
		});

		// Handle errors
		hunter.catch((err: ErrorUnion) => {
			let message: string = Errors[err.id];

			Object.keys(err).filter(key => !(key in ["id", "err"])).forEach((key) => {
				message = message.replace(`#${key}`, String(err[key as keyof typeof err]));
			});

			if (err.id in ["unknown", "unknown-from"]) {
				console.error(`[${err.id}] ${message}`, (err as {
					err: Error
				}).err);
			} else console.error(`[${err.id}] ${message}`);

			throw "Page rendering was interrupted by Signature due to the above error.";
		});
	}

	private render(frame: Element | DocumentFragment): void {
		for (const com of Object.keys(this.components)) {
			const component: ComponentConstructor = this.components[com];

			// Find all elements with the component name in the frame
			for (const el of Array.from(frame.querySelectorAll(com))) {
				const renderer: Component = new component();
				renderer.onInit?.(); // lifecycle hook

				if (el instanceof HTMLElement) {
					// Fill the renderer's content
					renderer.content = el.innerHTML.trim();

					// Parse properties
					for (const prop of Object.keys(renderer.props)) {
						const attr = el.getAttribute(prop);

						if (attr === null) {
							if (renderer.props[prop].required) {
								throw {id: "prop-is-required", component: com, prop: prop} as ErrorUnion;
							}
							renderer.data[prop] = null;
						} else if (attr === "") {
							if (renderer.props[prop].required) {
								throw {id: "prop-is-required", component: com, prop: prop} as ErrorUnion;
							}

							if (renderer.props[prop].isValid(attr)) {
								renderer.data[prop] = null;
							}
						} else {
							let val;

							// Determine the type of the property and convert the attribute value accordingly
							switch (renderer.props[prop].type) {
								case "boolean":
									val = Boolean(attr);
									break;
								case "number":
									val = Number(attr);
									break;
								case "string":
									val = String(attr);
									break;
								default:
									if (renderer.props[prop].required) {
										throw {
											id: "unsupported-type-for-property",
											component: com,
											prop: prop,
											type: renderer.props[prop].type
										} as ErrorUnion;
									}
									break;
							}

							if (val !== undefined) {
								if (renderer.props[prop].isValid(val)) {

									if (renderer.props[prop].validate) {
										if (!renderer.props[prop].validate(val)) {
											throw {
												id: "invalid-value-for-property",
												component: com,
												prop: prop,
												value: val,
												attr: attr
											} as ErrorUnion;
										}
									}

									renderer.data[prop] = val;

									renderer.onPropParsed?.(renderer.props[prop], val); // lifecycle hook
								} else {
									throw {
										id: "invalid-value-for-property",
										component: com,
										prop: prop,
										value: val,
										attr: attr
									} as ErrorUnion;
								}
							}
						}
					}

					renderer.onPropsParsed?.(); // lifecycle hook
				}

				// Create a template for rendering
				const body = document.createElement("template");

				let fragment: string | Promise<string> = "";

				try {
					fragment = renderer.render();
				} catch (err) {
					if (err instanceof Error) {
						throw {id: "unknown-from", from: renderer.name, err: err} as ErrorUnion;
					}
				}

				((next: () => void) => {
					if (typeof fragment === "string") {
						body.innerHTML = fragment.trim();
						next();
					} else if (fragment instanceof Promise) {
						try {
							fragment.then((html: string) => {
								body.innerHTML = html.trim();
								next();
							}).catch((err: Error) => {
								throw {id: "unknown-from", from: renderer.name, err: err} as ErrorUnion;
							});
						} catch (err) {
							console.log(1)
						}
					}
				})(() => {
					if (body.content.children.length > 1) {
						throw {id: "multiple-root-elements", component: com, elements: body.innerHTML} as ErrorUnion;
					}

					this.render(body.content);
					renderer.onRender?.(); // lifecycle hook

					const mountEl: Element = body.content.firstElementChild as Element;

					// Processing ref
					if (el.hasAttribute("ref")) {
						let refName = el.getAttribute("ref") as string;

						_counter++;

						// If the ref name is empty, generate a unique name
						if (refName === "") {
							refName = `r${_counter}${Math.random().toString(36).substring(2, 15)}${_counter}`;
						}

						if (this.refs[refName]) {
							throw {id: "ref-collision", ref: refName, component: com} as ErrorUnion;
						}

						this.refs[refName] = new Ref(renderer, mountEl);

						mountEl.setAttribute("ref", refName);
					}

					el.replaceWith(body.content);

					renderer.onMount?.(mountEl); // lifecycle hook
				});
			}
		}
	}
}