interface Component {
	name: string;

	/**
	 * Optional content that is specified in the component tag.
	 */
	content?: string;

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
}

export default Component;