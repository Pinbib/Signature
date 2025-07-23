type TypesMap = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
}

interface Prop {
	/**
	 * The type of the property.
	 */
	type: keyof TypesMap;

	/**
	 * Checks the validity of the value and the specified type
	 * @param {string | number | boolean | null} value
	 * @return boolean
	 */

	isValid: (value: TypesMap[keyof TypesMap]) => boolean;
	/**
	 * Indicates whether the property is required.
	 */
	required?: boolean;

	/**
	 * A function to validate the value of the property.
	 * @param {string | number | boolean | null} value
	 * @return boolean
	 */
	validate?: (value: TypesMap[keyof TypesMap]) => boolean;
}

export default Prop;