import Component from "./types/Component.js";

export default class Ref {
	public instance: Component;
	public element: Element;

	constructor(instance: Component, element: Element) {
		this.instance = instance;
		this.element = element;
	}
}