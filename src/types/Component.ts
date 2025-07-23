import Prop from "./Prop.js";

interface Component {
	name: string;

	/**
	 * Optional content that is specified in the component tag.
	 */
	content?: string;


	props: Record<string, Prop>;
	data: Record<string, string | number | boolean | null>;


	/**
	 * Returns the component as a string.
	 * @returns {string} The rendered component as a string.
	 */
	render(): string;

	/**
	 * Lifecycle hook that is called when the component is initialized.
	 */
	onInit?(): void;

	/**
	 * Lifecycle hook that is called when the component is rendered.
	 */
	onRender?(): void;

	/**
	 * Lifecycle hook that is called when the component is mounted to the DOM.
	 * @param {Element} el The element to which the component is mounted.
	 */
	onMount?(el: Element): void;

	/**
	 * Lifecycle hook called via Signature.contactWith
	 * @param {...any[]} props
	 */
	onContact?(...props: any[]): any;

	/**
	 * Lifecycle hook that is called when the component's props are parsed.
	 */
	onPropsParsed?(): void;

	/**
	 * Lifecycle hook that is called when a prop is parsed.
	 * @param {Prop} prop The prop that was parsed.
	 * @param {string | number | boolean | null} value The value of the prop.
	 */
	onPropParsed?(prop: Prop, value: string | number | boolean | null): void;
}

export default Component;