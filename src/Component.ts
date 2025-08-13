import component, {html} from "./types/Component.js";
import Prop from "./types/Prop.js";

import type {Options} from "./types/Component.js";
import type {Ref} from "./types/Component.js";

export default abstract class Component implements component {
	abstract readonly name: string;
	content?: string;

	options: Options = {
		generateRefIfNotSpecified: false,
	}

	ref?: Ref;

	readonly props: Record<string, Prop> = {};
	readonly data: Record<string, string | number | boolean | null> = {};

	abstract render(): html | Promise<html>;

	onInit?(): void {
	};

	onRender?(): void {
	};

	onMount?(el: Element): void {
	};

	onContact?(...props: any[]): any {
	};

	onPropsParsed?(): void {
	};

	onPropParsed?(prop: Prop, value: string | number | boolean | null): void {
	};
}

export type ComponentConstructor = new () => Component;