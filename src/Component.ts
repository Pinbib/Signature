import component from "./types/Component.js";
import Prop from "./types/Prop.js";

export default abstract class Component implements component {
	abstract readonly name: string;
	content?: string;

	props: Record<string, Prop> = {};
	readonly data: Record<string, string | number | boolean | null> = {};

	abstract render(): string;

	abstract onInit?(): void;

	abstract onRender?(): void;

	abstract onMount?(el: Element): void;

	abstract onContact?(...props: any[]): any;
}

export type ComponentConstructor = new () => Component;