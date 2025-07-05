interface Component {
	name: string;

	/**
	 * Optional content that is specified in the component tag.
	 */
	data?: string;

	/**
	 * Returns the component as a string.
	 * @returns {string} The rendered component as a string.
	 */
	render(): string;
}

export default Component;