import prop from "./types/Prop.js"

type TypesMap = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
}

export default class Prop<T extends keyof TypesMap> implements prop {
	public readonly type: T;

	constructor(type: T) {
		this.type = type;
	}

	// public parse(value: string): TypesMap[T] {
	// 	switch (this.type) {
	// 		case "boolean":
	// 			return Boolean(value) as TypesMap[T];
	// 		case "number":
	// 			return Number(value) as TypesMap[T];
	// 		case "string":
	// 			return value as TypesMap[T];
	// 		case "null":
	// 			return null as TypesMap[T];
	// 		default:
	// 			throw new Error(`Unsupported type: ${this.type}`);
	// 	}
	// }

	public isValid(value: TypesMap[keyof TypesMap]): boolean {
		switch (this.type) {
			case "boolean":
				return typeof value === "boolean";
			case "number":
				return typeof value === "number" && !isNaN(value);
			case "string":
				return typeof value === "string";
			case "null":
				return value === null;
			default:
				return false;
		}
	}
}