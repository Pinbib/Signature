import component from "./types/Component.js";

export default abstract class Component implements component {
	abstract readonly name: string;

	abstract render(): string;
}

export type ComponentConstructor = new () => Component;