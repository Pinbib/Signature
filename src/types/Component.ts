import Prop from "./Prop.js";

export type Options = {
	/**
	 * Specifies whether the component must have a ref.
	 */
	generateRefIfNotSpecified?: boolean;
};

interface Component {
	name: string;

	options: Options;

	/**
	 * Optional reference to the component.
	 */
	ref?: {
		/**
		 * Unique identifier for the component.
		 */
		id: string;

		/**
		 * Function to contact the component with props.
		 * @param {...any[]} props - The properties to send to the component.
		 * @returns {any}
		 */
		contact: (...props: any[]) => any;

		/**
		 * Function to update the component.
		 */
		update: () => void;
	}

	/**
	 * Optional content that is specified in the component tag.
	 */
	content?: string;

	/**
	 * Defining component properties.
	 */
	props: Record<string, Prop>;

	/**
	 * The properties of the component.
	 */
	data: Record<string, string | number | boolean | null>;


	/**
	 * Returns the component as a string.
	 * @returns {string} The rendered component as a string.
	 */
	render(): string | Promise<string>;

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