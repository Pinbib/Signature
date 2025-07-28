import component from "./types/Component.js";
import Prop from "./types/Prop.js";

import type {Options} from "./types/Component.js";

export default abstract class Component implements component {
	abstract readonly name: string;
	content?: string;

	options: Options = {
		generateRefIfNotSpecified: false,
	}

	ref?: {
		readonly id: string;
		readonly contact: (...props: any[]) => any;
		readonly update: () => void;
	}

	readonly props: Record<string, Prop> = {};
	readonly data: Record<string, string | number | boolean | null> = {};

	abstract render(): string | Promise<string>;

	abstract onInit?(): void;

	abstract onRender?(): void;

	abstract onMount?(el: Element): void;

	abstract onContact?(...props: any[]): any;

	abstract onPropsParsed?(): void;

	abstract onPropParsed?(prop: Prop, value: string | number | boolean | null): void;
}

export type ComponentConstructor = new () => Component;