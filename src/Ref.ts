import Component from "./types/Component.js";

export default class Ref {
	public element: Element;
	public readonly instance: Component;

	constructor(instance: Component, element: Element) {
		this.instance = instance;
		this.element = element;
	}
}