import Component, {ComponentConstructor} from "./Component.js";
import Ref from "./Ref.js";
import ErrorUnion from "./types/Errors.js";
import Errors from "./Errors.js";
import Library, {LibMeta} from "./Library.js";
import {html} from "./types/Component.js";
import MetaPlugin from "./types/MetaPlugin.js";
import Plugin from "./Plugin.js";

let _counter = 0;

type ResolvedLib = {
	components: string[],
	dependencies: Record<string, ResolvedLib>
};

export default class Signature {
	private components: Record<string, ComponentConstructor> = {};
	private refs: Record<string, Ref> = {};
	private libs: Record<string, LibMeta> = {};
	private bank: Map<string, HTMLTemplateElement> = new Map<string, HTMLTemplateElement>();

	private $: Record<string, MetaPlugin> = {};
	private $g: Record<string, unknown> = {};

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

	/**
	 * Registers a plugin in the signature.
	 * @import {Plugin} from "./Plugin.js";
	 * @param {string} name The name of the plugin.
	 * @param {Plugin} plugin The plugin to register.
	 */
	public use(name: string, plugin: Plugin): void {
		if (this.$[name]) {
			throw new Error(`Plugin with name ${name} already exists.`);
		}

		let modules: Record<string, Record<string, unknown>> = {};

		Object.keys(plugin.modules).forEach((key) => {
			modules[key] = plugin.modules[key]();
		});

		this.$[name] = {
			plugin: plugin.define(modules),
			modules
		};

		this.$g[name] = this.$[name].plugin;
	}

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

		let fragment: html | Promise<html> = {
			strings: Object.assign([], {raw: []}) as TemplateStringsArray,
			values: []
		};

		try {
			fragment = component.render();
		} catch (err) {
			if (err instanceof Error) {
				throw {id: "unknown-from", from: component.name, err: err} as ErrorUnion;
			}
		}

		const template = document.createElement("template");

		((next: () => void) => {
			if (fragment instanceof Promise) {
				fragment.then((html: html) => {
					template.content.appendChild(this.templateToElement(html, component.name))
					next();
				}).catch((err: Error) => {
					throw {id: "unknown-from", from: component.name, err: err} as ErrorUnion;
				});
			} else if (typeof fragment === "object") {
				template.content.appendChild(this.templateToElement(fragment, component.name));
				next();
			}
		})(() => {
			if (template.content.children.length !== 1) {
				throw new Error(`Component '${component.name}' must render a single root element.`);
			}

			const newElement = template.content.firstElementChild as Element;

			// Preserve old ref attribute
			let oldRef = ref.element.getAttribute("ref");
			if (oldRef) {
				newElement.setAttribute("ref", oldRef);
			}

			// Preserve si-group attribute
			if (component.groups.length > 0) {
				newElement.setAttribute("si-group", component.groups.join(" "));
			}

			this.render(template.content);

			component.onRender?.(); // lifecycle hook

			ref.element.replaceWith(newElement);
			ref.element = newElement;

			component.onMount?.(newElement); // lifecycle hook
		})
	}

	/**
	 * Starts rendering in the specified area.
	 * @param {string} selector The selector of the element where the signature should be rendered.
	 * @param {() => void} [callback] Optional callback that will be called after rendering is complete.
	 */
	public contact(selector: string, callback?: () => void): void {
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

				if (callback) {
					callback();
				}
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
				message = message.replace(new RegExp(`#${key}`, "gm"), String(err[key as keyof typeof err]));
			});

			if (window.SIGNATURE?.DEV_MODE) console.log(err) // dev

			if (err.id in ["unknown", "unknown-from", "render-async-failed"]) {
				console.error(`[${err.id}] ${message}`, (err as {
					err: Error
				}).err);
			} else console.error(`[${err.id}] ${message}`);

			throw "Page rendering was interrupted by Signature due to the above error.";
		});
	}

	private templateToString(template: html): string {
		let body = "";

		for (let i = 0; i < template.strings.length; i++) {
			body += template.strings[i];

			if (i < template.values.length) {
				body += `<!--si-mark-${i}-->`
			}
		}

		return body;
	}

	private fillTemplate(template: html, markup: string): HTMLTemplateElement {
		let body: HTMLTemplateElement;

		if (this.bank.has(template.strings.join("@@"))) {
			body = this.bank.get(template.strings.join("@@"))?.cloneNode(true) as HTMLTemplateElement;
		} else {
			body = document.createElement("template");
			body.innerHTML = markup;

			this.bank.set(template.strings.join("@@"), body.cloneNode(true) as HTMLTemplateElement);
		}

		// Processing si-mark comments
		(() => {
			let walker = document.createTreeWalker(body.content, NodeFilter.SHOW_COMMENT);

			let node: ChildNode;

			let marks: ChildNode[] = [];

			while ((node = walker.nextNode() as ChildNode)) {
				if (/si-mark-\d+/gm.test(node.nodeValue ?? "")) {
					marks.push(node);
				}
			}

			for (const node of marks) {
				const value = template.values[Number(
					(
						(node.nodeValue ?? "").match(/si-mark-(\d+)/m) as string[]
					)[1]
				)];

				if (typeof value === "object" && value.type === "unsafeHTML") {
					let obj = document.createElement("div");
					obj.innerHTML = value.value;

					while (obj.firstChild) {
						node.parentNode?.insertBefore(obj.firstChild, node);
					}
					node.remove();
				} else {
					node.replaceWith(document.createTextNode(String(value)));
				}
			}
		})();

		// Processing si-mark attributes
		(() => {
			let walker = document.createTreeWalker(body.content, NodeFilter.SHOW_ELEMENT);

			let node: Element;

			while ((node = walker.nextNode() as Element)) {
				for (const attr of Array.from(node.attributes)) {
					if (/<!--si-mark-\d+-->/gm.test(attr.value)) {
						const match: RegExpMatchArray = attr.value.match(/si-mark-(\d+)/m) as RegExpMatchArray;

						if (match) {
							const value = template.values[Number(match[1])];

							node.setAttribute(attr.name, String(value));
						}
					}
				}
			}
		})();

		return body;
	}

	private templateToElement(template: html, component: string): HTMLElement {
		const markup: string = this.templateToString(template);
		const body: HTMLTemplateElement = this.fillTemplate(template, markup);

		if (body.content.children.length !== 1) {
			throw {id: "multiple-root-elements", elements: body.innerHTML, component} as ErrorUnion;
		}

		return (body.content.firstElementChild as HTMLElement);
	}

	private render(frame: Element | DocumentFragment): void {
		for (const com of Object.keys(this.components)) {
			const component: ComponentConstructor = this.components[com];

			// Find all elements with the component name in the frame
			for (const el of Array.from(frame.querySelectorAll(com)).concat(Array.from(frame.querySelectorAll(`[si-component="${com}"]`)))) {
				const renderer: Component = new component();

				renderer.$ = this.$g; // injecting plugins
				Object.freeze(renderer.$); // prevent plugins from being modified by components

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
								case "array":
									try {
										val = JSON.parse(attr);
									} catch (e) {
										throw {
											id: "invalid-value-for-property",
											component: com,
											prop: prop,
											value: attr,
											attr: attr
										} as ErrorUnion;
									}
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

				let fragment: html | Promise<html> = {
					strings: Object.assign([], {raw: []}) as TemplateStringsArray,
					values: []
				};

				try {
					fragment = renderer.render();
				} catch (err) {
					if (err instanceof Error) {
						throw {id: "unknown-from", from: renderer.name, err: err} as ErrorUnion;
					}
				}

				((next: () => void) => {
					if (fragment instanceof Promise) {
						try {
							fragment.then((html: html) => {
								body.appendChild(this.templateToElement(html, com));
								next();
							}).catch((err: Error) => {
								throw {id: "unknown-from", from: renderer.name, err: err} as ErrorUnion;
							});
						} catch (err) {
							throw {id: "render-async-failed", component: com, err: err} as ErrorUnion;
						}
					} else if (typeof fragment === "object") {
						body.appendChild(this.templateToElement(fragment, com));
						next();
					}
				})(() => {
					this.render(body.content);

					renderer.onRender?.(); // lifecycle hook

					const mountEl: Element = body.firstElementChild as Element;

					// Processing group
					if (renderer?.groups.length > 0) {
						mountEl.setAttribute("si-group", renderer.groups.join(" "));
					}

					// Processing ref
					if (el.hasAttribute("ref") || renderer.options.generateRefIfNotSpecified) {
						let refName = el.getAttribute("ref");

						if (refName === null) {
							refName = "";
						}

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

						renderer.ref = {
							id: refName,
							contact: (...props: any[]) => this.contactWith(refName, ...props),
							update: () => this.updateRef(refName)
						};
					}

					// Copying another attributes from the original element to the new one, with exceptions
					for (const attr of Array.from(el.attributes)) {
						const name: string = attr.name;

						if (renderer.props[name] !== undefined || name === "ref" || name === "si-component" || name === "si-group") continue;

						if (!mountEl.hasAttribute(name)) mountEl.setAttribute(name, attr.value);
					}

					el.replaceWith(body.firstElementChild as Element);

					renderer.onMount?.(mountEl); // lifecycle hook
				});
			}
		}
	}
}