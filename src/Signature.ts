import Component, {ComponentConstructor} from "./Component.js";
import Ref from "./Ref.js";

let _counter = 0;

export default class Signature {
	private components: Record<string, ComponentConstructor> = {};
	private refs: Record<string, Ref> = {};

	constructor() {
	}

	/**
	 * Starts rendering in the specified area.
	 * @param {string} selector The selector of the element where the signature should be rendered.
	 */
	public contact(selector: string): void {
		const mainFrame = document.querySelector(selector);

		if (!mainFrame) {
			throw new Error(`Element not found for selector: ${selector}`);
		}

		const secondaryFrame = document.createElement("div");
		secondaryFrame.innerHTML = mainFrame.innerHTML;

		this.render(secondaryFrame);

		mainFrame.replaceChildren(...Array.from(secondaryFrame.childNodes));
	}

	/**
	 * Adds a component to the signature.
	 * @param {ComponentConstructor} component The component to add.
	 */
	public add(component: ComponentConstructor): void {
		if (this.components[component.name]) {
			console.warn(new Error(`Component with name ${component.name} already exists.`));
		}

		this.components[component.name] = component;
	}

	/**
	 * Returns a reference.
	 * @param {string} name The name of the reference.
	 * @return {Element | undefined} The element associated with the reference, or undefined if it does not exist.
	 */
	public ref(name: string): Element | undefined {
		return this.refs[name]?.element;
	}

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

		const html = component.render().trim();
		const template = document.createElement("template");
		template.innerHTML = html;

		if (template.content.children.length !== 1) {
			throw new Error(`Component '${component.name}' must render a single root element.`);
		}

		const newElement = template.content.firstElementChild as Element;

		this.render(template);

		component.onRender?.(); // lifecycle hook

		ref.element.replaceWith(newElement);
		ref.element = newElement;

		component.onMount?.(newElement); // lifecycle hook
	}

	private render(frame: Element): void {
		for (const com of Object.keys(this.components)) {
			const component = this.components[com];

			for (const el of Array.from(frame.querySelectorAll(com))) {
				const renderer: Component = new component();
				renderer.onInit?.(); // lifecycle hook

				if (el instanceof HTMLElement) {
					renderer.content = el.innerHTML.trim();

					for (const prop of Object.keys(renderer.props)) {
						let attr = el.getAttribute(prop);

						if (attr === null) {
							renderer.data[prop] = null;
						} else if (attr === "") {
							if (renderer.props[prop].isValid(attr)) {
								renderer.data[prop] = null;
							}
						} else {
							let val;

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
									throw new Error(`Unsupported type for property '${prop}' in component '${com}': ${renderer.props[prop].type}`);
							}

							if (renderer.props[prop].isValid(val)) {
								renderer.data[prop] = val;
							} else {
								throw new Error(`Invalid value for property '${prop}' in component '${com}': ${attr}`);
							}
						}
					}
				}

				const body = document.createElement("template");
				body.innerHTML = renderer.render().trim();

				if (body.content.children.length > 1) {
					throw new Error(`Component '${com}' must render a single root element.`);
				}

				this.render(body);
				renderer.onRender?.(); // lifecycle hook

				const mountEl: Element = body.content.firstElementChild as Element;

				if (el.hasAttribute("ref")) {
					let refName = el.getAttribute("ref") as string;

					_counter++;

					if (refName === "") {
						refName = `r${_counter}${Math.random().toString(36).substring(2, 15)}${_counter}`;
					}

					if (this.refs[refName]) {
						throw new Error(`Ref with name ${refName} already exists.`);
					}

					this.refs[refName] = new Ref(renderer, mountEl);

					mountEl.setAttribute("ref", refName);
				}

				el.replaceWith(body.content);

				renderer.onMount?.(mountEl); // lifecycle hook
			}
		}
	}
}