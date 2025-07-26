import prop from "./types/Prop.js"

type TypesMap = {
	string: string;
	number: number;
	boolean: boolean;
	array: any[];
	null: null;
}

export default class Prop<T extends keyof TypesMap> implements prop {
	public readonly type: T;
	public readonly required: boolean = true;
	public readonly validate: (value: string | number | boolean | any[] | null) => boolean;

	constructor(type: T, required: boolean = true, validate?: (value: string | number | boolean | any[] | null) => boolean) {
		this.type = type;
		this.required = required;
		if (validate) {
			this.validate = validate;
		} else {
			this.validate = () => true;
		}
	}

	public isValid(value: TypesMap[keyof TypesMap]): boolean {
		switch (this.type) {
			case "boolean":
				return typeof value === "boolean";
			case "number":
				return typeof value === "number" && !isNaN(value);
			case "string":
				return typeof value === "string";
			case "array":
				return Array.isArray(value);
			case "null":
				return value === null;
			default:
				return false;
		}
	}
}