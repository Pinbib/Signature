import Component, {ComponentConstructor} from "./Component.js";

export default class Signature {
	private components: Record<string, ComponentConstructor> = {};

	constructor() {
	}

	public contact(selector: string): void {
		let mainFrame = document.querySelector(selector);

		if (!mainFrame) {
			throw new Error(`Element not found for selector: ${selector}`);
		}

		let secondaryFrame = document.createElement("div");
		secondaryFrame.innerHTML = mainFrame.innerHTML;

		this.render(secondaryFrame);

		mainFrame.replaceChildren(...Array.from(secondaryFrame.childNodes));
	}

	public add(component: ComponentConstructor): void {
		if (this.components[component.name]) {
			console.warn(new Error(`Component with name ${component.name} already exists.`));
		}

		this.components[component.name] = component;
	}

	private render(frame: Element): void {
		Object.keys(this.components).forEach((com: string) => {
			let component = this.components[com];

			frame.querySelectorAll(com).forEach((el: Element) => {
				let renderer: Component = new component();

				let body = document.createElement("template");
				body.innerHTML = renderer.render().trim();

				this.render(body);

				el.replaceWith(body.content);
			});
		});
	}
}