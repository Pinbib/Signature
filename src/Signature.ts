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

		Object.keys(this.components).forEach((com: string) => {
			let component = this.components[com];

			mainFrame.querySelectorAll(com).forEach((el: Element) => {
				let renderer: Component = new component();
				el.innerHTML = renderer.render();
			});
		});
	}

	public add(component: ComponentConstructor): void {
		if (this.components[component.name]) {
			console.warn(new Error(`Component with name ${component.name} already exists.`));
		}

		this.components[component.name] = component;
	}
}