import component from "./types/Component.js";

export default abstract class Component implements component {
	abstract readonly name: string;
	data?: string;

	abstract render(): string;

	abstract onMount(el: Element): void;
}

export type ComponentConstructor = new () => Component;