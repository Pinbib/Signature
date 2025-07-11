import component from "./types/Component.js";

export default abstract class Component implements component {
	abstract readonly name: string;
	content?: string;

	abstract render(): string;

	abstract onInit(): void;

	abstract onRender(): void;

	abstract onMount(el: Element): void;

	abstract onContact<P extends any[], T>(...props: P): T;
}

export type ComponentConstructor = new () => Component;